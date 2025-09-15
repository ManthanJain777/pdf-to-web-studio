import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fingerprint, 
  Eye, 
  FileCheck, 
  Shield, 
  Wifi,
  BarChart3,
  Lock,
  Users
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Fingerprint,
      title: "Multi-Layer Biometric Verification",
      description: "Aadhaar-based fingerprint/iris authentication with government-certified identity validation.",
      details: ["Fingerprint scanning", "Iris recognition", "Anti-spoofing AI", "Government database integration"],
      category: "Identity"
    },
    {
      icon: Eye,
      title: "AI-Powered Face Recognition",
      description: "Advanced facial recognition with anti-spoofing technology for secure identity verification.",
      details: ["3D face mapping", "Liveness detection", "Signature verification", "CNN/SSIM models"],
      category: "AI Security"
    },
    {
      icon: FileCheck,
      title: "Certificate & Academic Validation",
      description: "OCR-based document extraction with cross-verification against institutional databases.",
      details: ["OCR text extraction", "Database verification", "Blockchain QR codes", "Institutional ERP integration"],
      category: "Validation"
    },
    {
      icon: Shield,
      title: "Forgery & Fraud Detection",
      description: "AI-driven anomaly detection to identify tampered documents and duplicate certificates.",
      details: ["Grade tampering detection", "Photo manipulation alerts", "Invalid ID scanning", "Duplicate certificate tracking"],
      category: "Security"
    },
    {
      icon: Wifi,
      title: "Exam Hall Security",
      description: "ESP32-based wireless device detection to prevent cheating and unauthorized devices.",
      details: ["Wi-Fi device scanning", "Bluetooth monitoring", "Hidden device detection", "Real-time alerts"],
      category: "Monitoring"
    },
    {
      icon: BarChart3,
      title: "Admin & Analytics Dashboard",
      description: "Comprehensive control center for education authorities with real-time monitoring.",
      details: ["Real-time fraud alerts", "Verification logs", "Candidate tracking", "Statistical reports"],
      category: "Analytics"
    },
    {
      icon: Lock,
      title: "Data Security & Privacy",
      description: "Enterprise-grade security with encrypted storage and role-based access control.",
      details: ["Aadhaar KYC compliance", "Encrypted data storage", "Role-based permissions", "Audit trails"],
      category: "Privacy"
    },
    {
      icon: Users,
      title: "Institutional Integration",
      description: "Seamless integration with university systems and education department databases.",
      details: ["Bulk record uploads", "API integrations", "Multi-tenant support", "Custom workflows"],
      category: "Integration"
    }
  ];

  const categories = ["All", "Identity", "AI Security", "Validation", "Security", "Monitoring", "Analytics", "Privacy", "Integration"];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Core Features
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Complete Security Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ExaSecure AI provides end-to-end protection against academic fraud through 
            advanced biometrics, AI detection, and blockchain verification.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative p-6 bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Category Badge */}
              <Badge 
                variant="secondary" 
                className="absolute top-4 right-4 text-xs bg-primary/10 text-primary border-primary/20"
              >
                {feature.category}
              </Badge>

              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature Details */}
              <div className="space-y-2">
                {feature.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-accent" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            </Card>
          ))}
        </div>

        {/* Impact Section */}
        <div className="mt-20 text-center animate-fade-in">
          <h3 className="text-3xl font-bold mb-8">Expected Impact</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Prevents fake degrees in jobs/admissions",
              "Ensures genuine candidates only",
              "Protects institutional reputation",
              "Creates trusted academic ecosystem"
            ].map((impact, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg bg-accent-light border border-accent/20 animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent-foreground font-bold">{index + 1}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;