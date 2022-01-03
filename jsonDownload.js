import { json } from "jsonOpen";

// DOWNLOAD
// https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
// solution for larger files: https://github.com/eligrey/FileSaver.js

const downloadJson = () => {
  console.log("downloadJson():");
  console.log(json);
}

let downloadButton = document.getElementById('downloadJson');
downloadButton.addEventListener('click', downloadJson);