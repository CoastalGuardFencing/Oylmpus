import React, { useState } from 'react';
import { UserCheckIcon, RedoIcon } from './icons';

interface AlphaReviewPanelProps {
  code: string;
  isPerfect: boolean;
  onApprove: () => void;
  onRequestRevision: (feedback: string) => void;
}

const AlphaReviewPanel: React.FC<AlphaReviewPanelProps> = ({ code, isPerfect, onApprove, onRequestRevision }) => {
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [deployCommand, setDeployCommand] = useState('');

  const handleRevisionSubmit = () => {
    if (revisionFeedback.trim()) {
      onRequestRevision(revisionFeedback);
      setShowRevisionInput(false);
      setRevisionFeedback('');
    }
  };

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deployCommand.toLowerCase() === 'deploy') {
        onApprove();
    }
  };

  if (!isPerfect) {
    return (
        <div className="flex items-center justify-center h-full p-6 text-center">
            <div>
                <UserCheckIcon className="w-16 h-16 text-border mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text-main">Alpha Review</h2>
                <p className="text-text-muted mt-2">Awaiting AI perfection declaration before final human review.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <div className="flex-shrink-0 flex items-center gap-3 pb-4 border-b border-border">
        <UserCheckIcon className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-primary">Alpha Review: Final Approval</h2>
          <p className="text-text-muted">The AI has declared perfection. Inscribe `deploy` to grant final human sign-off.</p>
        </div>
      </div>

      <div className="flex-1 my-4 min-h-0">
        <pre className="w-full h-full bg-surface-alt p-4 rounded-lg text-text-main font-mono text-sm overflow-auto">
          <code>{code}</code>
        </pre>
      </div>
      
      {!showRevisionInput && (
        <div className="flex-shrink-0 flex flex-col gap-4">
            <form onSubmit={handleDeploySubmit} className="p-4 bg-surface-alt rounded-lg border border-border">
                 <label htmlFor="deploy-command" className="block text-sm font-semibold text-text-main mb-2">Final Affirmation</label>
                 <div className="flex items-center gap-2 font-mono text-sm bg-surface p-2 rounded">
                    <span className="text-success">{'>'}</span>
                    <input 
                        id="deploy-command"
                        type="text"
                        value={deployCommand}
                        onChange={(e) => setDeployCommand(e.target.value)}
                        placeholder="Type 'deploy' to approve and unlock publishing..."
                        className="flex-1 bg-transparent text-text-main outline-none"
                    />
                 </div>
            </form>
            <button 
                onClick={() => setShowRevisionInput(true)}
                className="w-full px-4 py-3 bg-surface-alt hover:bg-border text-text-main font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
                <RedoIcon className="w-5 h-5" /> Request Revisions
            </button>
        </div>
      )}
      
      {showRevisionInput && (
        <div className="flex-shrink-0 flex flex-col gap-2 p-4 bg-surface-alt border border-border rounded-lg">
          <h3 className="font-semibold text-text-main">Revision Request</h3>
          <p className="text-sm text-text-muted">Provide feedback for the next review cycle. This will be prepended to the code.</p>
          <textarea
            value={revisionFeedback}
            onChange={(e) => setRevisionFeedback(e.target.value)}
            placeholder="e.g., 'Please add comments to the main function...'"
            className="w-full h-24 p-2 bg-surface border border-border rounded-md text-text-main font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-y"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowRevisionInput(false)} className="px-4 py-2 text-sm text-text-muted hover:bg-border rounded-md">Cancel</button>
            <button onClick={handleRevisionSubmit} disabled={!revisionFeedback.trim()} className="px-4 py-2 text-sm bg-primary text-on-primary font-semibold rounded-md disabled:opacity-50">Submit Request</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlphaReviewPanel;