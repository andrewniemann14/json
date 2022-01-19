var json;

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
    console.log('caught ', object, ' as an array');
    newDiv = buildDivArray(div);
    for (let i = 0; i < object.length; i++) {
      console.log(object[i]);
      newDiv = printJson(object[i], newDiv);
    }

    // TODO: left off here
    // arrayofstrings.json: strings are split into letter arrays,
    // arrayofobjects.json: objects are nested in divs instead of siblings
  } else {
    let keys = Object.keys(object);
    console.log(keys); // 0, repeating infinitely

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      console.log(key);
      let value = object[key];
      console.log(value);
      

      // could use custom elements here
      if (typeof value == 'object') {
        console.log(value, ' is object');
        newDiv = buildDivComplex(div, key);
        printJson(value, newDiv); // recurse
      }
      else { newDiv = buildDivSimple(div, key, value); }
    } // end for loop
  }
  return newDiv;
}


// includes expand/collapse, does not include property values
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

// includes property key and value
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

const buildDivArray = (parentDiv) => {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'array');

  // let keyElement = document.createElement("input");
  // keyElement.classList.add('key');
  // keyElement.value = key;
  // newDiv.appendChild(keyElement);
  // console.log('buildDivArray > newDiv > ', newDiv);
  // console.log(key);
  parentDiv.appendChild(newDiv);
  return newDiv;
}





// EDIT

//  1. Editing Mode makes everything input fields
//      "keys" are locked by default, make an unlock button
//  2. Save gets all values and builds an object
//  3. working copy of 'json' variable is updated
//  4. printJson(newVersion) - probably unnecessary


const saveJsonOuter = (div, object) => {
  saveJsonInner(div, object);
  div.innerHTML = '';
  printJson(object, div); // debugging version
  // json = object; // live version
}

const saveJsonInner = (div, object) => {
  

  // TODO: currently de-arraying the objects, hardcoding indeces as the new keys
  // TODO: once arrays are working, need to handle if the overall file is array
  if (div.classList.contains('array')) {
    let arrayNodes = child.querySelectorAll(':scope > .property'); // grabs the divs of the next object
    let array = new Array();
    for (let node of arrayNodes) {
      array.push(saveJsonInner(node, object));
    }
    return array;
  }
  
  let children = div.querySelectorAll(':scope > .property');

  // change to forEach(), or is that less compat?
  for (let i = 0; i < children.length; i++) {
    let child = children.item(i);
   


    if (child.classList.contains('object-simple')) {
      readDivSimple(child, object);
      // continue;
    }
    
    else if (child.classList.contains('object-complex')) {
      readDivComplex(child, object);
      // continue;
    }
    
  } // end for loop
  
  return object;
}


const readDivSimple = (div, object) => {
  console.log(div);

  if (div.classList.contains('array')) {
    let array = new Array();
    array.push(saveJsonInner(div, object));
    return array;
  }

  let key = div.querySelector('.key').value;
  let value = div.querySelector('.value').value;
  object[key] = value;
  return object;
}

const readDivComplex = (div, object) => {

  if (div.classList.contains('array')) {
    let array = new Array();
    array.push(saveJsonInner(div, object));
    return array;
  }
  
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



