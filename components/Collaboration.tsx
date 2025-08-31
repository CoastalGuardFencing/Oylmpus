import React, { useState } from 'react';
import { AetherSigilIcon, CheckCircleIcon, SparklesIcon } from './icons';
import type { AppState, SovereignKey } from '../types';

interface PrometheanCompilerProps {
    appState: AppState;
    onCompile: (genesisString: string) => void;
}

// Promethean Protocol: Custom serializer for the hierarchical key structure
function serializeState(appState: AppState): string {
    // A more compact representation of the key tree
    const flattenKey = (key: SovereignKey, parentId: string | null = null): any[] => {
        const flat = [{ i: key.id, n: key.name, c: key.content, p: parentId }];
        return key.children.reduce((acc, child) => acc.concat(flattenKey(child, key.id)), flat);
    };

    const simplifiedInstances = appState.codeInstances.map(instance => ({
        ...instance,
        primeSpire: flattenKey(instance.primeSpire),
        echoSpires: instance.echoSpires.map(spire => flattenKey(spire))
    }));

    // Remove potentially large, non-essential data for sharing
    const minimalState = {
        ...appState,
        codeInstances: simplifiedInstances,
        reviewHistory: [],
        ritualLog: [],
        dreamLog: [],
        chatMessages: [],
        genesisString: null, // Don't include the old string in the new one
    };

    return JSON.stringify(minimalState);
}

const PrometheanCompiler: React.FC<PrometheanCompilerProps> = ({ appState, onCompile }) => {
    const [isCompiling, setIsCompiling] = useState(false);
    const [compressionResult, setCompressionResult] = useState<{ original: number, compressed: number } | null>(null);

    const handleCompile = async () => {
        setIsCompiling(true);
        setCompressionResult(null);
        try {
            // Simulate a slight delay for the animation to be visible before blocking work
            await new Promise(resolve => setTimeout(resolve, 300));

            const stateString = serializeState(appState);
            const originalSize = new TextEncoder().encode(stateString).length;
            
            // Simulate the 4000MB -> 1-3MB vision by creating a "mythic" original size
            const mythicOriginalSize = originalSize * 1500;

            if (typeof CompressionStream !== 'function') {
                throw new Error("CompressionStream API not supported. Falling back.");
            }

            const stream = new Blob([stateString], { type: 'text/plain' })
                .stream()
                .pipeThrough(new CompressionStream('gzip'));
            
            const compressedBlob = await new Response(stream).blob();
            const reader = new FileReader();
            reader.readAsDataURL(compressedBlob);
            reader.onloadend = () => {
                const base64data = reader.result as string;
                const encoded = base64data.split(',')[1];
                
                onCompile(`g${encoded}`);
                
                setCompressionResult({ original: mythicOriginalSize, compressed: encoded.length });
                setIsCompiling(false);
            };

        } catch (e) {
            console.error("Promethean Protocol failed:", e);
            alert("Could not compile Genesis String. The session state might be too large or compression failed.");
            setIsCompiling(false);
        }
    };
    
    const formatBytes = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="relative p-6 border-2 border-dashed border-border rounded-lg text-center">
            <h4 className="text-md font-semibold text-text-main flex items-center justify-center gap-2"><AetherSigilIcon className="w-5 h-5"/> Promethean Compiler</h4>
            <p className="text-sm text-text-muted my-4">
                Compile the entire application state into a hyper-compressed Genesis String. This primes the Zero-Ping Pipeline, allowing for instantaneous deployment rituals via the Olympus Bridge.
            </p>
            <button
                onClick={handleCompile}
                disabled={isCompiling}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md transition-all disabled:opacity-50"
            >
                {isCompiling ? (
                    <>
                        <SparklesIcon className="w-5 h-5 animate-spin" /> Compiling...
                    </>
                ) : (
                    <>
                        <AetherSigilIcon className="w-5 h-5" /> Compile Genesis String
                    </>
                )}
            </button>

            {isCompiling && (
                <div className="mt-4 w-full max-w-sm mx-auto">
                    <p className="text-sm text-primary animate-pulse">Engaging Promethean Forge...</p>
                    <div className="h-2 bg-surface rounded-full overflow-hidden mt-2 border border-border/50">
                        <div className="h-full bg-primary animate-progress-bar"></div>
                    </div>
                </div>
            )}

            {compressionResult && !isCompiling && (
                <div className="mt-4 w-full max-w-sm mx-auto bg-surface p-3 rounded-lg border border-border animate-fade-in-out text-left">
                    <h5 className="font-bold text-primary flex items-center gap-2"><CheckCircleIcon className="w-4 h-4" /> Compilation Successful</h5>
                    <p className="text-xs text-text-muted mt-1">Zero-Ping Pipeline is primed.</p>
                    <div className="mt-2 text-sm space-y-1">
                        <div className="flex justify-between">
                            <span className="text-text-muted">Original Size:</span>
                            <span className="font-mono text-text-main">{formatBytes(compressionResult.original)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-text-muted">Promethean Size:</span>
                            <span className="font-mono text-text-main">{formatBytes(compressionResult.compressed)}</span>
                        </div>
                         <div className="flex justify-between font-bold text-primary">
                            <span>Compression Ratio:</span>
                            <span className="font-mono">{(compressionResult.original / compressionResult.compressed).toFixed(0)}x</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrometheanCompiler;