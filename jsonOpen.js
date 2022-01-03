// HANDLER - submit URL
document.getElementById("submitURL").addEventListener("click", () => {
  let url = document.getElementById("urlInput").value;
  loadJsonFromURL(url);
})

// fetch doesn't work with local files. must use Live Server
function loadJsonFromURL(url) {
  topDiv.innerHTML = ''; // this keeps the div but removes all children
  fetch(url)
  .then(response => response.json())
  .then(json => {
    export let json = json;
    // printJson(json, topDiv);

  })
}

// HANDLER - submit file
document.getElementById("submitFile").addEventListener("click", function handleFile() {
  let file = document.getElementById("fileInput").files[0];
  loadJsonFromFile(file);
})

function loadJsonFromFile(file) {
  topDiv.innerHTML = ''; // this keeps the div but removes all children
  let reader = new FileReader();
  reader.onload = ((e) => {
    export let json = JSON.parse(e.target.result)
    // printJson(json, topDiv);
  })
  reader.readAsText(file); // this triggers the 'onload'
}