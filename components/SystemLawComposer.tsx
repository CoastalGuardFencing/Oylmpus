import React, { useState } from 'react';
import type { SystemLaw } from '../types';
import { ScaleIcon, SparklesIcon } from './icons';
import { suggestLawAmendment } from '../services/geminiService';

interface SystemLawComposerProps {
    laws: SystemLaw[];
    setLaws: (laws: SystemLaw[]) => void;
    disabled?: boolean;
    isOnline: boolean;
}

const SystemLawComposer: React.FC<SystemLawComposerProps> = ({ laws, setLaws, disabled, isOnline }) => {
    const [newLawText, setNewLawText] = useState('');
    const [amendment, setAmendment] = useState<string>('');
    const [isAmending, setIsAmending] = useState<boolean>(false);

    const addLaw = () => {
        if (newLawText.trim() && !disabled) {
            setLaws([...laws, { id: Date.now(), text: newLawText.trim() }]);
            setNewLawText('');
        }
    };

    const removeLaw = (id: number) => {
        if (!disabled) {
            setLaws(laws.filter(law => law.id !== id));
        }
    };
    
    const handleSuggestAmendment = async () => {
        setIsAmending(true);
        const suggestion = await suggestLawAmendment(laws, isOnline);
        setAmendment(suggestion);
        setIsAmending(false);
    };

    return (
        <div className="flex flex-col gap-2 p-3 bg-surface-alt/50 border border-border rounded-lg h-full">
            <div className="flex justify-between items-center">
                 <label className="font-semibold text-text-muted text-sm flex items-center gap-2">
                    <ScaleIcon className="w-4 h-4" />
                    System Law Composer
                </label>
                <button onClick={handleSuggestAmendment} disabled={disabled || isAmending || !isOnline} className="text-xs flex items-center gap-1 text-primary/80 hover:text-primary disabled:opacity-50">
                    <SparklesIcon className={`w-3 h-3 ${isAmending ? 'animate-spin' : ''}`} /> Suggest Amendment
                </button>
            </div>
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 min-h-[100px]">
                {laws.map(law => (
                    <div key={law.id} className="flex items-center gap-2 bg-surface-alt p-1.5 rounded">
                        <p className="flex-1 text-xs text-text-main">{law.text}</p>
                        <button 
                            onClick={() => removeLaw(law.id)} 
                            disabled={disabled}
                            className="text-text-muted hover:text-warning disabled:opacity-50 text-lg leading-none">&times;</button>
                    </div>
                ))}
            </div>
            {amendment && (
                <div className="text-xs p-2 bg-primary/10 border border-primary/20 rounded text-primary my-2">
                    <strong>Suggestion:</strong> {amendment}
                </div>
            )}
            <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                <input
                    type="text"
                    value={newLawText}
                    onChange={(e) => setNewLawText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addLaw()}
                    placeholder="Inscribe a new law..."
                    className="flex-1 w-full bg-surface-alt border border-border rounded-md px-2 py-1 text-text-main text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-surface-alt/50"
                    disabled={disabled}
                />
                <button 
                    onClick={addLaw} 
                    disabled={disabled || !newLawText.trim()}
                    className="px-3 py-1 bg-primary text-on-primary text-sm font-semibold rounded-md disabled:opacity-50"
                >Add</button>
            </div>
        </div>
    );
};

export default SystemLawComposer;