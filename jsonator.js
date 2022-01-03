let topDiv = document.getElementById("foundation");

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
    printJson(json, topDiv);
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
    let json = JSON.parse(e.target.result)
    printJson(json, topDiv);
  })
  reader.readAsText(file); // this triggers the 'onload'
}

// main function for displaying JSON
const printJson = (o, div) => {
  let keys = Object.keys(o);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = o[key];
    let isArray = isNumber(key)

    // if (isArray) {
      // don't print the index header for each object
      // printJson(value, div);
      // continue;
    // }
    
    let newDiv;
    // could use custom elements here, though I don't see a benefit
    if (typeof value == 'object') { newDiv = buildDivObject(div, key, isArray); }
    else { newDiv = buildDivPrimitive(div, key, value, isArray); }
    
    // recurses if value is an object
    typeof value == 'object' && printJson(value, newDiv); 
  } // end for loop
}


// if key is number, than it is part of an array
const isNumber = (key) => {
  let derp = Number.parseInt(key) // NaN is a number, but unique in its inequality to itself
  return Number.parseInt(key) == derp; // if true, then it's not NaN, so it IS a number
}

// includes expand/collapse, does not include property values
const buildDivObject = (parentDiv, key, isArray) => {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'key-object', 'expanded')
  isArray && newDiv.classList.add('key-array');

  // EXPAND/COLLAPSE - create basic HTML elements
  let button = document.createElement("button")
  button.classList.add('button-expander');
  let i = document.createElement("i");
  i.classList.add("fas", "fa-minus")
  button.appendChild(i);

  // EXPAND/COLLAPSE - add functionality
  button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('.property').forEach((e) => {
      // could do contains/replace if toggle gets buggy
      e.classList.toggle('expanded');
      e.classList.toggle('collapsed');
    })
    let iconClass = button.children.item(0).classList;
    iconClass.toggle('fa-plus');
    iconClass.toggle('fa-minus');
  })

  newDiv.appendChild(button);

  let keyElement = document.createElement("label");
  keyElement.innerHTML = key;
  newDiv.appendChild(keyElement);

  parentDiv.appendChild(newDiv);
  return newDiv;
}

// includes property key and value
const buildDivPrimitive = (parentDiv, key, value, isArray) => {
  isArray && console.log(key + 'isArray: true');
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'key-primitive')

  let keyElement = document.createElement("label");
  keyElement.innerHTML = key;
  newDiv.appendChild(keyElement);

  let valueElement = document.createElement("input");
  valueElement.value = value;
  newDiv.appendChild(valueElement);

  parentDiv.appendChild(newDiv);
  return newDiv;
}


// DOWNLOAD
// https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
// solution for larger files: https://github.com/eligrey/FileSaver.js

const downloadJson = () => {
  console.log("downloadJson()");
}

let downloadButton = document.getElementById('downloadJson');
downloadButton.addEventListener('click', downloadJson);
