// Handle blocked site redirects using declarativeNetRequest
// Update rules whenever blocked sites change
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.blockedSites) {
    updateBlockingRules();
  }
});

// Initialize blocking rules on startup
updateBlockingRules();

// Create blocked page HTML with domain embedded
function createBlockedPageHtml(domain) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blocked - Productivity Blocker</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
    }
    
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 60px 40px;
      text-align: center;
      max-width: 500px;
      animation: slideUp 0.4s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .icon {
      font-size: 80px;
      margin-bottom: 20px;
    }
    
    h1 {
      font-size: 28px;
      margin-bottom: 10px;
      color: #667eea;
    }
    
    .url {
      color: #999;
      font-size: 14px;
      margin-bottom: 20px;
      word-break: break-all;
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
    }
    
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #666;
      margin-bottom: 30px;
    }
    
    .buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    button {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #667eea;
      color: white;
    }
    
    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }
    
    .btn-secondary:hover {
      background: #e0e0e0;
    }
    
    .tip {
      margin-top: 25px;
      padding: 15px;
      background: #f0f7ff;
      border-left: 4px solid #667eea;
      border-radius: 4px;
      font-size: 13px;
      text-align: left;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🚫</div>
    <h1>This site is blocked</h1>
    <div class="url">${domain}</div>
    <div class="message">
      <p>You've blocked this site to stay productive.</p>
      <p style="margin-top: 10px; font-size: 14px; color: #999;">
        Focus on what matters. You can unblock it anytime from the extension settings.
      </p>
    </div>
    <div class="buttons">
      <button class="btn-secondary" onclick="goBack()">Go Back</button>
      <button class="btn-secondary" onclick="openSettings()">Extension Settings</button>
    </div>
    <div class="tip">
      💡 <strong>Tip:</strong> Use this time to work on your goals or take a break from screens. Stay focused!
    </div>
  </div>
  
  <script>
    // Go back function
    function goBack() {
      window.history.back();
    }
    
    // Open extension settings
    function openSettings() {
      chrome.runtime.openOptionsPage?.() || 
      chrome.runtime.sendMessage({ action: 'openPopup' });
    }
  </script>
</body>
</html>
  `;
}

// Update declarativeNetRequest rules based on blocked sites
function updateBlockingRules() {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    const rules = [];
    
    blockedSites.forEach((domain, index) => {
      // Create the blocked page HTML with the domain embedded
      const blockedPageHtml = createBlockedPageHtml(domain);
      
      // Create rule for exact domain match and subdomains
      rules.push({
        id: index + 1,
        priority: 1,
        condition: {
          urlFilter: `||${domain}^`,
          resourceTypes: ['main_frame']
        },
        action: {
          type: 'redirect',
          redirect: {
            url: 'data:text/html;charset=utf-8,' + encodeURIComponent(blockedPageHtml)
          }
        }
      });
    });
    
    // Update the rules - use dynamic rules for persistence across sessions
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({length: 1000}, (_, i) => i + 1),
      addRules: rules
    }).catch(error => {
      console.error('Error updating blocking rules:', error);
    });
  });
}

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    chrome.action.openPopup();
  }
});

console.log('Productivity Blocker background service worker loaded');