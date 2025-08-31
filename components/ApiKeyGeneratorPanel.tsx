import React, { useState } from 'react';
import { BrainCircuitIcon, KeyIcon } from './icons';
import type { ApiKey, EmotionalState, GlyphMap } from '../types';

interface ApiKeyGeneratorPanelProps {
    isUnlocked: boolean;
    onGenerate: (expiresIn?: number) => void;
    apiKeys: ApiKey[];
    emotionalState: EmotionalState;
    glyphMap: GlyphMap;
}

const ApiKeyGeneratorPanel: React.FC<ApiKeyGeneratorPanelProps> = ({ isUnlocked, onGenerate, apiKeys, emotionalState, glyphMap }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [expiration, setExpiration] = useState<string>('none');

    const handleGenerate = async () => {
        setIsGenerating(true);
        const expiresIn = expiration === 'none' ? undefined : parseInt(expiration, 10);
        await onGenerate(expiresIn);
        setIsGenerating(false);
    };
    
    const activeGlyph = glyphMap[emotionalState] || { name: 'Undefined', symbol: '?', description: 'An undefined emotional state.'};


    if (!isUnlocked) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                    <BrainCircuitIcon className="w-16 h-16 text-border mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-main">API Key Generator</h2>
                    <p className="text-text-muted mt-2">Achieve resonance and human approval to access this sovereign module.</p>
                </div>
            </div>
        );
    }
    
    const reversedKeys = [...apiKeys].reverse();

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center justify-center gap-2">
                    <BrainCircuitIcon className="w-5 h-5" /> API Key Generation Protocol
                </h3>
                <p className="text-sm text-text-muted mb-4">
                    Perform the ritual to generate a new sovereign API key. Each key is a declared artifact, sealed with the system's current emotional state and active glyph: <span className="font-bold text-primary">{activeGlyph.name} ({activeGlyph.symbol})</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <select
                        value={expiration}
                        onChange={(e) => setExpiration(e.target.value)}
                        disabled={isGenerating}
                        className="w-full sm:w-auto flex-shrink-0 bg-surface-alt border border-border rounded-md px-3 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-surface-alt/50"
                    >
                        <option value="none">Expiration: Never</option>
                        <option value="3600000">Expiration: 1 Hour</option>
                        <option value="86400000">Expiration: 1 Day</option>
                        <option value="604800000">Expiration: 7 Days</option>
                    </select>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                    >
                        <KeyIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                        {isGenerating ? 'Forging Key...' : 'Generate Sovereign API Key'}
                    </button>
                </div>
            </div>

            {apiKeys.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-text-muted mb-4">Issued Keys Ledger</h3>
                    <div className="space-y-3 bg-surface-alt/50 p-4 rounded-lg border border-border/50 max-h-96 overflow-y-auto">
                        {reversedKeys.map(apiKey => (
                             <div key={apiKey.key} className="p-3 bg-surface rounded-lg border border-border">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl pt-1" title={apiKey.glyph}>{glyphMap[apiKey.emotionalState]?.symbol || '?'}</span>
                                        <div>
                                            <p className="font-mono text-xs text-text-main break-all">{apiKey.key}</p>
                                            <p className="text-xs text-text-muted mt-1">
                                                Inscribed for "{apiKey.manifest}" in a state of {apiKey.emotionalState}
                                            </p>
                                            <p className="text-xs text-text-muted mt-1">
                                                <strong>Expires:</strong> {apiKey.expiresAt ? new Date(apiKey.expiresAt).toLocaleString() : 'Never'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-muted/70 flex-shrink-0 ml-4">{new Date(apiKey.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeyGeneratorPanel;