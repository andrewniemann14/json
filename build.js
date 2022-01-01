let topDiv = document.getElementById("foundation");

// fetch doesn't work with local files. must use Live Server
fetch("test.json")
  .then(response => response.json())
  .then(json => printJson(json, topDiv));

const printJson = (o, div) => {
  let keys = Object.keys(o);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = o[key];

    // if (isNumber(key)) {
    //   printJson(value, div);
    //   continue; // end for loop after recursion
    // }

    let newDiv;
    if (typeof value == 'object') { newDiv = buildDivObject(div, key); }
    else { newDiv = buildDivPrimitive(div, key, value); }
    
    // recurses if value is an object
    typeof value == 'object' && printJson(value, newDiv); 
  } // end for loop
} // end printJson() function


// if key is number, than it is part of an array
// https://stackoverflow.com/questions/2652319/how-do-you-check-that-a-number-is-nan-in-javascript
const isNumber = (key) => {
  let derp = Number.parseInt(key) // NaN is a number, but unique in its inequality to itself
  return Number.parseInt(key) == derp; // if true, then it's not NaN, so it IS a number
}

const buildDivObject = (parentDiv, key) => {
  let newDiv = document.createElement("div");
  newDiv.classList.add('property', 'key-object', 'expanded')

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

const buildDivPrimitive = (parentDiv, key, value) => {
  console.log("buildDivPrimitive() " + key);
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

// excpand/colapse
// jquery
// http://jsfiddle.net/hungerpain/eK8X5/7/

// CSS only
// https://codepen.io/abergin/pen/ihlDf



// when ready to actually upload and use a file:
// https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications