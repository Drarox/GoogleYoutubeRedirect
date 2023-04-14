let running = false;

const prevUrls = [];

const urlFilter = [{ urlMatches: '.*google\.[a-z.]+\/search.*' }];

//For opening in new tabs and returning to google with back button
browser.webNavigation.onBeforeNavigate.addListener(redirect, { url: urlFilter });

//For video clicked on google search
browser.webNavigation.onReferenceFragmentUpdated.addListener(redirect, { url: urlFilter });

function redirect(details) {
  if (running)
    return;

  const tabId = details.tabId;
  const url = details.url;

  if (url && url.includes('#fpstate=ive')) {
    running = true;
    const vidParam = new URL(url).hash.split('vid:')[1];

    if (vidParam) {
      const youtubeUrl = "https://www.youtube.com/watch?v=" + vidParam;
      const googleUrl = url.split('#fpstate=ive')[0];

      const currentUrlIndex = prevUrls.indexOf(url);

      browser.tabs.get(tabId, async (tab) => {
        if (!tab.active) { //Redirect if opened in a new tab
            await browser.tabs.update(tabId, {url: youtubeUrl});
            running = false;
        } else if (currentUrlIndex == -1) { //Redirect only if has not already 
            prevUrls.push(url);
            await browser.tabs.update(tabId, {url: youtubeUrl});
            running = false;
        } else { //Reset to original google url when back button is pressed
            prevUrls.splice(currentUrlIndex, 1);
            setTimeout(async () => {
                await browser.tabs.update(tabId, {url: googleUrl});
                running = false;
              }, 100); 
        }
      });
    }
  }
}