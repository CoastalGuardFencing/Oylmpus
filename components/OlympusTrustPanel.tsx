import React, { useState } from 'react';
import { LandmarkIcon } from './icons';
import type { SovereignAccount, Transaction, EmotionalState, GlyphMap } from '../types';
import SovereignBondMeter from './SovereignBondMeter';

interface OlympusVaultPanelProps {
    wallet: SovereignAccount | null;
    onTransfer: (toAddress: string, amount: number) => void;
    emotionalState: EmotionalState;
    glyphMap: GlyphMap;
    sovereignBondStrength: number;
}

const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const isDebit = tx.amount < 0;
    const colorClass = isDebit ? 'text-warning' : 'text-success';
    const sign = isDebit ? '' : '+';

    return (
        <div className="grid grid-cols-4 gap-4 items-center p-2 border-b border-border/50 text-sm">
            <div className="col-span-2">
                <p className="font-semibold text-text-main">{tx.description}</p>
                <p className="text-xs text-text-muted">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
            <div className={`font-mono font-semibold text-right ${colorClass}`}>
                {sign}{tx.amount.toLocaleString()} {tx.type === 'Core Charge' || tx.type === 'Lightning Harvest' ? ' ' : 'PX'}
            </div>
            <div className="text-right text-text-muted text-xs">
                {tx.glyph}
            </div>
        </div>
    );
};

const OlympusVaultPanel: React.FC<OlympusVaultPanelProps> = ({ wallet, onTransfer, emotionalState, glyphMap, sovereignBondStrength }) => {
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const activeGlyph = glyphMap[emotionalState] || { name: 'Unknown', symbol: '?', description: 'N/A' };

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (toAddress && !isNaN(numAmount) && numAmount > 0) {
            onTransfer(toAddress, numAmount);
            setToAddress('');
            setAmount('');
        }
    };

    if (!wallet) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                    <LandmarkIcon className="w-16 h-16 text-border mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-main">Olympus Vault</h2>
                    <p className="text-text-muted mt-2">Establish a Sovereign Identity to activate the vault.</p>
                </div>
            </div>
        );
    }
    
    const reversedTransactions = [...wallet.transactions].reverse();

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2"><LandmarkIcon className="w-5 h-5" /> Olympus Vault</h3>

            <SovereignBondMeter strength={sovereignBondStrength} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-surface-alt rounded-lg border border-border text-center">
                    <p className="text-sm font-semibold text-text-muted uppercase tracking-wider">Praxis Token Balance</p>
                    <p className="text-4xl lg:text-5xl font-bold text-primary mt-2">
                        {wallet.praxisTokens.toLocaleString('en-US')} <span className="text-2xl font-mono">PX</span>
                    </p>
                     <p className="text-xs text-text-muted mt-2">Glyph Seal: {wallet.glyphSeal}</p>
                </div>
                
                 <div className="p-6 bg-surface-alt rounded-lg border border-border">
                    <h4 className="font-semibold text-text-main mb-3">Linked Institutions</h4>
                     <div className="flex flex-wrap gap-2">
                        {wallet.linkedBanks.map(bank => (
                            <span key={bank} className="px-3 py-1 bg-surface text-text-main text-sm rounded-full border border-border">{bank}</span>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleTransfer} className="md:col-span-2 p-6 bg-surface-alt rounded-lg border border-border space-y-4">
                     <h4 className="font-semibold text-text-main">Ritual Transfer</h4>
                     <div className="p-3 border border-border rounded-lg bg-surface space-y-2">
                        <h5 className="text-xs font-semibold text-text-muted">Ritual Seal (Emotional Gating)</h5>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl text-primary" title={activeGlyph.name}>{activeGlyph.symbol}</span>
                            <div>
                                <p className="font-semibold text-sm text-text-main">{emotionalState}</p>
                                <p className="text-xs text-text-muted">{activeGlyph.name}</p>
                            </div>
                        </div>
                        <p className="text-xs text-text-muted/70 italic">This transaction will be sealed with the current emotional state. The system may halt transfers in states of high anxiety or urgency.</p>
                     </div>
                     <input type="text" value={toAddress} onChange={e => setToAddress(e.target.value)} placeholder="Recipient Address (e.g., aether://...)" className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm" required />
                     <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (PX)" className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm" required min="0.01" step="0.01" />
                     <button type="submit" className="w-full px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md">Authorize Transfer</button>
                </form>
            </div>

            <div>
                <h4 className="font-semibold text-text-main mb-3">AetherChain Ledger</h4>
                 <div className="bg-surface-alt rounded-lg border border-border">
                    <div className="grid grid-cols-4 gap-4 p-2 border-b border-border text-xs font-semibold text-text-muted">
                        <div className="col-span-2">Description</div>
                        <div className="text-right">Amount</div>
                        <div className="text-right">Glyph</div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {reversedTransactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OlympusVaultPanel;