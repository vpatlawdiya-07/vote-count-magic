import { Candidate } from '@/types/voting';
import { User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidate: Candidate) => void;
  disabled?: boolean;
}

export const CandidateCard = ({ candidate, isSelected, onSelect, disabled }: CandidateCardProps) => {
  return (
    <button
      onClick={() => !disabled && onSelect(candidate)}
      disabled={disabled}
      className={cn(
        "relative w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group",
        "hover:shadow-lg hover:-translate-y-1",
        isSelected 
          ? "border-primary bg-primary/5 shadow-glow" 
          : "border-border bg-card hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none"
      )}
    >
      {/* Selection indicator */}
      <div className={cn(
        "absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300",
        isSelected 
          ? "border-primary bg-primary text-primary-foreground" 
          : "border-muted-foreground/30 bg-transparent"
      )}>
        {isSelected && <Check className="w-4 h-4" />}
      </div>

      {/* Candidate info */}
      <div className="flex items-start gap-4">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-xl"
          style={{ backgroundColor: candidate.color }}
        >
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl font-semibold text-foreground mb-1 truncate">
            {candidate.name}
          </h3>
          <p 
            className="text-sm font-medium mb-2"
            style={{ color: candidate.color }}
          >
            {candidate.party}
          </p>
          <p className="text-sm text-muted-foreground">
            Running for {candidate.position}
          </p>
        </div>
      </div>

      {/* Hover effect bar */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        style={{ backgroundColor: candidate.color }}
      />
    </button>
  );
};
