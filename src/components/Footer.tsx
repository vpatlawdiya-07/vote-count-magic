import { Shield, Github, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-foreground text-background">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Digital Democracy</span>
            </div>
            <p className="text-background/60 text-sm max-w-md">
              Secure, transparent, and accessible voting for everyone. Built with blockchain-inspired technology to ensure every vote counts.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#vote" className="hover:text-background transition-colors">Cast Vote</a></li>
              <li><a href="#results" className="hover:text-background transition-colors">Live Results</a></li>
              <li><a href="#verify" className="hover:text-background transition-colors">Verify Vote</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#" className="hover:text-background transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} Digital Democracy. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-background/40 hover:text-background transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/40 hover:text-background transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/40 hover:text-background transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
