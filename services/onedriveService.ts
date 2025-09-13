// OneDrive integration service for PraxisOS
// Provides functionality to authenticate with Microsoft Graph API and pull files from OneDrive

import type { OneDriveConfig, OneDriveFile, OneDriveAuthResult } from '../types';

// Microsoft Graph API endpoints
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const AUTH_ENDPOINT = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const TOKEN_ENDPOINT = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

// Required scopes for OneDrive access
const REQUIRED_SCOPES = [
    'https://graph.microsoft.com/Files.Read',
    'https://graph.microsoft.com/Files.Read.All',
    'offline_access'
];

class OneDriveService {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private clientId: string | null = null;
    private clientSecret: string | null = null;

    /**
     * Initialize the OneDrive service with client credentials
     */
    configure(config: OneDriveConfig): void {
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        
        // Load tokens from localStorage if available
        this.loadTokensFromStorage();
    }

    /**
     * Check if the service is properly configured and authenticated
     */
    isAuthenticated(): boolean {
        return !!(this.accessToken && this.clientId);
    }

    /**
     * Get the authorization URL for OAuth flow
     */
    getAuthUrl(redirectUri: string): string {
        if (!this.clientId) {
            throw new Error('OneDrive service not configured. Please set client ID.');
        }

        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: REQUIRED_SCOPES.join(' '),
            response_mode: 'query'
        });

        return `${AUTH_ENDPOINT}?${params.toString()}`;
    }

    /**
     * Exchange authorization code for access token
     */
    async authenticateWithCode(code: string, redirectUri: string): Promise<OneDriveAuthResult> {
        if (!this.clientId || !this.clientSecret) {
            throw new Error('OneDrive service not configured. Please set client credentials.');
        }

        const tokenData = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        };

        try {
            const response = await fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(tokenData)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Authentication failed: ${error}`);
            }

            const result = await response.json();
            
            this.accessToken = result.access_token;
            this.refreshToken = result.refresh_token;
            
            // Save tokens to localStorage
            this.saveTokensToStorage();

            return {
                success: true,
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                expiresIn: result.expires_in
            };

        } catch (error) {
            console.error('OneDrive authentication error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown authentication error'
            };
        }
    }

    /**
     * Refresh the access token using refresh token
     */
    async refreshAccessToken(): Promise<boolean> {
        if (!this.refreshToken || !this.clientId || !this.clientSecret) {
            return false;
        }

        const tokenData = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: this.refreshToken,
            grant_type: 'refresh_token'
        };

        try {
            const response = await fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(tokenData)
            });

            if (!response.ok) {
                return false;
            }

            const result = await response.json();
            this.accessToken = result.access_token;
            
            if (result.refresh_token) {
                this.refreshToken = result.refresh_token;
            }

            this.saveTokensToStorage();
            return true;

        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    }

    /**
     * Make authenticated request to Microsoft Graph API
     */
    private async makeAuthenticatedRequest(url: string): Promise<any> {
        if (!this.accessToken) {
            throw new Error('Not authenticated. Please authenticate first.');
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                // Token might be expired, try to refresh
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry the request with new token
                    return this.makeAuthenticatedRequest(url);
                } else {
                    throw new Error('Authentication expired. Please re-authenticate.');
                }
            }

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`API request failed: ${error}`);
            }

            return await response.json();

        } catch (error) {
            console.error('OneDrive API request error:', error);
            throw error;
        }
    }

    /**
     * Get files from OneDrive root directory
     */
    async getFiles(path: string = ''): Promise<OneDriveFile[]> {
        const endpoint = path ? 
            `${GRAPH_API_BASE}/me/drive/root:/${path}:/children` :
            `${GRAPH_API_BASE}/me/drive/root/children`;

        try {
            const result = await this.makeAuthenticatedRequest(endpoint);
            
            return result.value.map((item: any) => ({
                id: item.id,
                name: item.name,
                path: item.parentReference?.path + '/' + item.name || '/' + item.name,
                size: item.size,
                isFolder: !!item.folder,
                modifiedDateTime: item.lastModifiedDateTime,
                downloadUrl: item['@microsoft.graph.downloadUrl']
            }));

        } catch (error) {
            console.error('Error fetching OneDrive files:', error);
            throw error;
        }
    }

    /**
     * Download file content from OneDrive
     */
    async downloadFile(fileId: string): Promise<string> {
        const endpoint = `${GRAPH_API_BASE}/me/drive/items/${fileId}/content`;
        
        try {
            const result = await this.makeAuthenticatedRequest(endpoint);
            
            // If the result is a redirect URL, fetch the actual content
            if (typeof result === 'string' && result.startsWith('http')) {
                const contentResponse = await fetch(result);
                return await contentResponse.text();
            }
            
            return result;

        } catch (error) {
            console.error('Error downloading OneDrive file:', error);
            throw error;
        }
    }

    /**
     * Search for files in OneDrive
     */
    async searchFiles(query: string): Promise<OneDriveFile[]> {
        const endpoint = `${GRAPH_API_BASE}/me/drive/root/search(q='${encodeURIComponent(query)}')`;
        
        try {
            const result = await this.makeAuthenticatedRequest(endpoint);
            
            return result.value.map((item: any) => ({
                id: item.id,
                name: item.name,
                path: item.parentReference?.path + '/' + item.name || '/' + item.name,
                size: item.size,
                isFolder: !!item.folder,
                modifiedDateTime: item.lastModifiedDateTime,
                downloadUrl: item['@microsoft.graph.downloadUrl']
            }));

        } catch (error) {
            console.error('Error searching OneDrive files:', error);
            throw error;
        }
    }

    /**
     * Get file content by path
     */
    async getFileContent(path: string): Promise<string> {
        const endpoint = `${GRAPH_API_BASE}/me/drive/root:/${path}:/content`;
        
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (response.status === 401) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    return this.getFileContent(path);
                } else {
                    throw new Error('Authentication expired. Please re-authenticate.');
                }
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }

            return await response.text();

        } catch (error) {
            console.error('Error getting OneDrive file content:', error);
            throw error;
        }
    }

    /**
     * Import file content into PraxisOS as a new code instance
     */
    async importFileAsCodeInstance(file: OneDriveFile): Promise<{ name: string; content: string; language: string }> {
        try {
            const content = await this.downloadFile(file.id);
            
            // Determine language from file extension
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            const languageMap: Record<string, string> = {
                'js': 'JavaScript',
                'ts': 'TypeScript',
                'py': 'Python',
                'go': 'Go',
                'rs': 'Rust',
                'html': 'HTML',
                'css': 'CSS',
                'cpp': 'C++',
                'cs': 'C#',
                'java': 'Java',
                'swift': 'Swift',
                'kt': 'Kotlin',
                'rb': 'Ruby',
                'php': 'PHP',
                'txt': 'Plaintext'
            };

            const language = languageMap[extension] || 'Plaintext';

            return {
                name: file.name,
                content: content,
                language: language
            };

        } catch (error) {
            console.error('Error importing OneDrive file:', error);
            throw error;
        }
    }

    /**
     * Sign out and clear stored tokens
     */
    signOut(): void {
        this.accessToken = null;
        this.refreshToken = null;
        this.clearTokensFromStorage();
    }

    /**
     * Save tokens to localStorage
     */
    private saveTokensToStorage(): void {
        if (this.accessToken) {
            localStorage.setItem('onedrive_access_token', this.accessToken);
        }
        if (this.refreshToken) {
            localStorage.setItem('onedrive_refresh_token', this.refreshToken);
        }
    }

    /**
     * Load tokens from localStorage
     */
    private loadTokensFromStorage(): void {
        this.accessToken = localStorage.getItem('onedrive_access_token');
        this.refreshToken = localStorage.getItem('onedrive_refresh_token');
    }

    /**
     * Clear tokens from localStorage
     */
    private clearTokensFromStorage(): void {
        localStorage.removeItem('onedrive_access_token');
        localStorage.removeItem('onedrive_refresh_token');
    }
}

// Export singleton instance
export const onedriveService = new OneDriveService();
export default onedriveService;