const navButtonClassName = 'zItAnd FOU1zf GMT2kb'; // Button mode classes
const navLinkClassName = 'hdtb-mitem'; // Link mode classes
const listContainer1 = document.querySelector('div[role="list"][style="display:contents"]'); // Original list mode
const listContainer2 = document.querySelector('div.beZ0tf.O1uzAe[role="list"]'); // New list mode

// Detect Google search navigation mode: 'nav', 'button', 'list', or 'list2'
let mode;
let listContainer;
if (document.getElementsByClassName(navLinkClassName).length > 0) {
    mode = 'nav';
} else if (document.getElementsByClassName(navButtonClassName).length > 0) {
    mode = 'button';
} else if (listContainer1) {
    mode = 'list';
    listContainer = listContainer1;
} else if (listContainer2) {
    mode = 'list2';
    listContainer = listContainer2;
} else {
    console.error('Unknown navigation mode.');
    mode = null;
}

// Get the search query from the Google search input
const searchQuery = encodeURIComponent(new URLSearchParams(window.location.search).get('q')).replace(/%20/g, '+');

// Check user preferences before adding button
chrome.storage.sync.get({
    showYouTubeButton: true
}, (settings) => {
    if (settings.showYouTubeButton && mode && searchQuery) {
        addYouTubeButton();
    }
});

function addYouTubeButton() {

    // Create the YouTube button/link element
    if (mode === 'list') {
    // Create the list item div
    const listItemDiv = document.createElement('div');
    listItemDiv.setAttribute('role', 'listitem');
    listItemDiv.setAttribute('data-hveid', 'CA4QAA');
    listItemDiv.setAttribute('data-ved', '2ahUKEwj_list');

    // Create the anchor element
    const youtubeLink = document.createElement('a');
    youtubeLink.href = 'https://www.youtube.com/results?search_query=' + searchQuery;
    youtubeLink.className = 'LatpMc nPDzT T3FoJb';
    youtubeLink.setAttribute('jsname', 'VIftV');
    youtubeLink.setAttribute('role', 'link');
    youtubeLink.setAttribute('data-hveid', 'CA4QAQ');
    youtubeLink.setAttribute('data-ved', '2ahUKEwj_YouTube_Link');

    // Create the div inside the anchor (styled text)
    const youtubeTextDiv = document.createElement('div');
    youtubeTextDiv.setAttribute('jsname', 'bVqjv');
    youtubeTextDiv.className = 'YmvwI';
    youtubeTextDiv.textContent = 'YouTube';

    // Append the text div to the anchor, and the anchor to the list item
    youtubeLink.appendChild(youtubeTextDiv);
    listItemDiv.appendChild(youtubeLink);

    // Insert at the last position in the list container
    listContainer.appendChild(listItemDiv);
} else if (mode === 'list2') {
    // Create the list item div for the new list style
    const listItemDiv = document.createElement('div');
    listItemDiv.setAttribute('role', 'listitem');
    listItemDiv.setAttribute('data-hveid', 'CBsQAA');
    listItemDiv.setAttribute('data-ved', '2ahUKEwjC2q3-qtOOAxXkKvsDHc7IHTUQtoAJegQIGxAA');

    // Create the anchor element
    const youtubeLink = document.createElement('a');
    youtubeLink.href = 'https://www.youtube.com/results?search_query=' + searchQuery;
    youtubeLink.className = 'C6AK7c';
    youtubeLink.setAttribute('role', 'link');
    youtubeLink.setAttribute('tabindex', '0');
    youtubeLink.setAttribute('data-hveid', 'CBsQAQ');
    youtubeLink.setAttribute('data-ved', '2ahUKEwjC2q3-qtOOAxXkKvsDHc7IHTUQ2Z0MegQIGxAB');

    // Create the inner div
    const youtubeInnerDiv = document.createElement('div');
    youtubeInnerDiv.setAttribute('jsname', 'xBNgKe');
    youtubeInnerDiv.className = 'mXwfNd';

    // Create the span with text
    const youtubeSpan = document.createElement('span');
    youtubeSpan.className = 'R1QWuf';
    youtubeSpan.textContent = 'YouTube';

    // Assemble the structure
    youtubeInnerDiv.appendChild(youtubeSpan);
    youtubeLink.appendChild(youtubeInnerDiv);
    listItemDiv.appendChild(youtubeLink);

    // Insert at the last position in the list container
    listContainer.appendChild(listItemDiv);
} else if (mode === 'button') {
    const youtubeButton = document.createElement('a');
    youtubeButton.href = 'https://www.youtube.com/results?search_query=' + searchQuery;
    youtubeButton.className = navButtonClassName;

    // create the button div
    const youtubeButtonDiv = document.createElement('div');
    youtubeButtonDiv.className = 'O3S9Rb';
    youtubeButtonDiv.textContent = 'YouTube';

    // create the YouTube icon
    const youtubeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    youtubeSVG.setAttribute('class', 'mUKzod');
    youtubeSVG.setAttribute('viewBox', '0 0 24 24');
    youtubeSVG.setAttribute('aria-hidden', 'true');
    youtubeSVG.setAttribute('focusable', 'false');

    // create the path for the YouTube icon
    const youtubeIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    youtubeIconPath.setAttribute('d', 'M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z');
    youtubeSVG.appendChild(youtubeIconPath);

    // add the icon and text to the button
    youtubeButton.appendChild(youtubeSVG);
    youtubeButton.appendChild(youtubeButtonDiv);

    // add the button to the existing ones
    const existingButtons = document.getElementsByClassName(navButtonClassName)[1];
    existingButtons.parentNode.insertBefore(youtubeButton, existingButtons);

} else if (mode === 'nav') {
    const youtubeLink = document.createElement('a');
    youtubeLink.href = 'https://www.youtube.com/results?search_query=' + searchQuery;
    youtubeLink.className = navLinkClassName;

    // create the span containing the svg for link mode
    const youtubeIcon = document.createElement('span');
    youtubeIcon.setAttribute('class', 'bmaJhd iJddsb');
    youtubeIcon.setAttribute('style', 'height:16px;width:16px');

    // create the YouTube icon
    const youtubeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    youtubeSVG.setAttribute('viewBox', '0 0 24 24');
    youtubeSVG.setAttribute('aria-hidden', 'true');
    youtubeSVG.setAttribute('focusable', 'false');

    // create the path for the YouTube icon
    const youtubeIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    youtubeIconPath.setAttribute('d', 'M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z');
    youtubeSVG.appendChild(youtubeIconPath);

    // add the icon and text to the button
    youtubeIcon.appendChild(youtubeSVG);
    youtubeLink.prepend(youtubeIcon);
    youtubeLink.append('YouTube');

    // add the button to the existing ones
    const existingLinks = document.getElementsByClassName(navLinkClassName)[1];
    existingLinks.parentNode.insertBefore(youtubeLink, existingLinks);
    }
}
