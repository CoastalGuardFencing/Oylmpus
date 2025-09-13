import React, { useState, useEffect, useCallback } from 'react';
import { CloudIcon, FolderIcon, DocumentIcon, DownloadIcon } from './icons';
import onedriveService from '../services/onedriveService';
import type { OneDriveFile, OneDriveConfig, CodeInstance, SovereignKey } from '../types';

interface OneDrivePanelProps {
    onedriveConfig: OneDriveConfig | null;
    onedriveFiles: OneDriveFile[];
    codeInstances: CodeInstance[];
    onUpdateConfig: (config: OneDriveConfig | null) => void;
    onUpdateFiles: (files: OneDriveFile[]) => void;
    onCreateCodeInstance: (instance: Partial<CodeInstance>) => void;
    onNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const OneDrivePanel: React.FC<OneDrivePanelProps> = ({
    onedriveConfig,
    onedriveFiles,
    onUpdateConfig,
    onUpdateFiles,
    onCreateCodeInstance,
    onNotification
}) => {
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [configForm, setConfigForm] = useState({
        clientId: '',
        clientSecret: '',
        redirectUri: window.location.origin + '/onedrive-callback'
    });

    // Initialize OneDrive service when config changes
    useEffect(() => {
        if (onedriveConfig) {
            onedriveService.configure(onedriveConfig);
        }
    }, [onedriveConfig]);

    // Handle OAuth callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (code && onedriveConfig) {
            handleAuthCallback(code);
        } else if (error) {
            onNotification(`OneDrive authentication error: ${error}`, 'error');
        }
    }, [onedriveConfig]);

    const handleAuthCallback = async (code: string) => {
        if (!onedriveConfig) return;

        setIsLoading(true);
        try {
            const result = await onedriveService.authenticateWithCode(code, onedriveConfig.redirectUri);
            
            if (result.success) {
                onNotification('Successfully connected to OneDrive!', 'success');
                await loadFiles();
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                onNotification(`Authentication failed: ${result.error}`, 'error');
            }
        } catch (error) {
            onNotification(`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfigSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!configForm.clientId || !configForm.clientSecret) {
            onNotification('Please fill in all required fields', 'error');
            return;
        }

        const newConfig: OneDriveConfig = {
            clientId: configForm.clientId,
            clientSecret: configForm.clientSecret,
            redirectUri: configForm.redirectUri
        };

        onUpdateConfig(newConfig);
        onedriveService.configure(newConfig);
        setIsConfiguring(false);
        onNotification('OneDrive configuration saved', 'success');
    };

    const handleConnect = () => {
        if (!onedriveConfig) {
            onNotification('Please configure OneDrive first', 'error');
            return;
        }

        try {
            const authUrl = onedriveService.getAuthUrl(onedriveConfig.redirectUri);
            window.location.href = authUrl;
        } catch (error) {
            onNotification(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    };

    const loadFiles = async (path: string = '') => {
        if (!onedriveService.isAuthenticated()) {
            onNotification('Please connect to OneDrive first', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const files = await onedriveService.getFiles(path);
            onUpdateFiles(files);
            setCurrentPath(path);
        } catch (error) {
            onNotification(`Error loading files: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            await loadFiles(currentPath);
            return;
        }

        if (!onedriveService.isAuthenticated()) {
            onNotification('Please connect to OneDrive first', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const files = await onedriveService.searchFiles(searchQuery);
            onUpdateFiles(files);
        } catch (error) {
            onNotification(`Search error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileClick = async (file: OneDriveFile) => {
        if (file.isFolder) {
            // Navigate to folder
            await loadFiles(file.path.replace(/^\//, ''));
        } else {
            // Import file as code instance
            await importFile(file);
        }
    };

    const importFile = async (file: OneDriveFile) => {
        setIsLoading(true);
        try {
            const importedFile = await onedriveService.importFileAsCodeInstance(file);
            
            // Create a new SovereignKey structure for the imported file
            const rootKeyId = `key-${Date.now()}`;
            const primeSpire: SovereignKey = {
                id: rootKeyId,
                name: `${importedFile.name} (OneDrive Import)`,
                content: `// Imported from OneDrive: ${file.path}\n// File size: ${file.size} bytes\n// Last modified: ${file.modifiedDateTime}\n\n${importedFile.content}`,
                children: []
            };

            // Create new code instance
            const newInstance: Partial<CodeInstance> = {
                id: Date.now(),
                name: `OneDrive: ${importedFile.name}`,
                primeSpire,
                echoSpires: [],
                activeSpireId: rootKeyId,
                activeKeyId: rootKeyId,
                selectedLanguages: [importedFile.language],
                reviewHistory: [],
                isPerfect: false,
                humanApproved: false,
                status: 'active'
            };

            onCreateCodeInstance(newInstance);
            onNotification(`Successfully imported ${file.name} from OneDrive`, 'success');
        } catch (error) {
            onNotification(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = () => {
        onedriveService.signOut();
        onUpdateFiles([]);
        onNotification('Disconnected from OneDrive', 'info');
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    if (isConfiguring) {
        return (
            <div className="h-full bg-surface-dark p-6">
                <div className="max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-6 text-text-main">Configure OneDrive</h2>
                    <form onSubmit={handleConfigSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Client ID *
                            </label>
                            <input
                                type="text"
                                required
                                value={configForm.clientId}
                                onChange={(e) => setConfigForm({ ...configForm, clientId: e.target.value })}
                                className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-accent"
                                placeholder="Your Azure App Client ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Client Secret *
                            </label>
                            <input
                                type="password"
                                required
                                value={configForm.clientSecret}
                                onChange={(e) => setConfigForm({ ...configForm, clientSecret: e.target.value })}
                                className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-accent"
                                placeholder="Your Azure App Client Secret"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Redirect URI
                            </label>
                            <input
                                type="url"
                                value={configForm.redirectUri}
                                onChange={(e) => setConfigForm({ ...configForm, redirectUri: e.target.value })}
                                className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-accent"
                                placeholder="Callback URL"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="flex-1 bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover transition-colors"
                            >
                                Save Configuration
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsConfiguring(false)}
                                className="flex-1 bg-surface border border-border text-text-main px-4 py-2 rounded hover:bg-surface-hover transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 p-4 bg-surface border border-border rounded">
                        <p className="text-sm text-text-secondary">
                            <strong>Setup Instructions:</strong><br />
                            1. Register an app in Azure Portal<br />
                            2. Add platform: Web with redirect URI above<br />
                            3. Grant Microsoft Graph permissions: Files.Read, Files.Read.All<br />
                            4. Copy the Client ID and generate a Client Secret
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-surface-dark p-6 flex flex-col">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-text-main flex items-center">
                        <CloudIcon className="mr-2 h-5 w-5" />
                        OneDrive Integration
                    </h2>
                    <div className="flex space-x-2">
                        {!onedriveConfig ? (
                            <button
                                onClick={() => setIsConfiguring(true)}
                                className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover transition-colors"
                            >
                                Configure
                            </button>
                        ) : onedriveService.isAuthenticated() ? (
                            <>
                                <button
                                    onClick={() => loadFiles('')}
                                    disabled={isLoading}
                                    className="bg-surface border border-border text-text-main px-4 py-2 rounded hover:bg-surface-hover transition-colors disabled:opacity-50"
                                >
                                    Refresh
                                </button>
                                <button
                                    onClick={handleDisconnect}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                >
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleConnect}
                                disabled={isLoading}
                                className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                            >
                                Connect to OneDrive
                            </button>
                        )}
                    </div>
                </div>

                {onedriveService.isAuthenticated() && (
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search files..."
                            className="flex-1 p-2 bg-surface border border-border rounded focus:outline-none focus:border-accent"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            Search
                        </button>
                    </div>
                )}
            </div>

            {onedriveService.isAuthenticated() ? (
                <div className="flex-1 overflow-hidden">
                    {currentPath && (
                        <div className="mb-4 text-sm text-text-secondary">
                            Current path: /{currentPath}
                            <button
                                onClick={() => {
                                    const parentPath = currentPath.split('/').slice(0, -1).join('/');
                                    loadFiles(parentPath);
                                }}
                                className="ml-2 text-accent hover:text-accent-hover"
                            >
                                ← Back
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="text-text-secondary">Loading OneDrive files...</div>
                        </div>
                    ) : onedriveFiles.length > 0 ? (
                        <div className="overflow-y-auto">
                            <div className="space-y-2">
                                {onedriveFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => handleFileClick(file)}
                                        className="flex items-center p-3 bg-surface border border-border rounded hover:bg-surface-hover cursor-pointer transition-colors"
                                    >
                                        <div className="mr-3">
                                            {file.isFolder ? (
                                                <FolderIcon className="h-5 w-5 text-blue-400" />
                                            ) : (
                                                <DocumentIcon className="h-5 w-5 text-green-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-text-main truncate">
                                                {file.name}
                                            </div>
                                            <div className="text-sm text-text-secondary">
                                                {file.isFolder ? 'Folder' : formatFileSize(file.size)} • {formatDate(file.modifiedDateTime)}
                                            </div>
                                        </div>
                                        {!file.isFolder && (
                                            <div className="text-text-secondary">
                                                <DownloadIcon className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-32 text-text-secondary">
                            {searchQuery ? 'No files found for your search.' : 'No files found in this folder.'}
                        </div>
                    )}
                </div>
            ) : onedriveConfig ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <CloudIcon className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                        <p className="text-text-secondary mb-4">Connect to OneDrive to pull files into PraxisOS</p>
                        <button
                            onClick={handleConnect}
                            disabled={isLoading}
                            className="bg-accent text-white px-6 py-3 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            Connect to OneDrive
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <CloudIcon className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                        <p className="text-text-secondary mb-4">Configure OneDrive integration to get started</p>
                        <button
                            onClick={() => setIsConfiguring(true)}
                            className="bg-accent text-white px-6 py-3 rounded hover:bg-accent-hover transition-colors"
                        >
                            Setup OneDrive
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OneDrivePanel;