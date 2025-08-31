import React from 'react';
import { CopyPlusIcon } from './icons';

const EchoSpiresPanel: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full p-6 text-center">
            <div>
                <CopyPlusIcon className="w-16 h-16 text-border mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text-main">Echo Spires</h2>
                <p className="text-text-muted mt-2">Module scaffolded. Awaiting implementation.</p>
                <p className="text-xs text-text-muted/70 mt-4">Multi-threaded feedback loops that simulate alternate module evolutions and persona perspectives.</p>
            </div>
        </div>
    );
};

export default EchoSpiresPanel;
