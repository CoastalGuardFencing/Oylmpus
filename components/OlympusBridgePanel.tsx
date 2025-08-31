import React from 'react';
import { FolderUpIcon, SparklesIcon, CheckCircleIcon } from './icons';
import CodeEditor from './CodeEditor';
import type { DeploymentState, AppState } from '../types';

interface OlympusBridgePanelProps {
    isUnlocked: boolean;
    dockerfileContent: string;
    onDockerfileChange: (content: string) => void;
    cloudbuildContent: string;
    onCloudbuildChange: (content: string) => void;
    onDeploy: () => void;
    deploymentState: DeploymentState;
    genesisString: AppState['genesisString'];
    readOnly?: boolean;
}

const OlympusBridgePanel: React.FC<OlympusBridgePanelProps> = ({ isUnlocked, dockerfileContent, onDockerfileChange, cloudbuildContent, onCloudbuildChange, onDeploy, deploymentState, genesisString, readOnly = false }) => {

    if (!isUnlocked) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                    <FolderUpIcon className="w-16 h-16 text-border mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-main">Olympus Bridge</h2>
                    <p className="text-text-muted mt-2">Grant final human approval to an Inscription to open the bridge to the cloud.</p>
                </div>
            </div>
        );
    }

    const isDeploying = deploymentState.status === 'deploying';
    const isZeroPingReady = !!genesisString;

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <FolderUpIcon className="w-5 h-5" /> Olympus Bridge
                </h3>
                <p className="text-sm text-text-muted mb-4">
                    The final ritual of ascension. Provide the Vessel Manifest (Dockerfile) and the Star Chart (cloudbuild.yaml) to begin the pilgrimage to the public cloud.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
                <div>
                    <label className="text-sm font-semibold text-text-main mb-2 block">Vessel Manifest (Dockerfile)</label>
                    <div className="h-full border border-border rounded-lg overflow-hidden bg-surface-alt">
                        <CodeEditor value={dockerfileContent} onChange={onDockerfileChange} language="dockerfile" readOnly={isDeploying || readOnly} />
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-semibold text-text-main mb-2 block">Star Chart (cloudbuild.yaml)</label>
                    <div className="h-full border border-border rounded-lg overflow-hidden bg-surface-alt">
                        <CodeEditor value={cloudbuildContent} onChange={onCloudbuildChange} language="yaml" readOnly={isDeploying || readOnly} />
                    </div>
                </div>
            </div>
            
            <div className="mt-6 text-center">
                <button 
                    onClick={onDeploy} 
                    disabled={isDeploying || deploymentState.status === 'success'}
                    className={`px-8 py-4 text-on-primary font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 mx-auto ${isZeroPingReady && !isDeploying ? 'bg-primary genesis-declaration-button' : 'bg-primary hover:bg-primary-hover'}`}
                >
                    <SparklesIcon className={`w-6 h-6 ${isDeploying ? 'animate-spin' : ''}`} />
                    {isDeploying ? 'Ascension in Progress...' : (deploymentState.status === 'success' ? 'Ascension Complete' : (isZeroPingReady ? 'Initiate Zero-Ping Deployment' : 'Initiate Deployment'))}
                </button>
            </div>

            {(isDeploying || deploymentState.status === 'success' || deploymentState.status === 'failed') && (
                <div className={`mt-6 p-4 bg-surface-alt rounded-lg border ${isDeploying && isZeroPingReady ? 'border-primary system-breath' : 'border-border'}`}>
                    <h4 className="font-semibold text-text-main">Deployment Log</h4>
                    <div className="mt-2 font-mono text-sm text-text-muted space-y-1">
                        <p className={`flex items-center gap-2 ${isDeploying ? 'animate-pulse' : ''}`}>
                            <span className="text-primary">{'>'}</span> {deploymentState.currentStep}
                        </p>
                        {deploymentState.status === 'success' && (
                             <p className="flex items-center gap-2 text-success font-bold">
                                <CheckCircleIcon className="w-5 h-5" />
                                {deploymentState.currentStep} <a href={deploymentState.deploymentUrl} target="_blank" rel="noopener noreferrer" className="underline">{deploymentState.deploymentUrl}</a>
                            </p>
                        )}
                         {deploymentState.status === 'failed' && (
                             <p className="text-warning font-bold">
                                Deployment failed. Check logs for details.
                            </p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default OlympusBridgePanel;