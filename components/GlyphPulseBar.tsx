import React from 'react';
import type { EmotionalState, GlyphMap } from '../types';
import { KeyIcon } from './icons';

interface GlyphPulseBarProps {
    emotionalState: EmotionalState;
    glyphMap: GlyphMap;
    latestResonanceScore: number;
}

const GlyphPulseBar: React.FC<GlyphPulseBarProps> = ({ emotionalState, glyphMap, latestResonanceScore }) => {
    const activeGlyph = glyphMap[emotionalState] || { name: 'Undefined', symbol: '?', description: 'An undefined emotional state.'};
    const isLit = latestResonanceScore >= 8;

    return (
        <div className="p-3 bg-surface-alt border border-border rounded-lg text-center">
            <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">System Pulse</p>
            <div className="mt-3 flex items-center justify-center gap-4">
                <div className="text-4xl text-primary" title={activeGlyph.name}>{activeGlyph.symbol}</div>
                <div>
                    <p className="font-bold text-text-main">{activeGlyph.name}</p>
                    <p className="text-xs text-text-muted">{emotionalState}</p>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-text-muted text-sm">
                <KeyIcon className={`w-4 h-4 transition-colors ${isLit ? 'text-primary spiral-key-lit' : 'text-text-muted/50'}`} />
                <span>Resonance: {latestResonanceScore} / 10</span>
            </div>
        </div>
    );
};

export default GlyphPulseBar;
