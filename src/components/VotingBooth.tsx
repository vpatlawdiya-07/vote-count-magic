import { useState } from 'react';
import { sampleCandidates, sampleElection, votingService } from '@/lib/votingService';
import { Candidate, Voter, Vote } from '@/types/voting';
import { CandidateCard } from './CandidateCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Vote as VoteIcon, AlertTriangle, CheckCircle2, Shield, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface VotingBoothProps {
  voter: Voter;
  onVoteComplete: (vote: Vote) => void;
}

export const VotingBooth = ({ voter, onVoteComplete }: VotingBoothProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedVote, setSubmittedVote] = useState<Vote | null>(null);

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleVoteSubmit = () => {
    if (!selectedCandidate) return;
    setIsConfirmOpen(true);
  };

  const confirmVote = async () => {
    if (!selectedCandidate) return;

    setIsSubmitting(true);

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = votingService.castVote(voter.id, selectedCandidate.id);

    if (result.success && result.vote) {
      setSubmittedVote(result.vote);
      toast.success('Vote cast successfully!', {
        description: 'Your vote has been securely recorded.',
      });
      onVoteComplete(result.vote);
    } else {
      toast.error('Failed to cast vote', {
        description: result.error,
      });
    }

    setIsSubmitting(false);
    setIsConfirmOpen(false);
  };

  const copyVoteId = () => {
    if (submittedVote) {
      navigator.clipboard.writeText(submittedVote.id);
      toast.success('Vote ID copied to clipboard');
    }
  };

  if (submittedVote) {
    return (
      <section className="py-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <div className="bg-card rounded-3xl shadow-xl p-8 md:p-12 text-center border border-success/20">
            <div className="w-24 h-24 rounded-full gradient-verification mx-auto mb-6 flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-success-foreground" />
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Vote Successfully Cast!
            </h2>

            <p className="text-muted-foreground mb-8">
              Thank you for participating in democracy. Your vote has been securely recorded and encrypted.
            </p>

            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Your Vote Verification ID</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-sm md:text-base font-mono bg-background px-4 py-2 rounded-lg border">
                  {submittedVote.id}
                </code>
                <Button variant="ghost" size="icon" onClick={copyVoteId}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Save this ID to verify your vote was counted correctly
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-success" />
              <span>Digital signature: {submittedVote.signature}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" id="vote">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <VoteIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Voting Now Open</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {sampleElection.title}
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            {sampleElection.description}. Select your candidate below and confirm your choice.
          </p>
        </div>

        {/* Voter info banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              {voter.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-sm">{voter.name}</p>
              <p className="text-xs text-muted-foreground">{voter.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="w-4 h-4" />
            <span>Authenticated & Eligible</span>
          </div>
        </div>

        {/* Candidate grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {sampleCandidates.map((candidate, index) => (
            <div 
              key={candidate.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CandidateCard
                candidate={candidate}
                isSelected={selectedCandidate?.id === candidate.id}
                onSelect={handleCandidateSelect}
              />
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <Button
            variant="vote"
            size="xl"
            onClick={handleVoteSubmit}
            disabled={!selectedCandidate}
            className="min-w-64"
          >
            <VoteIcon className="w-5 h-5 mr-2" />
            {selectedCandidate ? `Vote for ${selectedCandidate.name.split(' ')[0]}` : 'Select a Candidate'}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-accent" />
            </div>
            <DialogTitle className="font-display text-2xl">Confirm Your Vote</DialogTitle>
            <DialogDescription>
              You are about to cast your vote. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">You are voting for:</p>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-bold"
                  style={{ backgroundColor: selectedCandidate.color }}
                >
                  {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{selectedCandidate.name}</p>
                  <p className="text-sm" style={{ color: selectedCandidate.color }}>{selectedCandidate.party}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsConfirmOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="vote" className="flex-1" onClick={confirmVote} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm Vote'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
