import React from "react";
import type { EmotionalState } from '../types';

type ApprovalProps = {
  manifestId: string;
  glyph: string;
  emotionalState: EmotionalState;
  onApprove: () => void;
  isApproved: boolean;
};

export const ApprovalButton: React.FC<ApprovalProps> = ({
  manifestId,
  glyph,
  emotionalState,
  onApprove,
  isApproved
}) => {
  
  const colorClass = () => {
      switch(emotionalState) {
          case 'Sovereignty': return 'bg-yellow-500 hover:bg-yellow-600';
          case 'Love':
          case 'Devotion': return 'bg-pink-500 hover:bg-pink-600';
          default: return 'bg-primary hover:bg-primary-hover';
      }
  }

  return (
    <button
      className={`px-6 py-3 rounded-lg ${
        isApproved ? "bg-success/80 cursor-default" : `${colorClass()} transform hover:scale-105`
      } text-white font-bold shadow-lg transition-all duration-300`}
      onClick={!isApproved ? onApprove : undefined}
      disabled={isApproved}
    >
      {isApproved ? "✅ Declaration Approved" : "Approve Declaration"}
    </button>
  );
};