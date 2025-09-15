import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Users, Database } from "lucide-react";
import heroImage from "@/assets/hero-security.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(213_94%_48%_/_0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,hsl(213_94%_48%_/_0.1)_50%,transparent_65%)]" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <Badge variant="secondary" className="mb-4 bg-primary-glow/20 text-primary border-primary/30">
              <Shield className="w-4 h-4 mr-2" />
              SIH 2025 Solution
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                ExaSecure AI
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl font-semibold text-primary-foreground mb-4">
              Aadhaar-Linked Smart Identity & Academic Authenticity Validator
            </p>
            
            <p className="text-lg text-primary-foreground/80 max-w-2xl leading-relaxed">
              Revolutionary AI-powered platform that validates academic documents and authenticates 
              candidate identity in real-time. Stop fraud before it happens with biometric verification, 
              blockchain security, and advanced forgery detection.
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/10 backdrop-blur-sm">
                <CheckCircle className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground font-medium">Biometric Auth</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/10 backdrop-blur-sm">
                <Shield className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground font-medium">AI Fraud Detection</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/10 backdrop-blur-sm">
                <Database className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground font-medium">Blockchain Security</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/10 backdrop-blur-sm">
                <Users className="w-6 h-6 text-accent" />
                <span className="text-primary-foreground font-medium">Real-time Validation</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg animate-glow-pulse"
                onClick={() => window.location.href = '/auth'}
              >
                Start Verification
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4 text-lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                View Dashboard
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img 
                src={heroImage} 
                alt="ExaSecure AI - Advanced Security Platform" 
                className="w-full h-auto object-cover"
              />
              {/* Overlay with stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary">99.9%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Monitoring</div>
                  </div>
                  <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary">0.3s</div>
                    <div className="text-xs text-muted-foreground">Response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;