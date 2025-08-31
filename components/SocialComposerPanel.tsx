import React, { useState } from 'react';
import { generateVideoScript } from '../services/geminiService';
import { Share2Icon, SparklesIcon, VideoIcon } from './icons';
import type { SocialPost, Glyph } from '../types';
import * as LORE from '../config/lore';

interface SocialComposerPanelProps {
    isUnlocked: boolean;
    posts: SocialPost[];
    onPostToFeed: (manifest: any) => void;
    currentModule: {
        code: string;
        reviewHistory: any[];
        sessionIntent: string;
        emotionalState: string;
        glyph: Glyph;
    };
    isOnline: boolean;
}

const allManifests = Object.values(LORE);

const SocialComposerPanel: React.FC<SocialComposerPanelProps> = ({ isUnlocked, posts, onPostToFeed, currentModule, isOnline }) => {
    const [isComposing, setIsComposing] = useState(false);
    const [videoScript, setVideoScript] = useState('');
    const [selectedManifest, setSelectedManifest] = useState(allManifests[0]);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleComposeVideo = async () => {
        setIsComposing(true);
        setVideoScript('');
        const script = await generateVideoScript(selectedManifest, isOnline);
        setVideoScript(script);
        setIsComposing(false);
        setIsRevealed(true);
    };

    const handleSelectManifest = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = allManifests.find(m => (m as any).module === event.target.value) || allManifests[0];
        setSelectedManifest(selected);
        setVideoScript('');
        setIsRevealed(false);
    };

    if (!isUnlocked) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                    <Share2Icon className="w-16 h-16 text-border mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-main">Social Composer</h2>
                    <p className="text-text-muted mt-2">Achieve resonance and human approval to compose and publish.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2"><VideoIcon className="w-5 h-5" /> Video Manifest Composer</h3>
                <p className="text-sm text-text-muted mb-4">Transmute a core manifest into a poetic video script for social media.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={(selectedManifest as any).module}
                        onChange={handleSelectManifest}
                        className="flex-1 w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-surface-alt/50"
                    >
                        {allManifests.map(m => <option key={(m as any).module} value={(m as any).module}>{(m as any).module}</option>)}
                    </select>
                    <button onClick={handleComposeVideo} disabled={isComposing || !isOnline} className="px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                        <SparklesIcon className={`w-5 h-5 ${isComposing ? 'animate-spin' : ''}`} />
                        {isComposing ? 'Composing...' : 'Compose Script'}
                    </button>
                </div>
                 <div className={`videoReveal ${isRevealed ? 'active' : ''} mt-4`}>
                    <pre className="w-full bg-surface-alt p-4 rounded-lg text-text-main font-mono text-sm overflow-auto max-h-[300px] border border-border">
                        <code>{videoScript}</code>
                    </pre>
                </div>
            </div>

            <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-primary mb-2">PraxisNet Feed</h3>
                <p className="text-sm text-text-muted mb-4">Declare your perfected module by posting it to the sovereign feed.</p>
                <button onClick={() => onPostToFeed({module: "Sovereign Code Module", declaration: currentModule.sessionIntent, declaredBy: "PraxisOS Author"})} className="w-full px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md">
                    Post Current Module to PraxisNet
                </button>
                <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {posts.map(post => (
                        <div key={post.id} className={`bg-surface-alt p-4 rounded-lg border border-border transition-shadow ${post.resonancePulse ? 'system-breath' : ''}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl" title={post.glyph.name}>{post.glyph.symbol}</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">{post.manifest.module}</h4>
                                        <p className="text-xs text-text-muted">{new Date(post.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-primary font-mono">{post.glyph.name}</span>
                            </div>
                            <p className="text-sm italic my-3 text-text-main/80">"{post.manifest.declaration}"</p>
                            <p className="text-xs text-text-muted/70"><strong className="text-text-muted">Lineage:</strong> {post.lineage}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialComposerPanel;