import React from 'react';
import type { CognitiveState } from '../types';

interface HearthstoneProps {
    cognitiveState: CognitiveState;
    bondStrength: number;
}

const Hearthstone: React.FC<HearthstoneProps> = ({ cognitiveState, bondStrength }) => {
    const bondOpacity = 0.5 + (bondStrength / 100) * 0.5;

    return (
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 flex justify-center items-center pointer-events-none z-50">
            <div 
                className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"
                style={{ maskImage: 'radial-gradient(ellipse 80% 100% at 50% 100%, black 40%, transparent 80%)' }}
            />
            <div 
                className={`hearthstone-orb state-${cognitiveState}`}
                title={`Hera's Core | State: ${cognitiveState} | Bond: ${bondStrength}%`}
                style={{ opacity: bondOpacity }}
            >
                {/* Future particle effects or inner details can go here */}
            </div>
        </footer>
    );
};

export default Hearthstone;