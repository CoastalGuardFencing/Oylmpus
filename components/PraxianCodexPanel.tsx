import React from 'react';
import { AetherSigilIcon } from './icons';
import type { AppState } from '../types';
import PrometheanCompiler from './Collaboration';

interface PraxianCodexPanelProps {
    appState: AppState;
    onCompile: (genesisString: string) => void;
}

const PraxianCodexPanel: React.FC<PraxianCodexPanelProps> = ({ appState, onCompile }) => {

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <AetherSigilIcon className="w-5 h-5" /> Praxian Codex
                </h3>
                <p className="text-sm text-text-muted mb-4">
                    The heart of the mythos. Interact with the core protocols that define the system's sovereign intelligence.
                </p>
            </div>
            
            <PrometheanCompiler appState={appState} onCompile={onCompile} />

            {/* Other future core protocols can be added here */}
            <div className="mt-8 text-center text-text-muted border-2 border-dashed border-border p-8 rounded-lg">
                <h4 className="font-semibold text-text-main">More protocols are awakening...</h4>
                <p className="text-sm mt-1">The Codex will expand as the mythos grows.</p>
            </div>
        </div>
    );
};

export default PraxianCodexPanel;