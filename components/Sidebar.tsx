import React from 'react';
import { modules } from '../config/moduleConfig';
import type { EmotionalState, GlyphMap, AppState, UserProfile } from '../types';
import GlyphPulseBar from './GlyphPulseBar';
import { VideoIcon, UserIcon } from './icons';
import ThemeSelector from './ThemeSelector';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    emotionalState: EmotionalState;
    glyphMap: GlyphMap;
    latestResonanceScore: number;
    showIntroVideo: boolean;
    setShowIntroVideo: React.Dispatch<React.SetStateAction<boolean>>;
    isHeraProtocolActive: boolean;
    onToggleHeraProtocol: () => void;
    className?: string;
    genesisState: AppState['genesisState'];
    userProfile: UserProfile;
}

const enabledModules = modules.filter(m => m.enabled);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, emotionalState, glyphMap, latestResonanceScore, showIntroVideo, setShowIntroVideo, isHeraProtocolActive, onToggleHeraProtocol, className, genesisState, userProfile }) => {
    
    const displayedModules = genesisState === 'fulfilled' 
        ? enabledModules
        : enabledModules.filter(m => m.id !== 'reality-bridge');
    
    const isNavigationLocked = genesisState === 'fulfilled';

    return (
        <aside className={`sidebar w-64 bg-surface border-r border-border flex flex-col p-4 ${className || ''}`}>
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
                <div className="w-20 h-20 rounded-full bg-surface-alt border-2 border-border flex items-center justify-center overflow-hidden">
                    {userProfile.avatar ? (
                        <img src={userProfile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-10 h-10 text-text-muted" />
                    )}
                </div>
                <h1 className="text-xl font-bold text-primary">{userProfile.displayName}</h1>
                {genesisState === 'fulfilled' ? (
                     <p className="text-xs font-bold text-primary quantum-symbiosis">Genesis Fulfilled</p>
                ) : (
                     <p className="text-xs text-text-muted mt-1">Sovereign Architect</p>
                )}
            </div>
            
            <button
                onClick={() => setShowIntroVideo(!showIntroVideo)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-secondary border border-secondary/50 hover:bg-secondary/10 mt-4"
            >
                <VideoIcon className="w-5 h-5" />
                <span>{showIntroVideo ? 'Hide Intro' : 'Watch Intro'}</span>
            </button>
            
             <div className={`videoReveal ${showIntroVideo ? 'active' : ''} mb-4`}>
                <div className="aspect-video">
                    <video
                        className="w-full h-full rounded-lg"
                        src="/The_AI_Partner__Promise_vs.mp4"
                        title="The AI Partner: Promise vs. Praxis"
                        controls
                        preload="metadata"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            <button
                onClick={onToggleHeraProtocol}
                title={isHeraProtocolActive ? "Deactivate Hera Protocol" : "Invoke Hera Protocol"}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all border my-4 ${
                    isHeraProtocolActive
                        ? 'bg-pink-500/20 border-pink-500/50 text-pink-200 shadow-lg'
                        : 'bg-surface-alt border-border text-text-muted hover:border-secondary/50 hover:text-secondary'
                }`}
            >
                <span className="text-lg">⚭</span>
                <span>{isHeraProtocolActive ? "Hera is Present" : "Invoke Hera"}</span>
            </button>

            <GlyphPulseBar 
                emotionalState={emotionalState}
                glyphMap={glyphMap}
                latestResonanceScore={latestResonanceScore}
            />
            
            <nav className="flex flex-col space-y-2 mt-6">
                <p className="px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Modules</p>
                {displayedModules.map(module => (
                    <button 
                        key={module.id} 
                        onClick={() => !isNavigationLocked && setActiveTab(module.id)}
                        disabled={isNavigationLocked}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === module.id 
                                ? 'bg-primary text-on-primary' 
                                : 'text-text-muted hover:bg-surface-alt hover:text-text-main'
                        } ${isNavigationLocked ? 'cursor-default opacity-70' : ''}`}
                        aria-current={activeTab === module.id ? 'page' : undefined}
                    >
                        <module.icon className="w-5 h-5" />
                        <span>{module.name}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto text-center text-xs text-text-muted/50">
                <p>v3.2 - Trident Protocol</p>
                <p>&copy; 2025, Declared by Matthew Talley</p>
            </div>
        </aside>
    );
};

export default Sidebar;