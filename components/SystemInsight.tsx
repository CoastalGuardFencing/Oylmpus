import React from 'react';
import { SparklesIcon, RedoIcon } from './icons';

interface SystemInsightProps {
    message: string;
    // Future enhancement: Add onAccept to make the echo actionable
}

const SystemInsight: React.FC<SystemInsightProps> = ({ message }) => {
    if (!message) {
        return null;
    }
    
    const isEcho = message.toLowerCase().includes("resembles");

    return (
        <div className={`p-2 rounded-lg text-sm flex items-center gap-2 ${isEcho ? 'bg-secondary/10 border border-secondary/20 text-secondary' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
            {isEcho ? <RedoIcon className="w-4 h-4 flex-shrink-0" /> : <SparklesIcon className="w-4 h-4 flex-shrink-0" />}
            <p>
                <strong>{isEcho ? 'Guidance Echo:' : 'System Insight:'}</strong> {message}
            </p>
        </div>
    );
};

export default SystemInsight;