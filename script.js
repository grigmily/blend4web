import {
  MyTable
} from './elements-mytable.js';
import {
  MyModal
} from './elements-mymodal.js';



let data = [];
let saved = window.localStorage.getItem('data');
if (saved) {
  data = JSON.parse(saved);
} else {
  data = [{
    name: "name1",
    type: "main",
    color: "#581f1f"
  }, {
    name: "name2",
    type: "side",
    color: "#10ef40"
  }];
};


window.customElements.define('my-table', MyTable);
window.customElements.define('my-modal', MyModal);
const myTable = document.querySelector('my-table');
const myModal = document.querySelector('my-modal');
// const myPicker = document.querySelector('.el-colorpicker')
myTable.setData = data;




// ----------------------------------------  color_picker --------------------------------------------------------


let picker;
let color = '#ffffff';

const defaults = {
  color: color,
  container: document.getElementById('color_picker'),
  onChange: function(color) {
    updateColor(color);
  },
  swatchColors: ['#D1BF91', '#60371E', '#A6341B', '#F9C743', '#C7C8C4'],
};

function initPicker(options) {
  options = Object.assign(defaults, options);
  picker = new EasyLogicColorPicker(options);
  document.querySelector('.el-cp-swatches__header').querySelector('h2').innerText = 'Палитра';
}


function updateColor(value) {
  color = value;
  const $color = document.querySelector('.sample__color');
  const $code = document.querySelector('.sample__code');
  $code.innerText = value;
  $color.style.setProperty('--color', color);
}

function onChangeType(e) {
  picker.setType(e.value);
}

window.onload = function() {
  initPicker();
  myModal.hide();
  document.querySelector('.el-colorpicker').style.display = "none";
  // updateColor(color);
};

//----edit

let pencils = document.querySelectorAll('.fa-pencil');
let edit = false;



// pencils.forEach(pencil => {
//  activatePencil(pencil);
// });


//---- remove

// let trashbins = document.querySelectorAll('i.fa.fa-trash');

//---------------------------------------------- localstorage --------------------------------------------------------------

let saveBtn = document.querySelector('i.fa.fa-save');

saveBtn.onclick = function() {
  window.localStorage.setItem('data', JSON.stringify(data));
};

// ----------------------------------------  Drag and Drop function --------------------------------------------------------