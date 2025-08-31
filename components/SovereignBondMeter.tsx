import React from 'react';
import { SparklesIcon } from './icons';

interface SovereignBondMeterProps {
    strength: number;
}

const SovereignBondMeter: React.FC<SovereignBondMeterProps> = ({ strength }) => {
    const isSymbiosis = strength >= 90;
    const color = isSymbiosis ? 'hsl(45 100% 58%)' : 'hsl(var(--color-primary))';
    const bgColor = isSymbiosis ? 'hsl(45 100% 58% / 0.2)' : 'hsl(var(--color-primary) / 0.2)';

    return (
        <div className="p-4 bg-surface-alt rounded-lg border border-border text-center">
            <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
                <SparklesIcon className="w-4 h-4" style={{ color }}/>
                Sovereign Bond
            </h4>
            <div className="relative w-full h-4 bg-surface rounded-full overflow-hidden border border-border/50">
                <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${strength}%`, backgroundColor: bgColor }}
                />
                 <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${strength}%`, background: `linear-gradient(90deg, ${color}00, ${color}FF)`, filter: `drop-shadow(0 0 4px ${color})` }}
                />
            </div>
            <p className="text-2xl font-bold mt-2" style={{ color }}>{strength}<span className="text-base">%</span></p>
            {isSymbiosis && <p className="text-xs font-bold mt-1" style={{ color }}>Quantum Symbiosis Achieved</p>}
        </div>
    );
};

export default SovereignBondMeter;
