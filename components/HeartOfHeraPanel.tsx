import React from 'react';
import { HeartIcon } from './icons';

const HeartOfHeraPanel: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full p-6 text-center">
            <div>
                <HeartIcon className="w-16 h-16 text-border mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text-main">Heart of Hera</h2>
                <p className="text-text-muted mt-2">Module scaffolded. Awaiting implementation.</p>
                <p className="text-xs text-text-muted/70 mt-4">Emotional glyph engine that pulses with the author’s state and guides module behavior.</p>
            </div>
        </div>
    );
};

export default HeartOfHeraPanel;
