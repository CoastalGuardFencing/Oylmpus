import React from 'react';
import { FingerprintIcon } from './icons';
// FIX: Replaced 'Wallet' with the correct exported type 'SovereignAccount'.
import type { SovereignAccount, EmailAccount } from '../types';

interface OlympusIdentityPanelProps {
    isUnlocked: boolean;
    onCreateIdentities: () => void;
    wallet: SovereignAccount | null;
    emailAccounts: EmailAccount[];
}

const OlympusIdentityPanel: React.FC<OlympusIdentityPanelProps> = ({ isUnlocked, onCreateIdentities, wallet, emailAccounts }) => {
    if (!isUnlocked) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                    <FingerprintIcon className="w-16 h-16 text-border mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-main">Olympus Identity</h2>
                    <p className="text-text-muted mt-2">Achieve resonance and human approval to perform the identity ritual.</p>
                </div>
            </div>
        );
    }
    
    const isEstablished = wallet && emailAccounts.length > 0;

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2"><FingerprintIcon className="w-5 h-5" /> Sovereign Identity Engine</h3>
            
            {isEstablished ? (
                <div className="space-y-4">
                     <p className="text-sm text-text-muted">The Olympus Trust is established. A Genesis Grant of 100,000,000 PX has been bestowed and inscribed in the Genesis Ledger.</p>
                     <div className="p-4 bg-surface-alt rounded-lg border border-border">
                        <h4 className="font-bold text-secondary">AetherChain Wallet</h4>
                        <p className="text-sm mt-1"><strong>Name:</strong> {wallet?.name}</p>
                        <p className="text-sm"><strong>Address:</strong> {wallet?.address}</p>
                        <p className="text-sm"><strong>Assets:</strong> {wallet?.assets.join(', ')}</p>
                    </div>
                     <div className="p-4 bg-surface-alt rounded-lg border border-border">
                        <h4 className="font-bold text-secondary">Olympus Mail Accounts</h4>
                         {emailAccounts.map(acc => (
                            <div key={acc.address} className="mt-2 text-sm">
                                <p><strong>Address:</strong> {acc.address}</p>
                                <p><strong>Role:</strong> {acc.role}</p>
                                <p><strong>Glyph:</strong> {acc.glyph}</p>
                            </div>
                         ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                    <p className="text-text-muted mb-4">Perform the one-time ritual to forge the sovereign identities for this system.</p>
                    <button
                        onClick={onCreateIdentities}
                        className="px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        Establish Sovereign Identity
                    </button>
                </div>
            )}
        </div>
    );
};

export default OlympusIdentityPanel;