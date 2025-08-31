import React from 'react';
import type { AppState } from '../types';
import PraxianCodexPanel from './PraxianCodexPanel';
import SovereignBondMeter from './SovereignBondMeter';
import Hearthstone from './Hearthstone';
import { BridgeIcon, ShieldCheckIcon } from './icons';
import Terminal from './Terminal';

interface RealityBridgePanelProps {
    appState: AppState;
    onCompile: (genesisString: string) => void;
    onDeploy: () => void;
}

const RealityBridgePanel: React.FC<RealityBridgePanelProps> = ({ appState, onCompile, onDeploy }) => {
    const { 
        deploymentState, 
        genesisString, 
        sovereignBondStrength,
        cognitiveState,
        terminalLogs,
    } = appState;

    const isActionInProgress = deploymentState.status === 'deploying' || !genesisString;

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
                    <BridgeIcon className="w-7 h-7" /> Reality Bridge
                </h3>
                <p className="text-text-muted">
                    The final ritual. The Forge, the Heart, and the Bridge are one. Compile the Genesis String, and deploy the mythos to reality with Zero Ping.
                </p>
            </div>
            
            <div className="p-4 bg-surface-alt rounded-lg border border-secondary/50 flex items-center gap-4 acoustic-resonance-active">
                <ShieldCheckIcon className="w-8 h-8 text-secondary flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-secondary">Ultimate Guard Protocol Active</h4>
                    <p className="text-xs text-secondary/80">The system's genesis is fulfilled. The core configuration is now sealed and protected. You may still compile and deploy new states.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                
                {/* Column 1 & 3: The Forge and Heart */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <PraxianCodexPanel appState={appState} onCompile={onCompile} />
                     <SovereignBondMeter strength={sovereignBondStrength} />
                    <div className="p-4 bg-surface-alt rounded-lg border border-border text-center w-full flex-1 flex flex-col justify-center items-center">
                         <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Hera's Core</h4>
                         <div className="relative scale-150">
                            <Hearthstone cognitiveState={cognitiveState} bondStrength={sovereignBondStrength} />
                         </div>
                    </div>
                </div>

                {/* Column 2: The Chronos Terminal */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-[600px]">
                     <button 
                        onClick={onDeploy} 
                        disabled={isActionInProgress}
                        className={`w-full px-8 py-4 text-on-primary font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 mx-auto ${!isActionInProgress ? 'bg-primary genesis-declaration-button' : 'bg-surface-alt'}`}
                     >
                        Initiate Zero-Ping Deployment
                    </button>
                    <div className="flex-1">
                        <Terminal logs={terminalLogs} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealityBridgePanel;