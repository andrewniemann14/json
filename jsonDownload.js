import { json } from "jsonOpen";

// DOWNLOAD
// https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
// solution for larger files: https://github.com/eligrey/FileSaver.js

const downloadJson = () => {
  console.log("downloadJson():");
  console.log(json);
}

let downloadButton = document.getElementById('downloadJson');
downloadButton.addEventListener('click', download(json));

const download = (json)
const a = document.createElement("a");
a.href = URL.createObjectURL(new Blob([JSON.stringify(json, null, 2)], {
  type: "text/plain"
}));
a.setAttribute("download", "data.txt");
document.body.appendChild(a);
a.click();
document.body.removeChild(a);