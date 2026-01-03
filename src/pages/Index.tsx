import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { AuthModal } from '@/components/AuthModal';
import { VotingBooth } from '@/components/VotingBooth';
import { ResultsSection } from '@/components/ResultsSection';
import { VerifyVoteSection } from '@/components/VerifyVoteSection';
import { Footer } from '@/components/Footer';
import { Voter, Vote } from '@/types/voting';
import { Toaster } from 'sonner';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [voter, setVoter] = useState<Voter | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [resultRefreshTrigger, setResultRefreshTrigger] = useState(0);

  const handleGetStarted = () => {
    if (voter && !hasVoted) {
      // Already authenticated, scroll to voting section
      document.getElementById('vote')?.scrollIntoView({ behavior: 'smooth' });
    } else if (!hasVoted) {
      setIsAuthModalOpen(true);
    } else {
      // Already voted, scroll to results
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthenticated = (authenticatedVoter: Voter) => {
    setVoter(authenticatedVoter);
    setIsAuthModalOpen(false);
    
    // Scroll to voting section after a brief delay
    setTimeout(() => {
      document.getElementById('vote')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleVoteComplete = (vote: Vote) => {
    setHasVoted(true);
    setResultRefreshTrigger(prev => prev + 1);
    
    // Scroll to results after voting
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background">
      <Toaster position="top-center" richColors />
      
      <HeroSection onGetStarted={handleGetStarted} />

      {voter && !hasVoted && (
        <VotingBooth voter={voter} onVoteComplete={handleVoteComplete} />
      )}

      <ResultsSection refreshTrigger={resultRefreshTrigger} />

      <div id="verify">
        <VerifyVoteSection />
      </div>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </main>
  );
};

export default Index;
