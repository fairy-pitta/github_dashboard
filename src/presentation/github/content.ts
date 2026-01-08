import './content.css';

let isEnabled = false;
let originalBody: HTMLElement | null = null;

async function shouldShowDashboard(): Promise<boolean> {
  try {
    const result = await chrome.storage.local.get(['show_on_github']);
    return result.show_on_github !== false;
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
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }
  });
}

function isGitHubHomePage(): boolean {
  const url = window.location.href;
  return url === 'https://github.com' || url === 'https://github.com/';
}

function createBackButton(): void {
  // Remove existing button if any
  const existingButton = document.getElementById('github-dashboard-enable-button');
  if (existingButton) {
    existingButton.remove();
  }

  const button = document.createElement('button');
  button.id = 'github-dashboard-enable-button';
  button.className = 'pulse';
  button.setAttribute('aria-label', 'Enable GitHub Dashboard');
  button.title = 'Enable GitHub Dashboard';

  // Create icon element
  const icon = document.createElement('i');
  icon.className = 'fas fa-chart-line';
  icon.style.cssText = 'font-size: 24px; color: white; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);';

  // Check if Font Awesome is available
  const hasFontAwesome =
    document.querySelector('link[href*="font-awesome"]') ||
    document.querySelector('link[href*="fontawesome"]');

  if (!hasFontAwesome) {
    // Use a more obvious back arrow emoji instead of stats emoji
    icon.style.display = 'none';
    button.innerHTML = '← 戻る';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
    button.style.padding = '12px 20px';
    button.style.width = 'auto';
    button.style.height = 'auto';
    button.style.minWidth = '120px';
    button.style.borderRadius = '28px';
  } else {
    button.appendChild(icon);
  }

  button.addEventListener('click', async () => {
    try {
      await chrome.storage.local.set({ show_on_github: true });
    } catch (error) {
      console.error('Failed to enable dashboard:', error);
    }
  });

  document.body.appendChild(button);
}

async function injectDashboard(): Promise<void> {
  if (!isGitHubHomePage()) {
    return;
  }

  isEnabled = await shouldShowDashboard();

  if (!isEnabled) {
    await waitForBody();
    createBackButton();
    return;
  }

  // Remove enable button if it exists
  const enableButton = document.getElementById('github-dashboard-enable-button');
  if (enableButton) {
    enableButton.remove();
  }

  const body = await waitForBody();
  if (!originalBody) {
    originalBody = body.cloneNode(true) as HTMLElement;
  }

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
  body.innerHTML = '';
  body.appendChild(iframe);
}

function restoreOriginalPage(): void {
  const iframe = document.getElementById('github-dashboard-iframe');
  if (iframe) {
    iframe.remove();
  }

  const body = document.body;
  if (body && originalBody) {
    body.innerHTML = originalBody.innerHTML;
    originalBody = null;
    createBackButton();
  } else {
    window.location.reload();
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.show_on_github) {
    const newValue = changes.show_on_github.newValue;
    if (newValue === false && originalBody) {
      restoreOriginalPage();
    } else if (newValue === true && !originalBody) {
      injectDashboard();
    }
  }
});

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectDashboard);
} else {
  injectDashboard();
}

