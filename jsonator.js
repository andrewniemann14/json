// next up: adding/removing array elements
// best approach is probably to work with the HTML, copying/deleting divs
// then the object side will follow on the next save

// then, adding/removing properties, using the same approach


let json;
/*
// fetch doesn't work with local files, need to use Live Server
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


*/

/*

// DISPLAY - MAIN FUNCTION
const printJson = (object, div) => {
  let newDiv;

  // merge divElement into divArray, like we did with readDiv...
  if (object.constructor.name === "Array") {
    let arrayDiv = buildDivArray(div);
    for (let i = 0; i < object.length; i++) {
      let containerDiv = buildDivElement(arrayDiv)
      printJson(object[i], containerDiv);
    }

  } else {
    newDiv = buildDiv(div, object)
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

      if (typeof value == 'object') {
        newDiv = buildDivComplex(div, key); // returns <div.object-complex> with <input.key>
        printJson(value, newDiv);
      } else {
        newDiv = buildDivSimple(div, key, value); // returns <div.object-simple> with <input.key>, <input.value>
      }

    } // end for loop
  }
  
  else {
    buildDivPrimitive(div, object) // returns null, adds <div.object-primitive> to 'div'
  }
}

// arguments doesn't work with arrow functions
function buildDivArray(parentDiv, key) {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'array'); // functional classes
  // newDiv.classList.add('', ''); // style classes

  // if (arguments.length == 2) {
  //   let keyElement = document.createElement("input");
  //   keyElement.classList.add('key');
  //   keyElement.value = key;
  //   newDiv.appendChild(keyElement);
  // }

  parentDiv.appendChild(newDiv);
  return newDiv;
}

function buildDivElement(parentDiv) {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'array-element');

  let button = document.createElement("button")
  button.classList.add('button-add-array-element');
  let i = document.createElement("i");
  i.classList.add("fas", "fa-plus")
  button.appendChild(i);
  newDiv.appendChild(button);

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
  i.classList.add("fas", "fa-chevron-down")
  button.appendChild(i);

  // EXPAND/COLLAPSE - add functionality
  button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('.property').forEach((e) => {
      // could do contains/replace if toggle gets buggy
      e.classList.toggle('expanded');
      e.classList.toggle('collapsed');
    })
    let iconClass = button.children.item(0).classList;
    iconClass.toggle('fa-chevron-right');
    iconClass.toggle('fa-chevron-down');
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
  valueElement.classList.add('value', 'value-input');
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
*/


/*
//  Editing Mode unlock input fields, maybe additional level of lock for keys?


// EDIT
const saveJsonOuter = (div, object) => {
  json = saveJsonInner(div, object);
  div.innerHTML = '';
  printJson(json, div); // debugging version
}


const saveJsonInner = (div, object) => {
  let children = div.querySelectorAll(':scope > .property');

  for (let child of children) {
    object = readChild(child, object);
  }

  return object;
}


const readChild = (div, object) => {

  if (div.classList.contains('array')) {
    return readDivArray(div); // creates array for recursion on children
  }

  else if (div.classList.contains('object-simple')) {
    return readDivSimple(div, object); // returns key+value object
  }

  else if (div.classList.contains('object-complex')) {
    return readDivComplex(div, object); // creates new object for recursion on 'div'
  }

  else if (div.classList.contains('object-primitive')) {
    return readDivPrimitive(div); // returns value
  }

}

const readDivArray = (arrayDiv) => {
  let elements = arrayDiv.querySelectorAll(':scope > .property');
  let array = new Array();

  elements.forEach((element) => {
    let children = element.querySelectorAll(':scope > .property');
    let o = new Object();
    children.forEach((child) => {
      readChild(child, o);
    })
    array.push(o);
  })
  console.log(array);
  return array;
}

const readDivComplex = (complexDiv, object) => {
  let key = complexDiv.querySelector('.key').value;
  let newObject = new Object();
  object[key] = saveJsonInner(complexDiv, newObject);

  return object;
}

const readDivSimple = (simpleDiv, object) => {
  let key = simpleDiv.querySelector('.key').value;
  let value = simpleDiv.querySelector('.value').value;
  object[key] = value;

  return object;
}

const readDivPrimitive = (primitiveDiv) => {
  let value = primitiveDiv.querySelector('.value').value;
  return value;
}



// DOWNLOAD
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
*/