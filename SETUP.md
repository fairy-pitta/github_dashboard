# Chrome Extension Setup Guide

Step-by-step instructions to get the Chrome extension running.

## 1. Install Dependencies

Navigate to the project directory in your terminal and run:

```bash
cd /Users/shuna/github-expansion
npm install
```

## 2. Build

Build the extension:

```bash
npm run build
```

After a successful build, the extension files will be generated in the `dist` directory.

## 3. Load the Extension in Chrome

1. **Open Chrome**
2. **Open the Extensions page**
   - Type `chrome://extensions/` in the address bar and press Enter
   - Or, go to Menu → More tools → Extensions
3. **Enable Developer mode**
   - Toggle "Developer mode" ON in the top-right corner of the page
4. **Load the extension**
   - Click "Load unpacked"
   - Select the `dist` directory
   - Select `/Users/shuna/github-expansion/dist`

## 4. Configure the Extension

1. **Open a new tab**
   - When you open a new tab, the GitHub Dashboard will be displayed
   - Authentication is required initially, so the settings screen will appear
2. **Set up Personal Access Token**
   - Click the extension icon → Select "Options"
   - Or, go to `chrome://extensions/` → Click "Details" on the extension → "Extension options"
   - Enter your GitHub Personal Access Token and save

### How to Get a GitHub Personal Access Token

1. Log in to GitHub
2. Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Click "Generate new token (classic)"
4. Select the required permissions:
   - `repo` (for private repositories)
   - `read:org` (for organization repositories)
   - `read:user` (for reading user information)
5. Generate and copy the token
6. Paste it into the extension's options page and save

## 5. Verify Operation

- When you open a new tab, the GitHub Dashboard will be displayed
- The following information will be shown:
  - **Pull Requests (Created by Me)**: PRs you created
  - **Pull Requests (Review Requested)**: PRs that need your review
  - **Issues (Involved)**: Issues you're involved with
  - **Recently Updated Repositories**: Recently updated repositories

## Development Mode (Hot Reload)

To develop while making code changes:

```bash
npm run dev
```

This command watches for file changes and automatically rebuilds.
Click the "Reload" button on the Chrome extensions page to see your changes.

## Troubleshooting

### If Build Errors Occur

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### If the Extension Won't Load

- Verify that the `dist` directory was generated correctly
- Check that `dist/manifest.json` exists
- Check for errors in Chrome's console (F12)

### If Data Doesn't Display

- Verify that the Personal Access Token is set correctly
- Check that the token has the required permissions (`repo`, `read:org`, `read:user`)
- Check for error messages in the browser console (F12)

## Useful Features

- **Refresh**: Click the refresh button in the header, or press the `r` key
- **Filter**: Toggle between "All" and "Open Only"
- **Settings**: Access the settings page from the ⚙️ button in the header
