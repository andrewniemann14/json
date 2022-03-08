
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

  // (functionless) button to add element to an array
    let button = document.createElement("button")
    button.classList.add('button-add-array-element');
    let i = document.createElement("i");
    i.classList.add("fas", "fa-plus")
    button.appendChild(i);

    // button.addEventListener()

    newDiv.appendChild(button)

  parentDiv.appendChild(newDiv);
  return newDiv;
}

function buildDivElement(parentDiv) {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'array-element');
  
  // CLONE/DELETE - basic HTML elements
  let buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add('array-element-buttons');
  
  let button1 = document.createElement("button")
  let button2 = document.createElement("button")
  button1.classList.add('button-clone-array-element');
  button2.classList.add('button-remove-array-element');
  let i1 = document.createElement("i");
  let i2 = document.createElement("i");
  i1.classList.add("fas", "fa-clone")
  i2.classList.add("fas", "fa-trash")
  button1.appendChild(i1);
  button2.appendChild(i2);

  // CLONE - functionality
  button1.addEventListener('click', () => {
    parentDiv.appendChild(newDiv.cloneNode(true));
    // event listeners are not cloned, so need to save JSON and reload page so that clone divs are built properly
    saveJsonOuter(topDiv, json);
    topDiv.innerHTML = '';
    printJson(json, topDiv);
  })

  // DELETE - functionality
  button2.addEventListener('click', () => {
    newDiv.remove();
  })

  buttonsDiv.appendChild(button1);
  buttonsDiv.appendChild(button2);
  newDiv.appendChild(buttonsDiv);
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
