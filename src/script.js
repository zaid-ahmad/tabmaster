import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDK_jbI90zzTSC1uJQADrgUAo9i3GHfprM",
  authDomain: "tabmaster-acab4.firebaseapp.com",
  projectId: "tabmaster-acab4",
  storageBucket: "tabmaster-acab4.appspot.com",
  messagingSenderId: "857728515610",
  appId: "1:857728515610:web:a39d81446ac2b75d099ba3",
  measurementId: "G-HYC69ENN62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const button = document.querySelector('.group-btn');
const nametabcont = document.querySelector('.name-tab');
const nameInput = document.querySelector('.gname');
const container = document.querySelector('.container');
const tabsListElement = document.querySelector('#sessions-list');
const prevButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');
const introTxt = document.querySelector('#intro');
// const manageSessionLink = document.querySelector('.manage');
const paginationCont = document.querySelector('.pagination');

const tabGroups = [];
const userdata = [];
let currentPage = 1;

class Tabs {
  constructor(urls, val, email) {
    this.tabsArr = urls;
    this.grpName = val;
    this.email = email;
  }
  
  toObject() {
    return { 
      tabsArr: this.tabsArr, 
      grpName: this.grpName, 
      email: this.email 
    };
  }
}

button.addEventListener('click', () => {
  nametabcont.classList.toggle('toggleDisplay');
  container.style.height = '445px';
  document.documentElement.style.height = "445px";
  nameInput.value = '';
});

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

const userdataPromise = new Promise((resolve) => {
  chrome.identity.getProfileUserInfo(function(userInfo) {
    const email = userInfo.email;
    const userId = userInfo.id;
    document.querySelector('#loggedinText').textContent = email;

    userdata.push(email);
    userdata.push(userId);

    resolve();
  });
});

userdataPromise.then(() => {
  // Rest of the code that depends on the userdata array being populated
  
  const isSessionExists = async (newSession, uemail) => {
    const collectionRef = collection(db, "TabGroups");
    const tabs = [];

    try {
      const querySnapshot = await getDocs(collectionRef);
  
      querySnapshot.forEach((doc) => {
        if (doc.data().email === uemail) {
          tabs.push(doc.data());
        }
      });
  
      if (tabs.length === 0) {
        // Display a message to the user indicating that there are no tabs to display
        console.log('nothing');
        return false;
      }
      else {
        console.log("doing something");
        for (let i = 0; i < querySnapshot.docs.length; i++) {
          const session = querySnapshot.docs[i].data();
          const existingUrls = session.tabsArr.map(tab => tab.url);
          const newUrls = newSession.tabsArr.map(tab => tab.url);
          const isDuplicate = newUrls.every(url => existingUrls.includes(url));
          
          if (isDuplicate) {
            return true;
          }
        }
      }
  
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  const getAllTabs = async (uemail) => {
    const collectionRef = collection(db, "TabGroups");
    const tabs = [];
  
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
      if (doc.data().email == uemail) {
        tabs.push(doc.data());
      }
    });

    return tabs;
  };
  
  const displayTabs = async (pageNumber) => {
    const tabs = await getAllTabs(userdata[0]);

    if (tabs.length !== 0) {
      // Calculate the starting and ending index for the tabs to display
      const startIndex = (pageNumber - 1) * 3;
      const endIndex = startIndex + 3;
    
      // Clear the existing tab list
      tabsListElement.innerHTML = '';
      introTxt.classList.toggle('toggleDisplay');

      // Add the tabs to the list
      for (let i = startIndex; i < endIndex && i < tabs.length; i++) {
        const tab = tabs[i];
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
            const urls = tabs[i].tabsArr;
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
  }

  const buildGroup = async (urls, val, email) => {
    let newGroup = new Tabs(urls, val, email);
    tabGroups.push(newGroup);
  
    if (await isSessionExists(newGroup, userdata[0])) {
      alert("Oops! It looks like you've already grouped these tabs. Try grouping some new tabs.")
      newGroup = null;
      tabGroups.pop();
    }
    else {  
      try {
        console.log(newGroup.toObject());
        await setDoc(doc(db, "TabGroups", newGroup.grpName), newGroup.toObject());

        console.log('GROUP ADDED');
      } 
      catch (e) {
        console.error("Error adding document: ", e);
      }
      displayTabs(1);
    }
  }

  nameInput.addEventListener('keydown', async (e) => {
    if (e.code === "Enter") {
      nametabcont.classList.toggle('toggleDisplay');
      // manageSessionLink.style.display = 'block';
      paginationCont.style.display = 'flex';
      introTxt.remove();
      container.style.height = '445px';
      document.body.style.height = '445px';
      document.documentElement.style.height = "445px";
      let val = nameInput.value;
  
      const urls = await new Promise((resolve) => {
        chrome.tabs.query({}, function (tabs) {
          const urls = [];
          for (let tab of tabs) {
            urls.push(tab.url);
          }
          resolve(urls);
        });
      });
  
      await buildGroup(urls, val, userdata[0]);
    }
  });

  (async function tabsDisplayer() {
    await displayTabs(1);
  })();
});