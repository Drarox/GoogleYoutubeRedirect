const prevUrls = [];

const urlFilter = [{ urlMatches: '.*google\.[a-z.]+\/search.*' }];

//For opening in new tabs and returning to google with back button
chrome.webNavigation.onBeforeNavigate.addListener(redirect, { url: urlFilter });

//For video clicked on google search
chrome.webNavigation.onReferenceFragmentUpdated.addListener(redirect, { url: urlFilter });

function redirect(details) {
  const tabId = details.tabId;
  const url = details.url;

  if (url && url.includes('#fpstate=ive')) {
    const vidParam = new URL(url).hash.split('vid:')[1];

    if (vidParam) {
      const youtubeUrl = "https://www.youtube.com/watch?v=" + vidParam;
      const googleUrl = url.split('#fpstate=ive')[0];

      const currentUrlIndex = prevUrls.indexOf(url);

      chrome.tabs.get(tabId, (tab) => {
        if (!tab.active) { //Redirect if opened in a new tab
          chrome.tabs.update(tabId, {url: youtubeUrl});
        } else if (currentUrlIndex == -1) { //Redirect only if has not already 
            prevUrls.push(url);
            chrome.tabs.update(tabId, {url: youtubeUrl});
        } else { //Reset to original google url when back button is pressed
            prevUrls.splice(currentUrlIndex, 1);
            chrome.tabs.update(tabId, {url: googleUrl});
        }
      });
    }
  }
}