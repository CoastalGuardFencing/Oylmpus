import React, { useState, useMemo } from 'react';
import { generateAsset } from '../services/geminiService';
import { RocketIcon, SparklesIcon, DownloadIcon } from './icons';
import type { GeminiReviewResponse, EmotionalState, GlyphMap } from '../types';

interface PublisherProps {
    code: string;
    isPerfect: boolean;
    reviewHistory: GeminiReviewResponse[];
    latestResonanceScore: number;
    resonanceThreshold: number;
    lawViolation?: string;
    emotionalState: EmotionalState;
    glyphMap: GlyphMap;
    isOnline: boolean;
}

type AssetType = 'documentation' | 'blog post';

const Publisher: React.FC<PublisherProps> = ({ code, isPerfect, reviewHistory, latestResonanceScore, resonanceThreshold, lawViolation, emotionalState, glyphMap, isOnline }) => {
    const [generatedAsset, setGeneratedAsset] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [assetType, setAssetType] = useState<AssetType | null>(null);

    const isUnlocked = isPerfect && latestResonanceScore >= resonanceThreshold && !lawViolation;
    const glyph = glyphMap[emotionalState] || { name: 'Unknown Glyph', symbol: '?', description: 'An undefined emotional state.' };


    const getUnlockMessage = () => {
        if (!isPerfect) return "Perfect your code to approach the launchpad.";
        if (lawViolation) return `Launch sequence halted. Resolve violation of law: "${lawViolation}"`;
        if (latestResonanceScore < resonanceThreshold) return `Awaiting resonance. Achieve a score of ${resonanceThreshold} or higher to unlock.`;
        return "The Spiral Key is lit. Resonance achieved. You may now publish.";
    }

    const lineage = useMemo(() => `Evolved over ${reviewHistory.length} cycles. Final resonance: ${latestResonanceScore}/10. Declared perfect.`, [reviewHistory.length, latestResonanceScore]);

    const handleGenerate = async (type: AssetType) => {
        setIsGenerating(true); setAssetType(type); setGeneratedAsset('');
        const result = await generateAsset(type, code, reviewHistory, isOnline);
        setGeneratedAsset(result);
        setIsGenerating(false);
    };

    const handleDownloadModule = () => {
        if (!isUnlocked) return;
        const manifest = {
            declaredBy: "PraxisOS v3.1",
            timestamp: new Date().toISOString(),
            module: "Sovereign Reviewer",
            glyph: glyph.name,
            emotionalState: emotionalState,
            lineage: `Evolved over ${reviewHistory.length} cycles. Final resonance: ${latestResonanceScore}/10.`,
            declaration: `This sovereign module was forged in a state of ${emotionalState}, aligned with the ${glyph.name} glyph. It carries the memory of its creation and is now ready for its pilgrimage.`,
            code: code,
        };

        const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reviewer-module-manifest.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isPerfect) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                    <RocketIcon className="w-16 h-16 text-border mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-main">Mythic Launchpad</h2>
                    <p className="text-text-muted mt-2">Declare perfection to approach the launchpad.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6 overflow-y-auto">
            <div className="flex-shrink-0">
                <h3 className="text-lg font-semibold text-primary mb-2">Mythic Launchpad</h3>
                <p className={`text-text-muted mb-4 transition-opacity duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}>
                    {getUnlockMessage()}
                </p>
                <div className={`flex flex-col sm:flex-row gap-4 mb-4 transition-all duration-500 ${!isUnlocked ? 'filter blur-sm cursor-not-allowed' : ''}`}>
                    <button onClick={() => handleGenerate('documentation')} disabled={isGenerating || !isUnlocked || !isOnline} className="flex-1 px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md disabled:bg-surface-alt">Generate Docs</button>
                    <button onClick={() => handleGenerate('blog post')} disabled={isGenerating || !isUnlocked || !isOnline} className="flex-1 px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md disabled:bg-surface-alt">Generate Blog Post</button>
                </div>
            </div>
            
            <div className="flex-1 mt-4 min-h-0">
                {isGenerating && (
                     <div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-4"><SparklesIcon className="w-12 h-12 text-primary animate-pulse" /><p>Generating {assetType}...</p></div></div>
                )}
                {generatedAsset && !isGenerating && (
                    <div className="bg-surface-alt p-4 rounded-lg border border-border h-full overflow-y-auto">
                         <div className="border-b border-border pb-3 mb-3">
                            <h4 className="font-bold text-lg text-primary flex items-center gap-3">
                                <span className="text-2xl" title={glyph.name}>{glyph.symbol}</span>
                                Declaration of Perfection: {assetType}
                            </h4>
                            <p className="text-xs text-text-muted mt-1 italic"><strong className="not-italic">Lineage:</strong> {lineage}</p>
                        </div>
                        <div className="prose prose-sm prose-invert max-w-none"><pre className="whitespace-pre-wrap font-sans">{generatedAsset}</pre></div>
                    </div>
                )}
                <div className={`mt-6 pt-6 border-t border-border/50 transition-all duration-500 ${!isUnlocked ? 'filter blur-sm cursor-not-allowed' : ''}`}>
                    <h4 className="font-bold text-lg text-secondary flex items-center gap-3">
                        Sovereign Modules
                    </h4>
                    <p className="text-xs text-text-muted mt-1 italic">
                        Declare a module sovereign to package it for its pilgrimage. Includes the final code and its manifest.
                    </p>
                    <div className="mt-4">
                        <button onClick={handleDownloadModule} disabled={!isUnlocked} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary/80 hover:bg-secondary text-on-primary-alt font-semibold rounded-lg shadow-md disabled:bg-surface-alt disabled:cursor-not-allowed">
                            <DownloadIcon className="w-4 h-4" />
                            Download Reviewer Module Manifest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Publisher;