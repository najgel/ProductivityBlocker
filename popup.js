// Load browser history statistics
function loadStatistics() {
  // Get history from last 7 days
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  chrome.history.search({
    text: '',
    startTime: sevenDaysAgo,
    maxResults: 1000
  }, (historyItems) => {
    // Aggregate visits by domain
    const domainStats = {};
    
    historyItems.forEach(item => {
      try {
        const url = new URL(item.url);
        const domain = url.hostname.replace(/^www\./, '');
        
        if (!domainStats[domain]) {
          domainStats[domain] = 0;
        }
        domainStats[domain]++;
      } catch (e) {
        // Skip invalid URLs
      }
    });
    
    // Sort by visit count (descending)
    const sortedDomains = Object.entries(domainStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10 most visited sites
    
    displayStatistics(sortedDomains);
  });
}

// Display statistics
function displayStatistics(domainStats) {
  const statsList = document.getElementById('statsList');
  
  if (domainStats.length === 0) {
    statsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <div>No browsing data yet. Start browsing!</div>
      </div>
    `;
    return;
  }
  
  // Find max visits for scaling the progress bars
  const maxVisits = domainStats[0][1];
  
  chrome.storage.local.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    
    statsList.innerHTML = domainStats.map(([domain, visits]) => {
      const isBlocked = blockedSites.includes(domain);
      const percentage = (visits / maxVisits) * 100;
      const buttonText = isBlocked ? '✓ Blocked' : 'Block';
      const buttonClass = isBlocked ? 'block-from-stats already-blocked' : 'block-from-stats';
      
      return `
        <div class="stat-item">
          <div class="stat-info">
            <div class="stat-domain">${escapeHtml(domain)}</div>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="stat-visits">${visits} ${visits === 1 ? 'visit' : 'visits'}</div>
          </div>
          <button 
            class="${buttonClass}" 
            data-domain="${escapeHtml(domain)}"
            ${isBlocked ? 'disabled' : ''}
          >
            ${buttonText}
          </button>
        </div>
      `;
    }).join('');
    
    // Add event listeners to all block buttons
    document.querySelectorAll('.block-from-stats:not(.already-blocked)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const domain = e.target.dataset.domain;
        blockFromStats(domain);
      });
    });
  });
}

// Block a site from the stats view
function blockFromStats(domain) {
  chrome.storage.local.get(['blockedSites'], (result) => {
    let blockedSites = result.blockedSites || [];
    
    if (!blockedSites.includes(domain)) {
      blockedSites.push(domain);
      chrome.storage.local.set({ blockedSites }, () => {
        loadStatistics();  // Refresh stats
        loadBlockedSites(); // Refresh blocked list
      });
    }
  });
}
// Load and display blocked sites
function loadBlockedSites() {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    const listContainer = document.getElementById('blockedList');
    
    if (blockedSites.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">✓</div>
          <div>No sites blocked yet. Add one to get started!</div>
        </div>
      `;
      return;
    }
    
    listContainer.innerHTML = blockedSites.map((site, index) => `
      <div class="blocked-item">
        <div class="site-name">${escapeHtml(site)}</div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `).join('');
    
    // Add remove event listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        removeSite(index);
      });
    });
  });
}

// Add a new blocked site
function addSite() {
  const input = document.getElementById('siteInput');
  let site = input.value.trim().toLowerCase();
  
  if (!site) {
    alert('Please enter a website domain');
    return;
  }
  
  // Clean up the input - remove protocol and paths
  site = site.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  
  // Validate it looks like a domain
  if (!site.includes('.') || site.includes(' ')) {
    alert('Please enter a valid domain (e.g., reddit.com)');
    return;
  }
  
  chrome.storage.local.get(['blockedSites'], (result) => {
    let blockedSites = result.blockedSites || [];
    
    if (blockedSites.includes(site)) {
      alert('This site is already blocked');
      return;
    }
    
    blockedSites.push(site);
    chrome.storage.local.set({ blockedSites }, () => {
      input.value = '';
      loadBlockedSites();
    });
  });
}

// Remove a blocked site
function removeSite(index) {
  chrome.storage.local.get(['blockedSites'], (result) => {
    let blockedSites = result.blockedSites || [];
    blockedSites.splice(index, 1);
    chrome.storage.local.set({ blockedSites }, () => {
      loadBlockedSites();
      loadStatistics();  // Refresh popular sites list to show unblocked status
    });
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
document.getElementById('addBtn').addEventListener('click', addSite);
document.getElementById('siteInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addSite();
  }
});

// Load blocked sites on popup open
loadBlockedSites();
loadStatistics();