//  Editing Mode unlocks input fields, maybe additional level of lock for keys?


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