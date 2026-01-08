import './github-content.css';

let dashboardEnabled = false;
let dashboardContainer: HTMLElement | null = null;

async function checkDashboardEnabled(): Promise<boolean> {
  try {
    const result = await chrome.storage.local.get(['show_on_github']);
    return result.show_on_github !== false; // Default to true
  } catch {
    return true;
  }
}

function waitForBody(): Promise<HTMLElement> {
  return new Promise((resolve) => {
    if (document.body) {
      resolve(document.body);
    } else {
      const observer = new MutationObserver(() => {
        if (document.body) {
          observer.disconnect();
          resolve(document.body);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  });
}

async function initDashboard() {
  dashboardEnabled = await checkDashboardEnabled();
  
  if (!dashboardEnabled) {
    return;
  }

  // Wait for body to be available
  const body = await waitForBody();

  // Create iframe for dashboard (isolated world with Chrome API access)
  const iframe = document.createElement('iframe');
  iframe.id = 'github-dashboard-iframe';
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    z-index: 9999;
    background: #fff;
  `;
  iframe.src = chrome.runtime.getURL('newtab.html');

  // Replace body content
  body.innerHTML = '';
  body.appendChild(iframe);
  dashboardContainer = body;
}

function revertToOriginal() {
  // Reload the page to restore original GitHub content
  window.location.reload();
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.show_on_github) {
    const newValue = changes.show_on_github.newValue;
    if (newValue === false && dashboardContainer) {
      revertToOriginal();
    } else if (newValue === true && !dashboardContainer) {
      initDashboard();
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
