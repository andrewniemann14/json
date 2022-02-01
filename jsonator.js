// custom elements would be nice to separate the massive classlists to another file
// but they have limited compatibility
// i'll probably end up putting this in React/Angular anyway


let json;

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






// DISPLAY - MAIN FUNCTION
const printJson = (object, div) => {
  let newDiv;

  if (object.constructor.name === "Array") {
    console.log("caught an array!");
    console.log("array length: ", object.length); // 4
    let arrayDiv = buildDivArray(div);
    for (let i = 0; i < object.length; i++) { // iterating 4 times
      console.log(object[i]);
      newDiv = printJson(object[i], arrayDiv); // building 2 div.object-simple per iteration
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
    // TODO: here is where i need to group both key-value pairs into a single div

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      // console.log("key: ", key);
      let value = object[key];
      // console.log("value: ", value);

      if (typeof value == 'object') {
        newDiv = buildDivComplex(div, key); // returns <div.object-complex> with <input.key>
        printJson(value, newDiv);
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

// arguments doesn't work with arrow functions
function buildDivArray(parentDiv, key) {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'array'); // functional classes
  // newDiv.classList.add('', ''); // style classes

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

  // valueDiv is needed to group multi-field objects
  let valueDiv = document.createElement("div");
  valueDiv.classList.add('property', 'value-div');
  newDiv.appendChild(valueDiv);

  parentDiv.appendChild(newDiv);
  return valueDiv;
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




//  Editing Mode unlock input fields, maybe additional level of lock for keys?


// EDIT
const saveJsonOuter = (div, object) => {
  json = saveJsonInner(div, object);
  div.innerHTML = '';
  printJson(json, div); // debugging version
}


const saveJsonInner = (div, object) => {
  let children = div.querySelectorAll(':scope > .property'); // only 1: div.array

  for (let child of children) {
    object = readChild(child, object); // arrayDiv, jsonObject
    console.log(object); // 4x undefined
  }

  return object;
}


const readChild = (div, object) => { // should i create new working object to change/return?

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
    return readDivPrimitive(div, object); // returns value
  }

}


const readDivArray = (arrayDiv) => {
  let children = arrayDiv.querySelectorAll(':scope > .property');
  let array = new Array();

  children.forEach((child) => {
    let e = new Object();
    array.push(readChild(child, e)); // if 'object' is used here, all array elements have the value of the last element
  })

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

const readDivPrimitive = (primitiveDiv, object) => {
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
