const itemsPerPage = 3;
const items = document.querySelectorAll('.sessions li');
const numPages = Math.ceil(items.length / itemsPerPage);
const button = document.querySelector('.group-btn');

function createPagination() {
  const pagination = document.querySelector('.pagination ul');
  for (let i = 1; i <= numPages; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = i;
    li.appendChild(a);
    pagination.appendChild(li);
  }
  pagination.querySelector('a').classList.add('active');
}
createPagination();

function showPage(pageNum) {
  const start = (pageNum - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  items.forEach((item, index) => {
    if (index >= start && index < end) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

const paginationLinks = document.querySelectorAll('.pagination a');
paginationLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const pageNum = parseInt(link.textContent);
    paginationLinks.forEach(link => link.classList.remove('active'));
    link.classList.add('active');
    showPage(pageNum);
  });
});

paginationLinks[0].click();

button.addEventListener('click', () => {
    chrome.tabs.query({}, function(tabs) {
        let urls = [];
        for (let tab of tabs) {
          urls.push(tab.url);
        }
        console.log(urls);
      });
})