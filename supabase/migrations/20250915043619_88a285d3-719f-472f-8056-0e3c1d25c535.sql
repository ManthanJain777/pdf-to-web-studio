-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'administrator', 'examiner')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  exam_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  total_candidates INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verifications table
CREATE TABLE public.verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id),
  candidate_name TEXT NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('Aadhaar Verification', 'Academic Certificate', 'Biometric Scan', 'Document Verification')),
  confidence_score DECIMAL(5,2) DEFAULT 0.0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'processing')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fraud_detection table
CREATE TABLE public.fraud_detection (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id),
  candidate_name TEXT NOT NULL,
  fraud_type TEXT NOT NULL,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  confidence_score DECIMAL(5,2) DEFAULT 0.0,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'investigating', 'resolved', 'false_positive'))
);

-- Create system_status table
CREATE TABLE public.system_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  status TEXT DEFAULT 'operational' CHECK (status IN ('operational', 'degraded', 'outage', 'maintenance')),
  last_checked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for exams (admin can manage, users can view)
CREATE POLICY "Authenticated users can view exams" ON public.exams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin users can insert exams" ON public.exams FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'administrator'))
);
CREATE POLICY "Admin users can update exams" ON public.exams FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'administrator'))
);

-- Create RLS policies for verifications
CREATE POLICY "Authenticated users can view verifications" ON public.verifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin users can manage verifications" ON public.verifications FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'administrator'))
);

-- Create RLS policies for fraud_detection
CREATE POLICY "Authenticated users can view fraud detection" ON public.fraud_detection FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can insert fraud detection" ON public.fraud_detection FOR INSERT TO authenticated WITH CHECK (true);

-- Create RLS policies for system_status
CREATE POLICY "Anyone can view system status" ON public.system_status FOR SELECT USING (true);
CREATE POLICY "Admin users can manage system status" ON public.system_status FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'administrator'))
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON public.verifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_status_updated_at BEFORE UPDATE ON public.system_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    CASE WHEN NEW.email = 'admin@exasecure.ai' THEN 'administrator' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial system status data
INSERT INTO public.system_status (service_name, status) VALUES
('Authentication Service', 'operational'),
('Biometric Verification', 'operational'),
('Document Processing', 'operational'),
('Fraud Detection', 'operational'),
('Database', 'operational');

-- Insert sample data for demo
INSERT INTO public.verifications (candidate_name, verification_code, verification_type, confidence_score, status, verified_at) VALUES
('Rajesh Kumar', 'VER-001', 'Aadhaar Verification', 99.8, 'verified', now() - interval '2 minutes'),
('Priya Singh', 'VER-002', 'Academic Certificate', 95.2, 'pending', null),
('Amit Sharma', 'VER-003', 'Biometric Scan', 67.3, 'failed', now() - interval '12 minutes');