const button = document.querySelector('.group-btn');
const nametabcont = document.querySelector('.name-tab');
const nameInput = document.querySelector('.gname');
const container = document.querySelector('.container');
const tabsListElement = document.querySelector('#sessions-list');
const prevButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');
const introTxt = document.querySelector('#intro');
const manageSessionLink = document.querySelector('.manage');
const paginationCont = document.querySelector('.pagination');

const tabGroups = [];
let currentPage = 1;

function Tabs(tabsArr, grpName) {
  this.tabsArr = tabsArr;
  this.grpName = grpName;
} 

button.addEventListener('click', () => {
  nametabcont.classList.toggle('toggleDisplay');
  container.style.height = '445px';
  document.documentElement.style.height = "445px";
  nameInput.value = '';
});

const displayTabs = (tabGroups, pageNumber) => {
  // Calculate the starting and ending index for the tabs to display
  const startIndex = (pageNumber - 1) * 3;
  const endIndex = startIndex + 3;

  // Clear the existing tab list
  tabsListElement.innerHTML = '';

  // Add the tabs to the list
  for (let i = startIndex; i < endIndex && i < tabGroups.length; i++) {
    const tab = tabGroups[i];
    const tabElement = document.createElement('li');
    const sessElement = document.createElement('div');
    sessElement.dataset.groupIndex = i;
    sessElement.className = 'sess';
    const tabText = document.createElement('p');
    tabText.textContent = tab.grpName;

    sessElement.addEventListener('click', function() {
      // const groupIndex = element.getAttribute('data-group-index');
      chrome.windows.create({
        type: 'normal',
        focused: true
      }, function(window) {
        // add tabs to the window
        const urls = tabGroups[i].tabsArr;
        for (const url of urls) {
          chrome.tabs.create({
            url: url,
            windowId: window.id
          });
        }
      });
    }
  );

    sessElement.appendChild(tabText);
    tabElement.appendChild(sessElement);
    tabsListElement.appendChild(tabElement);
  }
}

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayTabs(tabGroups, currentPage);
  }
});

nextButton.addEventListener('click', () => {
  const numPages = Math.ceil(tabGroups.length / 3);
  if (currentPage < numPages) {
    currentPage++;
    displayTabs(tabGroups, currentPage);
  }
});

displayTabs(tabGroups, currentPage);

const buildGroup = (urls, val) => {
  let newGroup = new Tabs(urls, val);
  tabGroups.push(newGroup);

  if (isSessionExists(tabGroups, newGroup) && tabGroups.length > 1) {
    alert("Oops! It looks like you've already grouped these tabs. Try grouping some new tabs.")
    newGroup = null;
    tabGroups.pop();
  }
  else {
    displayTabs(tabGroups, 1);
    // Send this group to firebase.js in the form of messages...
    console.log('GROUP ADDED')
    console.log(newGroup.tabsArr, newGroup.grpName);
  }
}

const isSessionExists = (sessionArray, newSession) => {
  for (let i = 0; i < sessionArray.length; i++) {
    const session = sessionArray[i];
    if (arraysEqual(session.tabsArr, newSession.tabsArr)) {
      return true;
    }
  }
  return false;
}

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

nameInput.addEventListener('keydown', (e) => {
  if (e.code === "Enter") { 
    nametabcont.classList.toggle('toggleDisplay');  
    manageSessionLink.style.display = 'block';
    paginationCont.style.display = 'flex';
    introTxt.remove();
    container.style.height = '445px';
    document.body.style.height = '445px';
    document.documentElement.style.height = "445px";
    let val = nameInput.value;
    let urls = [];

    chrome.tabs.query({}, function(tabs) {
      for (let tab of tabs) {
        urls.push(tab.url);
      }
    });

    buildGroup(urls, val);  
  }
});
