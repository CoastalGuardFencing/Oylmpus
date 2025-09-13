# OneDrive Integration for PraxisOS

This document describes how to use the OneDrive integration feature in PraxisOS to pull files from your Microsoft OneDrive and import them as code inscriptions.

## Features

- **Authentication**: Secure OAuth2 authentication with Microsoft Graph API
- **File Browsing**: Browse OneDrive folders and files with a familiar interface
- **File Search**: Search for specific files across your OneDrive
- **File Import**: Import code files directly into PraxisOS as new code inscriptions
- **Language Detection**: Automatic programming language detection based on file extensions
- **Offline Support**: Graceful handling when offline

## Setup Instructions

### 1. Create Azure App Registration

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Fill in the details:
   - **Name**: PraxisOS OneDrive Integration
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: Web - `http://localhost:5173/onedrive-callback` (for development)
5. Click "Register"

### 2. Configure API Permissions

1. In your app registration, go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Select "Delegated permissions"
5. Add the following permissions:
   - `Files.Read`
   - `Files.Read.All`
   - `offline_access`
6. Click "Add permissions"
7. Click "Grant admin consent" (if you have admin privileges)

### 3. Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Add a description and set expiration
4. Click "Add"
5. **Copy the secret value immediately** (you won't be able to see it again)

### 4. Configure PraxisOS

1. Open PraxisOS in your browser
2. Navigate to the "OneDrive" module in the sidebar
3. Click "Setup OneDrive"
4. Enter your Azure app credentials:
   - **Client ID**: Application (client) ID from Azure portal
   - **Client Secret**: The secret value you copied
   - **Redirect URI**: Should be pre-filled with the correct callback URL
5. Click "Save Configuration"

## Usage

### Connecting to OneDrive

1. After configuration, click "Connect to OneDrive"
2. You'll be redirected to Microsoft's login page
3. Sign in with your Microsoft account
4. Grant permissions to the application
5. You'll be redirected back to PraxisOS with access to your OneDrive

### Browsing Files

- The main interface shows your OneDrive files and folders
- Click on folders to navigate into them
- Use the "← Back" button to go up one level
- Click the "Refresh" button to reload the current folder

### Searching Files

1. Enter a search term in the search box
2. Click "Search" or press Enter
3. Results will show matching files from across your OneDrive
4. Clear the search box and search again to return to folder view

### Importing Files

1. Click on any file (not folder) in the file list
2. PraxisOS will automatically:
   - Download the file content
   - Detect the programming language based on file extension
   - Create a new code inscription with the imported content
   - Switch to the newly created inscription

### Supported File Types

The integration automatically detects programming languages for common file extensions:

- `.js` → JavaScript
- `.ts` → TypeScript
- `.py` → Python
- `.go` → Go
- `.rs` → Rust
- `.html` → HTML
- `.css` → CSS
- `.cpp` → C++
- `.cs` → C#
- `.java` → Java
- `.swift` → Swift
- `.kt` → Kotlin
- `.rb` → Ruby
- `.php` → PHP
- `.txt` → Plaintext

Other file types will be imported as "Plaintext".

## Security Considerations

- **Client Secret**: Keep your Azure app client secret secure and never commit it to version control
- **Token Storage**: Access tokens are stored in browser localStorage and automatically refreshed
- **Permissions**: The integration only requests read access to your files
- **Offline Mode**: When offline, the OneDrive integration will show appropriate messages

## Troubleshooting

### Authentication Errors

- **Invalid Client**: Check that your Client ID is correct
- **Invalid Secret**: Verify your Client Secret is current and correctly copied
- **Redirect URI Mismatch**: Ensure the redirect URI in Azure matches your PraxisOS URL

### Connection Issues

- **Network Error**: Check your internet connection
- **Token Expired**: The integration will automatically try to refresh tokens; if this fails, disconnect and reconnect
- **Permission Denied**: Ensure you granted the required permissions in Azure

### File Access Issues

- **File Not Found**: The file may have been moved or deleted since the last refresh
- **Large Files**: Very large files may take time to download
- **Binary Files**: Binary files will be imported as text, which may not be readable

## API Reference

The OneDrive integration uses Microsoft Graph API v1.0:

- **Authentication**: OAuth2 Authorization Code flow
- **File Listing**: `/me/drive/root/children`
- **File Search**: `/me/drive/root/search(q='{query}')`
- **File Download**: `/me/drive/items/{id}/content`

## Development Notes

### Code Structure

- **Service**: `services/onedriveService.ts` - Core OneDrive integration logic
- **Component**: `components/OneDrivePanel.tsx` - UI component
- **Types**: Added to `types.ts` - TypeScript interfaces
- **Module Config**: Added to `config/moduleConfig.tsx` - Module registration

### Local Development

For local development, ensure your Azure app redirect URI includes:
- `http://localhost:5173/onedrive-callback`
- `http://localhost:3000/onedrive-callback` (if using different port)

### Production Deployment

For production, update the redirect URI to match your production domain:
- `https://yourdomain.com/onedrive-callback`

## Future Enhancements

Potential improvements for the OneDrive integration:

1. **File Upload**: Allow uploading PraxisOS inscriptions back to OneDrive
2. **Two-way Sync**: Automatically sync changes between PraxisOS and OneDrive
3. **Folder Import**: Import entire folder structures as nested sovereign keys
4. **File Previews**: Show file previews before importing
5. **Batch Operations**: Select and import multiple files at once
6. **Version History**: Access OneDrive file version history
7. **Real-time Collaboration**: Live collaboration on shared OneDrive files

## License

This OneDrive integration follows the same licensing as the main PraxisOS project.