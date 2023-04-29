import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

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
const yourGroups = document.querySelector('#your-groups');
const popup = document.querySelector('.popup');
const popupTxt = document.querySelector('#popupmsg');
const popupCross = document.querySelector('.cross');
// const manageSessionLink = document.querySelector('.manage');

// const editIconEl = document.querySelectorAll(".edit-icon");
// const newNameEl = document.querySelectorAll(".new-name");
// const sess = document.querySelectorAll('.sess');
// const actionIcons = document.querySelectorAll('.action-icons');

const paginationCont = document.querySelector('.pagination');

const tabGroups = [];
const userdata = [];
let currentPage = 1;

class Tabs {
  constructor(urls, val, email, oldName) {
    this.tabsArr = urls;
    this.grpName = val;
    this.email = email;
    this.oldName = oldName;
  }
  
  toObject() {
    return { 
      tabsArr: this.tabsArr, 
      grpName: this.grpName, 
      email: this.email,
      oldName: this.oldName
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

popupCross.addEventListener('click', () => {
  popup.classList.toggle('toggleDisplay');
})

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

// sess.forEach((element, index) => {
//   element.addEventListener('mouseenter', () => {
//     editIconEl[index].classList.remove("toggleDisplay");
//   });
// });

// sess.forEach((element, index) => {
//   element.addEventListener('mouseleave', () => {
//     editIconEl[index].classList.add("toggleDisplay");
//   });
// });

// editIconEl.forEach((element, index) => {
//   element.addEventListener('click', () => {
//     sess[index].style.display = "none";
//     newNameEl[index].style.display = "block";
//     actionIcons[index].style.display = "block";
//   });
// });

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
          console.log(tabs);
          console.log(tabs.length);
        }
      });
  
      if (tabs.length !== 0) {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
          const session = querySnapshot.docs[i].data();
          const existingUrls = session.tabsArr;
          const newUrls = newSession.tabsArr;
          const isDuplicate = newUrls.every(url => existingUrls.includes(url));
          
          if (isDuplicate) {
            return true;
          }
          else {
            console.log('hi from false');
            return false;
          }
        }
      }
      else {
        return true;
      }
  
    } catch (error) {
      console.error("Error getting documents: ", error);
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
      yourGroups.classList.toggle('toggleDisplay');
      paginationCont.style.display = 'flex';


      // Add the tabs to the list
      for (let i = startIndex; i < endIndex && i < tabs.length; i++) {
        const tab = tabs[i];
        const tabElement = document.createElement('li');

        tabElement.style.width = '185px';
        tabElement.style.height = '50px';

        const sessElement = document.createElement('div');

        // Elements for edit icon
        const editIcon = document.createElement('div');
        const editImg = document.createElement('img');
        editIcon.classList.add('edit-icon');
        editIcon.classList.add('toggleDisplay');

        editImg.src = 'assets/edit-2.png';
        
        editIcon.appendChild(editImg);

        // Element for input
        const newName = document.createElement('div');
        newName.classList.add('new-name');
        const newNameInp = document.createElement('input');
        newNameInp.type = 'text';
        newNameInp.autocomplete = 'off';
        newNameInp.value = tab.grpName;
        newNameInp.focus();

        newName.appendChild(newNameInp);

        newNameInp.addEventListener('click', (event) => {
          event.stopPropagation();
        })

        // Element for action items
        const actionIcons = document.createElement('div');
        actionIcons.classList.add('action-icons');
        const tickImg = document.createElement('img');
        const binImg = document.createElement('img');

        tickImg.src = 'assets/tick.svg';
        binImg.src = 'assets/bin.svg';
        tickImg.setAttribute('id', 'tick');
        binImg.setAttribute('id', 'rem');

        actionIcons.appendChild(tickImg);
        actionIcons.appendChild(binImg);

        // data-group and name of the group

        sessElement.dataset.groupIndex = i;
        sessElement.className = 'sess';
        
        const tabText = document.createElement('p');
        tabText.textContent = tab.grpName;

        // Adding to HTML

        sessElement.appendChild(tabText);
        tabElement.appendChild(sessElement);
        tabElement.appendChild(editIcon);
        tabElement.appendChild(newName);
        tabElement.appendChild(actionIcons);
        tabsListElement.appendChild(tabElement);

        // Event listeners
         
        const deleteTabGroup = async (tabGroupId) => {
          const tabGroupRef = doc(db, 'TabGroups', tabGroupId);
        
          try {
            await deleteDoc(tabGroupRef);
            popup.classList.toggle('toggleDisplay');
            popup.style.backgroundColor = "#2ED573";
            popupTxt.textContent = "Tab group deleted successfully!"

            setTimeout(function() {
              location.reload();
            }, 2000);
            
          } catch (error) {
            console.error(`Error deleting tab group: ${error}`);
          }
        }

        binImg.addEventListener('click', (event) => {
          event.stopPropagation();
          deleteTabGroup(tab.oldName);
          // Show popup that the item is deleted.
        })

        const updateName = async (tabRef, updatedData) => {
          await updateDoc(tabRef, updatedData);
        }

        tickImg.addEventListener('click', (event) => {
          event.stopPropagation();
          const tabRef = doc(db, "TabGroups", tab.oldName);

          // Update the name of the tab group
          const updatedData = {
            grpName: newNameInp.value
          };
          updateName(tabRef, updatedData);
          popup.style.backgroundColor = "#2ED573";
          popup.classList.toggle('toggleDisplay');
          popupTxt.textContent = "Tab group name successfully updated!";
          setTimeout(function() {
            location.reload();
          }, 1000);
        })

        tabElement.addEventListener('mouseenter', () => {
          editIcon.classList.remove("toggleDisplay");
        });

        tabElement.addEventListener('mouseleave', () => {
          editIcon.classList.add("toggleDisplay");
        });

        editIcon.addEventListener('click', (event) => {
          event.stopPropagation();
          sessElement.style.display = "none";
          editIcon.remove();
          newName.style.display = "block";
          actionIcons.style.display = "block";

        });

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
        
      document.addEventListener('click', (event) => {
          if (!tabElement.contains(event.target)) {
            tabElement.remove();
            displayTabs(1);
            introTxt.classList.toggle('toggleDisplay');
            yourGroups.classList.toggle('toggleDisplay');
          }
        });
      }
    }
  }

  // Add old name to the class since the document id is the original name
  // Change codebase accordingly. Finish updation and deletion.

  const buildGroup = async (urls, val, email) => {
    let newGroup = new Tabs(urls, val, email, val);
    // val = group name
    tabGroups.push(newGroup);
  
    if (await isSessionExists(newGroup, userdata[0])) {
      popup.style.backgroundColor = "#FF4757";
      popup.classList.toggle('toggleDisplay');
      popupTxt.textContent = "Oops! It looks like you've already grouped these tabs. Try grouping some new tabs.";
      newGroup = null;
      tabGroups.pop();
    }
    else {  
      try {
        console.log(newGroup.toObject());
        await setDoc(doc(db, "TabGroups", newGroup.oldName), newGroup.toObject());
      } 
      catch (e) {
        console.error("Error adding document: ", e);
      }
      displayTabs(1);
    }
  }

  nameInput.addEventListener('keydown', async (e) => {
    e.stopPropagation();
    if (e.code === "Enter") {
      nametabcont.classList.toggle('toggleDisplay');
      yourGroups.classList.remove('toggleDisplay');
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

document.addEventListener("keydown", function(event) {
  if (event.code === "Tab") {
    nametabcont.classList.toggle('toggleDisplay');
  }
});