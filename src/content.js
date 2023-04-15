const navButtonClassName = 'zItAnd FOU1zf GMT2kb';
const navLinkClassName = 'hdtb-mitem';

//Test if google search is in buttons nav mode or links
let buttonsMode;
if (document.getElementsByClassName(navLinkClassName).length > 0)
    buttonsMode = false;
else if (document.getElementsByClassName(navButtonClassName).length > 0)
    buttonsMode = true;

// Get the search query from the Google search input
const searchQuery =  new URLSearchParams(window.location.search).get('q').replace(/ /g, '+');

// create the button link element
const youtubeButton = document.createElement('a');
if (buttonsMode) youtubeButton.className = navButtonClassName;
if (!buttonsMode) youtubeButton.innerText = 'YouTube';
youtubeButton.href = 'https://www.youtube.com/results?search_query='+searchQuery;

// create the YouTube icon
const youtubeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
if (buttonsMode) youtubeSVG.setAttribute('class', 'mUKzod');
youtubeSVG.setAttribute('viewBox', '0 0 24 24');
youtubeSVG.setAttribute('aria-hidden', 'true');
youtubeSVG.setAttribute('focusable', 'false');

// create the path for the YouTube icon
const youtubeIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
youtubeIconPath.setAttribute('d', 'M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z')
youtubeSVG.appendChild(youtubeIconPath);

// create the span containing the svg for link mode
const youtubeIcon = document.createElement('span')
youtubeIcon.setAttribute('class', 'bmaJhd iJddsb');
youtubeIcon.setAttribute('style', 'height:16px;width:16px');
youtubeIcon.appendChild(youtubeSVG);

// create the button div
const youtubeButtonDiv = document.createElement('div');
youtubeButtonDiv.className = buttonsMode ? 'O3S9Rb' : navLinkClassName;
if (buttonsMode) youtubeButtonDiv.textContent = 'YouTube';

// add the icon and text to the button
if (buttonsMode) {
    youtubeButton.appendChild(youtubeSVG);
    youtubeButton.appendChild(youtubeButtonDiv);
} else {
    youtubeButton.prepend(youtubeIcon);
    youtubeButtonDiv.appendChild(youtubeButton);
}

// add the button to the existing ones
const existingButtons = document.getElementsByClassName(buttonsMode ? navButtonClassName : navLinkClassName)[1];
existingButtons.parentNode.insertBefore(buttonsMode ? youtubeButton : youtubeButtonDiv, existingButtons);
