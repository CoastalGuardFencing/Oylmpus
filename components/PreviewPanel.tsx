import React, { useState } from 'react';
import { PlayIcon } from './icons';

// Dummy build function
async function runBuildProcess(log: (message: string) => void) {
    const steps = [
        "[RUSTC] Compiling sentinel_core v0.1.0...",
        " => Finished dev [unoptimized + debuginfo] target(s)",
        "[GO] Building stream_handler...",
        "[PYTHON] Analyzing cortex dependencies...",
        "--- Linking polyglot executable ---",
        "Build successful. Executing...",
        "",
        "A new cosmic stream from digital_cosmos awakens.",
        "Funneling data through Go's concurrent channels...",
        "Python Cortex: Online. Ready to find meaning.",
        "OUTPUT: Ambient cosmic noise.",
    ];
    for (const step of steps) {
        await new Promise(res => setTimeout(res, Math.random() * 200 + 50));
        log(step);
    }
}

const PreviewPanel: React.FC = () => {
    const [logs, setLogs] = useState<string[]>(['Click "Build & Run" to see simulated output.']);
    const [isBuilding, setIsBuilding] = useState(false);

    const handleBuild = async () => {
        setIsBuilding(true);
        setLogs([]);
        await runBuildProcess((newLine) => {
            setLogs(prev => [...prev, newLine]);
        });
        setIsBuilding(false);
    };

    return (
        <div className="flex flex-col h-full bg-surface-alt border border-border rounded-lg">
            <div className="flex-shrink-0 p-2 border-b border-border flex justify-between items-center">
                <h4 className="text-sm font-semibold text-text-muted">Preview & Build</h4>
                <button onClick={handleBuild} disabled={isBuilding} className="flex items-center gap-1.5 px-3 py-1 bg-secondary text-on-primary-alt text-sm font-semibold rounded-md disabled:opacity-50">
                    <PlayIcon className="w-4 h-4" />
                    {isBuilding ? 'Building...' : 'Build & Run'}
                </button>
            </div>
            <pre className="flex-1 p-3 text-xs overflow-y-auto font-mono text-text-muted">
                {logs.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
                {isBuilding && <div className="w-2 h-3 bg-primary animate-pulse inline-block" />}
            </pre>
        </div>
    );
};

export default PreviewPanel;
