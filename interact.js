console.log("interact.js");
let buttons = document.getElementsByClassName('button-hide');

for (let i = 0; i < buttons.length; i++) {
  console.log("in the for loop");
  let button = buttons.item(i);
  button.addEventListener('click', () => {
    console.log(button.children.length);
  })
}

const collapse = (button) => {

  // 1. get this button's 'i' element
  // i.classList.remove("fa-minus");
  // i.classList.add("fa-plus");

  
  // 2. actually collapse the div


}