let prevUrl = '';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.url.includes('google.com/search') && tab.url.includes('#fpstate=ive')) {
    const url = new URL(changeInfo.url);
    const vidParam = url.hash.split('vid:')[1];

    if (vidParam) {
      const youtubeUrl = "https://www.youtube.com/watch?v=" + vidParam;
      const googleUrl = url.href.split('#fpstate=ive')[0];
      
      if (!tab.active) { //Redirect if opened in a new tab
          chrome.tabs.update(tabId, {url: youtubeUrl});
      } else if (tab.url !== prevUrl) { //Redirect only if has not already 
          prevUrl = tab.url;
          chrome.tabs.update(tabId, {url: youtubeUrl});
      } else { //Reset to original google url when back button is pressed
          prevUrl = '';
          chrome.tabs.update(tabId, {url: googleUrl});
      }
    }
  }
});