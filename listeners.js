

document.getElementById('inputSelect').addEventListener('change', () => {
  let inputForms = document.getElementsByClassName('input__form');
  for (let i = 0; i < inputForms.length; i++) {
    inputForms.item(i).classList.toggle('input__show')
  }
})

document.getElementById("submitFile").addEventListener("click", () => {
  let file = document.getElementById("fileInput").files[0];
  loadJsonFromFile(file);
})

document.getElementById("submitURL").addEventListener("click", () => {
  let url = document.getElementById("urlInput").value;
  loadJsonFromURL(url);
})

document.getElementById('downloadJson').addEventListener('click', downloadJson);


document.getElementById('saveJson').addEventListener('click', () => saveJsonOuter(topDiv, json));


document.getElementById('editJson').addEventListener('click', () => {
  console.log("editing mode checkbox clicked");
})

document.getElementById('refreshJson').addEventListener('click', () => {
  topDiv.innerHTML = '';
  printJson(json, topDiv);
  console.log(json);
})