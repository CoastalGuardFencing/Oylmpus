import React from 'react';
import type { AppState } from '../types';
import { SmartphoneIcon, LockIcon } from './icons';
import RealitySynthesizerPanel from './RealitySynthesizerPanel';

interface MobileMirrorPanelProps {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const MobileMirrorPanel: React.FC<MobileMirrorPanelProps> = ({ appState, setAppState }) => {
    const { mobileAuthState } = appState;

    const handleAuth = () => {
        setAppState(s => ({ ...s, mobileAuthState: 'authenticated' }));
    };
    
    const handleSignOut = () => {
        setAppState(s => ({ ...s, mobileAuthState: 'guest' }));
    }

    return (
        <div className="h-full p-6 flex flex-col items-center justify-center bg-surface-alt">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <SmartphoneIcon className="w-5 h-5" /> Praxis Link Mobile Mirror
            </h3>

            <div className="w-full max-w-sm h-[70vh] bg-background rounded-3xl border-8 border-border shadow-2xl overflow-hidden flex flex-col">
                <div className="flex-shrink-0 h-8 bg-border flex items-center justify-center">
                    <div className="w-16 h-4 bg-background rounded-full"></div>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                    {mobileAuthState === 'guest' ? (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                            <h4 className="font-bold text-text-main text-lg">Praxis Link</h4>
                            <p className="text-text-muted text-sm mt-2 mb-6">Authenticate with your Sovereign Identity to mirror the Reality Synthesizer.</p>
                            <button 
                                onClick={handleAuth}
                                className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                            >
                                <LockIcon className="w-5 h-5" />
                                Authenticate (Simulated)
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="flex-shrink-0 p-3 bg-surface border-b border-border flex justify-between items-center">
                               <h5 className="font-bold text-sm">Reality Synthesizer</h5>
                               <button onClick={handleSignOut} className="text-xs text-secondary hover:underline">Sign Out</button>
                            </div>
                           <div className="flex-1 overflow-hidden">
                                <RealitySynthesizerPanel appState={appState} />
                           </div>
                        </div>
                    )}
                </div>
                 <div className="flex-shrink-0 h-4 bg-border"></div>
            </div>
        </div>
    );
};


export default MobileMirrorPanel;