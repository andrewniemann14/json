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
    let arrayDiv = buildDivArray(div); // returns a <div.array>, added to 'div'
    for (let i = 0; i < object.length; i++) {
      newDiv = printJson(object[i], arrayDiv);
    }

  // if not array, continue
  } else {

    // if it's a key-value pair
    if (typeof object == 'object') {
      let keys = Object.keys(object);

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = object[key];

        if (typeof value == 'object') {
          newDiv = buildDivComplex(div, key); // returns <div.object-complex>, added to 'div'
          printJson(value, newDiv); // recurse
        }
        else {
          newDiv = buildDivSimple(div, key, value); // returns <div.object-simple>, added to 'div'
        }
      }
    }
    
    else {
      buildDivPrimitive(div, object) // returns null, adds <div.object-primitive> to 'div'
    }
  }

  return newDiv;
}


const buildDivArray = (parentDiv) => {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'array');

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

//  1. Editing Mode makes everything input fields
//      "keys" are locked by default, make an unlock button


const saveJsonOuter = (div, object) => {
  saveJsonInner(div, object);
  div.innerHTML = '';
  // json = object; // live version
  printJson(object, div); // debugging version
}

// 1. take a div, like #foundation
// 2. look for all sub-divs, like .array
// 3. iterate through each subdiv (but only once in our example)
// 4. find the .array
// TODO: keep walking through. console logs look good now, but values still aren't getting saved


const saveJsonInner = (div, object) => {
  console.log('div:', div); // 1.
  let children = div.querySelectorAll(':scope > .property');
  console.log('children: ', children); // 2.

  for (let child of children) {
    console.log('child:', child); // 3.

    if (child.classList.contains('array')) { // 4.
      let array = new Array();
      array.push(saveJsonInner(child, object));
      // let arrayNodes = child.querySelectorAll(':scope > .property');
      // for (let node of arrayNodes) {
        // console.log('node:', node);
        // array.push(saveJsonInner(node, object));
      // }
      // console.log(array);
      return array;
    }

    else {

      if (child.classList.contains('object-simple')) {
        readDivSimple(child, object);
        // continue;
      }
      
      else if (child.classList.contains('object-complex')) {
        readDivComplex(child, object);
        // continue;
      }
    }
  } // end for loop
    
  return object;
}



const readDivSimple = (div, object) => {
  console.log(div);

  // if (div.classList.contains('array')) {
  //   let array = new Array();
  //   array.push(saveJsonInner(div, object));
  //   return array;
  // }

  let key = div.querySelector('.key').value;
  let value = div.querySelector('.value').value;
  object[key] = value;
  return object;
}

const readDivComplex = (div, object) => {

  // if (div.classList.contains('array')) {
  //   let array = new Array();
  //   array.push(saveJsonInner(div, object));
  //   return array;
  // }
  
  let key = div.querySelector('.key').value;
  let newObject = new Object();
  object[key] = saveJsonInner(div, newObject);
}

const readDivArray = (div, object) => {

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

