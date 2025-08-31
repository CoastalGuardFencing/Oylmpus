import React, { useState } from 'react';
import { MagicWandIcon, SparklesIcon } from './icons';

interface PromptEngineeringPanelProps {
    isOnline: boolean;
    onRefine: (prompt: string) => void;
    suggestions: string[];
    isRefining: boolean;
    onApply: (prompt: string) => void;
}

const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({ isOnline, onRefine, suggestions, isRefining, onApply }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = () => {
        if (prompt.trim() && !isRefining) {
            onRefine(prompt);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <MagicWandIcon className="w-5 h-5" /> Prompt Engineering Assistant
                </h3>
                <p className="text-sm text-text-muted mb-4">
                    Refine your natural language instructions to improve AI collaboration and resonance.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a prompt or goal to refine..."
                    className="w-full h-24 p-2 bg-surface-alt border border-border rounded-md text-text-main font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-y"
                    disabled={isRefining || !isOnline}
                />
                <button
                    onClick={handleSubmit}
                    disabled={isRefining || !isOnline || !prompt.trim()}
                    className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                >
                    <SparklesIcon className={`w-5 h-5 ${isRefining ? 'animate-spin' : ''}`} />
                    {isRefining ? 'Refining...' : 'Refine Prompt'}
                </button>
            </div>
            
            {suggestions.length > 0 && (
                 <div className="flex-1 mt-4 min-h-0 space-y-3">
                     <h4 className="text-md font-semibold text-text-main">Suggestions</h4>
                     {suggestions.map((suggestion, index) => (
                         <div key={index} className="bg-surface-alt p-3 rounded-lg border border-border flex justify-between items-start gap-2">
                             <p className="text-sm text-text-main flex-1">{suggestion}</p>
                             <button onClick={() => onApply(suggestion)} className="text-xs px-2 py-1 bg-secondary text-on-primary-alt rounded hover:opacity-90">
                                 Set as Intent
                             </button>
                         </div>
                     ))}
                 </div>
            )}
        </div>
    );
};

export default PromptEngineeringPanel;
