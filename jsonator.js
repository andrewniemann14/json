// should probably use custom elements so i don't have classList manipulation all over the place
// especially if i use a css framework

// this is the working copy of the json object
let json;


// fetch doesn't work with local files. must use Live Server
const loadJsonFromURL = (url) => {
  topDiv.innerHTML = ''; // should move/merge this somewhere
  fetch(url)
  .then(response => response.json())
  .then(data => {
    json = data;
    printJson(json, topDiv);
  })
}

function loadJsonFromFile(file) {
  topDiv.innerHTML = ''; // should move/merge this somewhere
  let reader = new FileReader();
  reader.onload = ((e) => {
    json = JSON.parse(e.target.result)
    printJson(json, topDiv);
  })
  reader.readAsText(file); // this triggers the 'onload'
}








// DISPLAY - MAIN FUNCTION
const printJson = (object, div) => {
  let newDiv;

  if (object.constructor.name === "Array") {
    let arrayDiv = buildDivArray(div); // no key, just a container
    for (let i = 0; i < object.length; i++) {
      newDiv = printJson(object[i], arrayDiv);
    }

  } else {
    buildDiv(div, object)
  }

  return newDiv;
}

const buildDiv = (div, object) => {
  let newDiv;

  if (typeof object == 'object') {
    let keys = Object.keys(object);

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = object[key];

      // currently, key1 = [value1, value2, value3] is being called complex
      // might need to be corrected later, but works fine for now
      if (typeof value == 'object') {
        newDiv = buildDivComplex(div, key); // returns <div.object-complex> with <input.key>
        printJson(value, newDiv); // recurses
      }
      else {
        newDiv = buildDivSimple(div, key, value); // returns <div.object-simple> with <input.key>, <input.value>
      }
    }
  }
  
  else {
    buildDivPrimitive(div, object) // returns null, adds <div.object-primitive> to 'div'
  }
}

// arguments doesn't work with arrow funcitons
function buildDivArray(parentDiv, key) {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'array');

  if (arguments.length == 2) {
    let keyElement = document.createElement("input");
    keyElement.classList.add('key');
    keyElement.value = key;
    newDiv.appendChild(keyElement);
  }

  parentDiv.appendChild(newDiv);
  return newDiv;
}


const buildDivComplex = (parentDiv, key) => {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'object-complex', 'expanded')

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

  let keyElement = document.createElement("input");
  keyElement.classList.add('key');
  keyElement.value = key;
  newDiv.appendChild(keyElement);

  parentDiv.appendChild(newDiv);
  return newDiv;
}


const buildDivSimple = (parentDiv, key, value) => {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'object-simple')

  let keyElement = document.createElement("input");
  keyElement.classList.add('key');
  keyElement.value = key;
  newDiv.appendChild(keyElement);

  let valueElement = document.createElement("input");
  valueElement.classList.add('value');
  valueElement.value = value;
  newDiv.appendChild(valueElement);

  parentDiv.appendChild(newDiv);
  return newDiv;
}

// could switch to just building an <input.value>, without the <div.object-primitive> container
// whatever is easier for the editing side of things
const buildDivPrimitive = (parentDiv, object) => {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'object-primitive');

  let valueElement = document.createElement("input");
  valueElement.classList.add('value');
  valueElement.value = object;

  newDiv.appendChild(valueElement);
  parentDiv.appendChild(newDiv);
}










// EDIT

//  Editing Mode unlock input fields, maybe additional level of lock for keys?


const saveJsonOuter = (div, object) => {
  json = saveJsonInner(div, object);
  div.innerHTML = '';
  printJson(json, div); // debugging version
}


// TODO: not working with key-less primitives - this is actually a problem with how the divs are build up top ( see simplearraytest.json's div structure )
const saveJsonInner = (div, object) => {
  let children = div.querySelectorAll(':scope > .property');

  for (let child of children) {
    readChild(child, object);
  }
  return object;
}


const readChild = (div, object) => {

  if (div.classList.contains('array')) {
    readDivArray(div, object);
  }

  else if (div.classList.contains('object-simple')) {
    readDivSimple(div, object); // gets key+value from 'child', modifies 'object'
  }

  else if (div.classList.contains('object-complex')) {
    readDivComplex(div, object); // creates and returns new object, which is passed in recursion on 'div'
  }
  return object;
}


// TODO: 1. breaking element into object where index = key
// TODO: 2. forcing all array elements to the value of the last element
const readDivArray = (div, object) => {
  let children = div.querySelectorAll(':scope > .property');
  let array = new Array();
  let newObject = new Object();
  for (let child of children) {
    array.push(readChild(child, newObject));
  }
  Object.assign(object, array);
  return object;
}

const readDivSimple = (div, object) => {
  let key = div.querySelector('.key').value;
  let value = div.querySelector('.value').value;
  object[key] = value;
}

const readDivComplex = (div, object) => {
  let key = div.querySelector('.key').value;
  let newObject = new Object();
  object[key] = saveJsonInner(div, newObject);
}







// DOWNLOAD
// https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
// solution for larger files: https://github.com/eligrey/FileSaver.js

function downloadJson() {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(json, null, 2)], {
    type: "text/plain"
  }));
  a.setAttribute("download", "download.json");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

