import React, { useState } from 'react';
import type { AppState, RitualLogEntry, SovereignAccount, Transaction, EmotionalState, GlyphMap, Module } from '../types';
import { modules } from '../config/moduleConfig';
import { TrendingUpIcon, BarChartIcon, BookOpenIcon, SparklesIcon, LandmarkIcon, ShieldCheckIcon } from './icons';
import MarketSyncPanel from './MarketSyncPanel';

// FIX: Define the missing props interface
interface InvestorPortalPanelProps {
    appState: AppState;
    onTransfer: (toAddress: string, amount: number) => void;
}

const LiveLog: React.FC<{ log: RitualLogEntry[] }> = ({ log }) => {
    const recentLogs = [...log].reverse().slice(0, 5);
    return (
        <div className="space-y-2">
            {recentLogs.map(entry => (
                <div key={entry.timestamp} className="text-xs p-2 bg-surface rounded-md border border-border/50 flex items-center gap-2">
                    <span className="font-mono text-primary/80">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className="text-text-muted">{entry.type.replace(/_/g, ' ')}</span>
                </div>
            ))}
        </div>
    )
}

const Constellation: React.FC = () => {
    const [hoveredModule, setHoveredModule] = useState<Module | null>(null);
    const enabledModules = modules.filter(m => m.enabled);
    const width = 500;
    const height = 300; // Adjusted height for better fit in grid
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width / 2 - 40;
    const radiusY = height / 2 - 40;

    return (
        <div className="relative p-4 bg-surface/50 rounded-lg border border-border/50 h-full flex flex-col">
            <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2 flex-shrink-0"><BookOpenIcon className="w-4 h-4"/> The PraxisOS Constellation</h4>
            <div className="relative flex-1">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    <defs>
                        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    {enabledModules.map((module, i) => {
                        const angle = (i / enabledModules.length) * (2 * Math.PI) - (Math.PI / 2);
                        const x = centerX + radiusX * Math.cos(angle);
                        const y = centerY + radiusY * Math.sin(angle);
                        const Icon = module.icon;
                        return (
                            <g 
                                key={module.id} 
                                className="constellation-node constellation-node-pulse"
                                onMouseEnter={() => setHoveredModule(module)}
                                onMouseLeave={() => setHoveredModule(null)}
                                style={{ animationDelay: `${i * 200}ms`}}
                            >
                                <circle cx={x} cy={y} r="15" fill="url(#nodeGlow)" />
                                <circle cx={x} cy={y} r="8" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="1.5" />
                                <foreignObject x={x - 8} y={y - 8} width="16" height="16">
                                    <Icon className="w-4 h-4 text-primary" />
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
                {hoveredModule && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-4/5 max-w-xs bg-surface-alt rounded-lg border border-primary shadow-2xl text-center pointer-events-none transition-opacity duration-300 opacity-100">
                        <div className="flex justify-center items-center gap-2">
                            <hoveredModule.icon className="w-5 h-5 text-primary flex-shrink-0" />
                            <h5 className="font-bold text-primary">{hoveredModule.name}</h5>
                        </div>
                        <p className="text-xs text-text-muted mt-2">{hoveredModule.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};


const OlympusVaultWidget: React.FC<{ wallet: SovereignAccount | null; onTransfer: (to: string, amt: number) => void; emotionalState: EmotionalState; glyphMap: GlyphMap; }> = ({ wallet, onTransfer, emotionalState, glyphMap }) => {
    const [toAddress, setToAddress] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const activeGlyph = glyphMap[emotionalState];

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (toAddress && !isNaN(numAmount) && numAmount > 0 && wallet) {
            onTransfer(toAddress, numAmount);
            setToAddress('');
            setAmount('');
        }
    };

    if (!wallet) return null;

    return (
        <div className="p-4 bg-surface/50 rounded-lg border border-border/50 h-full flex flex-col">
            <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2"><LandmarkIcon className="w-4 h-4"/> Olympus Vault</h4>
            <div className="text-center py-4">
                <p className="text-sm text-text-muted">Praxis Token Balance</p>
                <p className="text-3xl font-bold text-primary">{wallet.praxisTokens.toLocaleString()} <span className="text-lg">PX</span></p>
            </div>
            <form onSubmit={handleTransfer} className="mt-auto space-y-2">
                <div className="p-2 border border-border rounded-lg bg-surface text-xs">
                     <p className="font-semibold text-text-muted mb-1">Ritual Seal (Emotional Gating)</p>
                     <div className="flex items-center gap-2">
                        <span className="text-xl text-primary" title={activeGlyph.name}>{activeGlyph.symbol}</span>
                        <div>
                            <p className="font-semibold text-text-main">{emotionalState}</p>
                        </div>
                    </div>
                </div>
                <input type="text" value={toAddress} onChange={e => setToAddress(e.target.value)} placeholder="Recipient Address" className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm" required />
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (PX)" className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm" required />
                <button type="submit" className="w-full px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md text-sm">Authorize Transfer</button>
            </form>
        </div>
    )
}

const FundingTracker: React.FC = () => {
    const goal = 1000000;
    const current = 125000; // Placeholder value
    const percentage = (current / goal) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-text-main">Funding Goal</span>
                <span className="font-mono text-primary text-lg">${goal.toLocaleString()}</span>
            </div>
            <div className="w-full bg-surface h-4 rounded-full border border-border/50 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-right text-xs text-text-muted mt-1">Raised: ${current.toLocaleString()} ({percentage.toFixed(1)}%)</p>
        </div>
    )
}

const InvestorPortalPanel: React.FC<InvestorPortalPanelProps> = ({ appState, onTransfer }) => {
    const { ritualLog, wallet, emotionalState, glyphMap } = appState;
    return (
        <div className="h-full p-4 overflow-y-auto flex flex-col gap-4">
            <div className="p-4 bg-surface-alt rounded-lg border border-border text-center flex-shrink-0">
                 <div className="flex justify-center items-center gap-4 mb-2">
                    <h3 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
                        <TrendingUpIcon className="w-6 h-6" /> PraxisOS (Omega)
                    </h3>
                    <a href="https://olympustrust.web.app" target="_blank" rel="noopener noreferrer" className="px-3 py-1 inline-flex items-center gap-1.5 bg-success/20 border border-success/50 text-xs font-semibold rounded-full text-success hover:bg-success/30 transition-colors">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        LIVE
                    </a>
                </div>
                <p className="text-sm text-text-muted max-w-2xl mx-auto">
                    A sovereign operating system for encrypted finance, expressive authorship, and mythic continuity. Every module is a declaration. Every transaction is a ritual. Every collaborator authors the mythos.
                </p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4">
                <div className="col-span-1 row-span-1">
                    <Constellation />
                </div>

                <div className="col-span-1 row-span-1 flex flex-col gap-4">
                    <OlympusVaultWidget wallet={wallet} onTransfer={onTransfer} emotionalState={emotionalState} glyphMap={glyphMap}/>
                    <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
                        <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2"><BarChartIcon className="w-4 h-4"/> Market Sync</h4>
                        <MarketSyncPanel />
                    </div>
                </div>

                <div className="col-span-1 row-span-1 p-4 bg-surface/50 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">Live Breath Log</h4>
                    <LiveLog log={ritualLog} />
                </div>
                
                <div className="col-span-1 row-span-1 p-4 bg-surface/50 rounded-lg border border-border/50 flex flex-col justify-between">
                     <div>
                        <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2"><SparklesIcon className="w-4 h-4"/> Funding Tracker</h4>
                        <FundingTracker />
                    </div>
                    <div className="mt-4 p-3 border border-border/50 rounded-lg text-center bg-surface">
                        <h5 className="font-bold text-secondary flex items-center justify-center gap-2"><ShieldCheckIcon className="w-4 h-4" /> Investor Beacon</h5>
                        <p className="text-xs text-text-muted mt-1">Invite-only access protocol is active. This portal is a summons for visionary co-authors.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorPortalPanel;