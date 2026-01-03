import { Shield, Vote, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const features = [
    { icon: Shield, label: 'Secure & Encrypted' },
    { icon: Vote, label: 'Instant Verification' },
    { icon: Users, label: 'Anonymous Voting' },
    { icon: CheckCircle, label: 'Auditable Results' },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center gradient-hero overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8 opacity-0 animate-fade-in-up">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">Secure Digital Voting Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 opacity-0 animate-fade-in-up stagger-1">
            Digital Democracy
            <span className="block text-accent mt-2">Your Vote Matters</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up stagger-2">
            Cast your vote securely and privately. Our blockchain-inspired technology ensures every vote is counted, verified, and protected.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 opacity-0 animate-fade-in-up stagger-3">
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              Cast Your Vote
            </Button>
            <Button variant="glass" size="xl" onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}>
              View Live Results
            </Button>
          </div>

          {/* Feature badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-0 animate-fade-in-up stagger-4">
            {features.map((feature, index) => (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 transition-all duration-300 hover:bg-primary-foreground/10 hover:scale-105"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <feature.icon className="w-6 h-6 text-accent" />
                <span className="text-sm font-medium text-primary-foreground">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};
