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
const printJson = (o, div) => {
  let keys = Object.keys(o);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = o[key];
    let isArray = isNumber(key); // this is working

    // if (isArray) {
      // don't print the index header for each object
      // printJson(value, div);
      // continue;
    // }
    
    let newDiv;
    // could use custom elements here, though I don't see a benefit
    if (typeof value == 'object') {
      newDiv = buildDivObject(div, key, isArray);
      printJson(value, newDiv); // recurse
    }
    else { newDiv = buildDivPrimitive(div, key, value, isArray); }
    
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
  newDiv.classList.add('property', 'object-complex', 'expanded')
  if (isArray) {
    parentDiv.classList.add('array');
    newDiv.classList.add('array-element');
  }

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
const buildDivPrimitive = (parentDiv, key, value, isArray) => {
  isArray && console.log(key + 'isArray: true');
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
  console.log('div children length:', div.children.length);
  for (let i = 0; i < div.children.length; i++) {
    console.log("for loop starts");
    let child = div.children.item(i);
    console.log('child: ', child);

    if (child.classList.contains('object-simple')) {
      console.log("it's simple");
      let key = child.querySelector('.key').value;
      let value = child.querySelector('.value').value;
      object[key] = value;
    }
    
    else if (child.classList.contains('object-complex')) {
      console.log("it's complex");
      let keyInput = child.querySelector('.key'); // grabs the input field: good for values, bad for recursion
      object[keyInput.value] = saveJsonInner(child, object);


      // TODO:
      if (child.classList.contains('object-array')) {
        console.log("it's an array");

        let nestedArray = child.querySelectorAll(':scope > .property'); // grabs the divs of the next object
        console.log(nestedArray); // NodeList of 3
        
        for (let node of nestedArray) {
          console.log(node);
        }

      }

    }
      
  } // end for loop

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



