chrome.runtime.sendMessage({command: "fetch"}, (response) => {
    showData(response.data);
})

chrome.runtime.sendMessage({command: "post", data: "Test Data"}, (response) => {
    showData(response.data);
})


const showData = function(data) {
    console.log('From Extension--', data);
}