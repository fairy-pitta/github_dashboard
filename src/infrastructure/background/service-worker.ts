// Service Worker for Chrome Extension
// This will handle background tasks, message passing, etc.

chrome.runtime.onInstalled.addListener(() => {
  console.log('GitHub Extension installed');
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  // Message handling will be implemented in later phases
  return true;
});

