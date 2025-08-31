import React, { useRef, useEffect } from 'react';
import type { TerminalLog } from '../types';

interface TerminalProps {
    logs: TerminalLog[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const formatTimestamp = (ts: number) => {
        const date = new Date(ts);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
    };

    const getTypeClass = (type: TerminalLog['type']) => {
        switch (type) {
            case 'command': return 'text-text-main font-bold';
            case 'success': return 'text-success';
            case 'error': return 'text-warning';
            case 'info':
            default: return 'text-text-muted';
        }
    };

    const getSourceClass = (source: TerminalLog['source']) => {
        // You can customize colors per source
        return 'text-primary';
    };

    return (
        <div className="h-full w-full bg-black/80 font-mono text-sm rounded-lg border border-border overflow-hidden flex flex-col">
            <div className="flex-shrink-0 bg-surface/50 px-4 py-2 border-b border-border text-xs text-text-muted">
                /dev/chronos: Reality Bridge Interface
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {logs.map((log, index) => (
                    <div key={index} className={`flex gap-3 items-start ${getTypeClass(log.type)}`}>
                        <span className="opacity-60">[{formatTimestamp(log.timestamp)}]</span>
                        <span className={`flex-shrink-0 font-semibold ${getSourceClass(log.source)}`}>[{log.source}]</span>
                        <p className="flex-1 whitespace-pre-wrap break-words">
                            {log.type === 'command' && <span className="text-primary mr-1">{'>'}</span>}
                            {log.content}
                        </p>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                     <span className="text-primary">{'>'}</span>
                     <div className="w-2 h-4 bg-primary animate-pulse"></div>
                </div>
                <div ref={terminalEndRef} />
            </div>
        </div>
    );
};

export default Terminal;