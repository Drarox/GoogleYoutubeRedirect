// Track redirected tabs and their original Google URLs
const redirectedTabs = new Map();
// Track tabs that came back from YouTube to prevent re-redirect
const backNavigationTabs = new Set();

const urlFilter = [{ urlMatches: '.*google\.[a-z.]+\/search.*' }];

// Listen for video clicks on Google search
chrome.webNavigation.onReferenceFragmentUpdated.addListener(handleVideoClick, { url: urlFilter });
// Also listen for navigation events to catch new tabs
chrome.webNavigation.onBeforeNavigate.addListener(handleVideoClick, { url: urlFilter });

// Listen for tab updates to handle back navigation
chrome.tabs.onUpdated.addListener(handleTabUpdate);

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  redirectedTabs.delete(tabId);
  backNavigationTabs.delete(tabId);
});

function handleVideoClick(details) {
  const tabId = details.tabId;
  const url = details.url;

  if (url && url.includes('#fpstate=ive')) {
    const vidParam = new URL(url).hash.split('vid:')[1];

    if (vidParam) {
      const youtubeUrl = "https://www.youtube.com/watch?v=" + vidParam;
      const googleUrl = url.split('#fpstate=ive')[0];

      // Skip if we've already processed this tab (avoid double processing)
      if (redirectedTabs.has(tabId)) {
        return;
      }

        // Store the original Google URL for this tab
        redirectedTabs.set(tabId, googleUrl);
        
        // Clear the back navigation flag since user is actively clicking a video
        backNavigationTabs.delete(tabId);

        // Redirect current tab
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError) return;
          
          chrome.tabs.update(tabId, {url: youtubeUrl});
        });
      });
    }
  }
}

function handleTabUpdate(tabId, changeInfo, tab) {
  // Only process when URL changes
  if (!changeInfo.url) return;

  const url = changeInfo.url;
  
  // Don't interfere with new tabs that have fpstate - let handleVideoClick handle them
  if (url.includes('#fpstate=ive') && !redirectedTabs.has(tabId)) {
    // This is likely a new tab opening with a video URL, let handleVideoClick process it
    return;
  }
  
  // Check if user navigated back to Google from YouTube (only for tabs we've already redirected)
  if (isGoogleSearchUrl(url) && redirectedTabs.has(tabId)) {
    const originalGoogleUrl = redirectedTabs.get(tabId);
    
    // If they're coming back to Google with any fragment or parameter
    if (url.startsWith(originalGoogleUrl)) {
      // Clean up the redirect tracking
      redirectedTabs.delete(tabId);
      
      // Always redirect to the clean Google URL if there's any fragment
      if (url !== originalGoogleUrl) {
        chrome.tabs.update(tabId, {url: originalGoogleUrl});
      }
    }
  }
  
  // Handle the case where they come back with fpstate directly (only for previously redirected tabs)
  if (url.includes('#fpstate=ive') && redirectedTabs.has(tabId)) {
    const originalGoogleUrl = redirectedTabs.get(tabId);
    
    // Clean up the redirect tracking
    redirectedTabs.delete(tabId);
    
    // Redirect to clean Google URL
    chrome.tabs.update(tabId, {url: originalGoogleUrl});
  }
  
  // Clear back navigation flag when user successfully lands on clean Google page
  if (isGoogleSearchUrl(url) && !url.includes('#fpstate') && backNavigationTabs.has(tabId)) {
    // Small delay to ensure the page is stable before clearing the flag
    setTimeout(() => {
      backNavigationTabs.delete(tabId);
    }, 1000);
  }
  
  // Clean up tracking if user navigates to a completely different site
  if (!isGoogleSearchUrl(url) && !isYouTubeUrl(url)) {
    redirectedTabs.delete(tabId);
    backNavigationTabs.delete(tabId);
  }
}

function isGoogleSearchUrl(url) {
  return /https?:\/\/[^\/]*google\.[^\/]+\/search/.test(url);
}

function isYouTubeUrl(url) {
  return /https?:\/\/(www\.)?youtube\.com/.test(url);
}