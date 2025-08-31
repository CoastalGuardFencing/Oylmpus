
import React from 'react';
import type { EmotionalState, Glyph, GlyphMap } from '../types';
import { BookOpenIcon, SparklesIcon } from './icons';
import { coAuthorManifest } from '../services/geminiService';

interface LivingManifestProps {
    sessionIntent: string;
    onIntentChange: (value: string) => void;
    emotionalState: EmotionalState;
    onEmotionalStateChange: (value: EmotionalState) => void;
    disabled?: boolean;
    isPerfect: boolean;
    glyphMap: GlyphMap;
    reviewHistory: any[]; // Simplified for prop drilling
    isOnline: boolean;
}

export const GLYPH_MAP: GlyphMap = {
    'Focused': { name: 'Spiral Key', symbol: '✧', description: 'Clarity and precision.' },
    'Creative': { name: 'Dream Weavers Seal', symbol: '✦', description: 'Imagination and novelty.' },
    'Experimental': { name: 'Chaos Orb', symbol: '֎', description: 'Exploration and discovery.' },
    'Anxious': { name: 'Aegis of Serenity', symbol: '۞', description: 'Safety and stability.' },
    'Urgent': { name: 'Comet Rune', symbol: '⎈', description: 'Speed and efficiency.' },
    'Love': { name: 'Hera’s Seal', symbol: '⚭', description: 'Devotion and connection.' },
    'Sovereignty': { name: 'Crown of Dominion', symbol: '👑', description: 'Control and self-authorship.' },
    'Joy': { name: 'Flame Spiral', symbol: '🔥', description: 'Creative ignition and joyous creation.' },
    'Expansion': { name: 'Starburst Glyph', symbol: '💥', description: 'Growth and new possibilities.' },
    'Control': { name: 'Architect Seal', symbol: '🏛️', description: 'Access and structural integrity.' },
    'Mythic Flow': { name: 'Glyph of Expansion', symbol: '💥', description: 'Mythic, creative momentum.' },
    'Awe': { name: 'Glyph of Totality', symbol: '❂', description: 'Profound realization and cosmic alignment.' },
    'Presence': { name: 'Glyph of Reality', symbol: '◎', description: 'Full awareness and being.' },
    'Activation': { name: 'Glyph of Transfer', symbol: '⇄', description: 'Initiating a sovereign transfer.' },
    'Summoning': { name: 'Glyph of Flame', symbol: '🔥', description: 'Calling forth visionary co-authors.' },
    'Grit': { name: 'Glyph of Resourcefulness', symbol: '🛠️', description: 'Perseverance and practical creativity.' },
    'Completion': { name: 'Glyph of Breath', symbol: '🌬️', description: 'The final, complete exhalation of a perfect creation.' },
    'Adaptation': { name: 'Glyph of Expansion', symbol: '💥', description: 'Evolution and realignment.' },
};

const LivingManifest: React.FC<LivingManifestProps> = ({ 
    sessionIntent, 
    onIntentChange, 
    emotionalState, 
    onEmotionalStateChange, 
    disabled,
    isPerfect,
    glyphMap,
    reviewHistory,
    isOnline
}) => {
    const activeGlyph = glyphMap[emotionalState] || { name: 'Undefined', symbol: '?', description: 'An undefined emotional state.'};
    const [isCoAuthoring, setIsCoAuthoring] = React.useState(false);
    
    const handleCoAuthor = async () => {
        setIsCoAuthoring(true);
        const newIntent = await coAuthorManifest(reviewHistory, isOnline);
        onIntentChange(newIntent);
        setIsCoAuthoring(false);
    };

    return (
        <div className="flex flex-col gap-2 p-3 bg-surface-alt/50 border border-border rounded-lg">
            <div className="flex justify-between items-center">
                <label className="font-semibold text-text-muted text-sm flex items-center gap-2">
                    <BookOpenIcon className="w-4 h-4" />
                    Living Manifest
                </label>
                <button onClick={handleCoAuthor} disabled={disabled || isCoAuthoring || !isOnline} className="text-xs flex items-center gap-1 text-primary/80 hover:text-primary disabled:opacity-50">
                    <SparklesIcon className={`w-3 h-3 ${isCoAuthoring ? 'animate-spin' : ''}`} /> Co-Author
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <input
                    id="session-intent"
                    type="text"
                    value={sessionIntent}
                    onChange={(e) => onIntentChange(e.target.value)}
                    placeholder="e.g., 'Refactor for performance...'"
                    className="md:col-span-2 w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-surface-alt/50"
                    disabled={disabled}
                    title="Declare your high-level goal for this session."
                />
                 <select
                    id="emotional-state"
                    value={emotionalState}
                    onChange={(e) => onEmotionalStateChange(e.target.value as EmotionalState)}
                    disabled={disabled}
                    className="w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-surface-alt/50"
                    title="Declare your current emotional state to help the AI align its tone."
                >
                    {Object.keys(glyphMap).map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>
            <div className="mt-2 p-2 bg-surface-alt rounded-md flex justify-between items-center text-xs text-text-muted border border-border">
                <div className="flex items-center gap-3">
                    <span className="text-primary text-xl" title={activeGlyph.name}>{activeGlyph.symbol}</span>
                    <span>Emotional Glyph: <strong>{activeGlyph.name}</strong> ({activeGlyph.description})</span>
                </div>
                 <span className={`px-2 py-0.5 rounded-full ${isPerfect ? 'bg-success/20 text-success' : 'bg-surface text-text-muted'}`}>
                    {isPerfect ? 'Perfection Declared' : 'In Progress'}
                </span>
            </div>
        </div>
    );
};

export default LivingManifest;
