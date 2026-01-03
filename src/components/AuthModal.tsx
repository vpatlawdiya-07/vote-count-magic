import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';
import { votingService } from '@/lib/votingService';
import { Voter } from '@/types/voting';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (voter: Voter) => void;
}

export const AuthModal = ({ isOpen, onClose, onAuthenticated }: AuthModalProps) => {
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempVoter, setTempVoter] = useState<Voter | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);

    // Simulate verification code sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    const voter = votingService.registerVoter(email, name);
    setTempVoter(voter);
    setIsLoading(false);
    setStep('verify');
    
    toast.success(`Verification code sent to ${email}`, {
      description: `Your code is: ${voter.verificationCode} (demo only)`,
    });
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tempVoter) {
      setError('Session expired. Please start over.');
      return;
    }

    if (verificationCode.toUpperCase() !== tempVoter.verificationCode) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);

    toast.success('Authentication successful!', {
      description: 'You can now cast your vote.',
    });

    onAuthenticated(tempVoter);
    resetForm();
  };

  const resetForm = () => {
    setStep('email');
    setEmail('');
    setName('');
    setVerificationCode('');
    setError('');
    setTempVoter(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md gradient-card border-border/50">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-full gradient-hero flex items-center justify-center mb-4 shadow-glow">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="font-display text-2xl">
            {step === 'email' ? 'Voter Authentication' : 'Verify Your Identity'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 'email' 
              ? 'Enter your details to verify your voting eligibility'
              : 'Enter the verification code sent to your email'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="vote" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending code...' : 'Continue'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-character code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                className="text-center text-lg tracking-widest font-mono"
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="vote" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to email
            </button>
          </form>
        )}

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-success" />
            <span>256-bit encryption • Privacy protected</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
