import {
  MyTable
} from './elements-mytable.js';
import {
  MyModal
} from './elements-mymodal.js';

window.customElements.define('my-table', MyTable);
window.customElements.define('my-modal', MyModal);
const myTable = document.querySelector('my-table');
const myModal = document.querySelector('my-modal');

const createBtn = document.getElementById('create-btn'); // кнопка добавить

const editBtns = myTable.selectAll('.fa-pencil'); // кнопки  редактировать

editBtns.forEach((editBtn) => {
  editBtn.addEventListener('click', async function() {
    await updateColor(myTable.state.data[myModal.state.colorid].color);
    callPicker({
      color: myModal.state.color
    })

  })
})




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

function callPicker(opts = null) {
  if (picker) {
    picker.setColor(opts.color)
  } else {
    initPicker(opts);
    picker.$el.setAttribute('slot', 'color-picker-slot');
    myModal.appendChild(picker.$el);
  }
}



function initPicker(options) {
  options = Object.assign(defaults, options);
  picker = new EasyLogicColorPicker(options);
  document.querySelector('.el-cp-swatches__header').querySelector('h2').innerText = 'Палитра';
}


function updateColor(value) {
  color = value;
  myModal.setState({
    color: value
  })
  // -----------sample__color

  // const $color = myModal.select('.sample__color');
  // const $code = myModal.select('.sample__code');
  // $code.innerText = value;
  // $color.style.setProperty('--color', color);
}


//-------------------------------------------- addEventListener -----------------

createBtn.addEventListener('click', function() {
    callPicker({
      color: '#ffffff'
    })
  }

);

editBtns.forEach((editBtn) => {
  editBtn.addEventListener('click', async function() {
    await updateColor(myTable.state.data[myModal.state.colorid].color);
    callPicker({
      color: myModal.state.color
    })

  })
})

//---------------------------------------------- localstorage --------------------------------------------------------------

let saveBtn = document.querySelector('[name="save"]');

saveBtn.onclick = function() {
  window.localStorage.setItem('data', JSON.stringify(myTable.getData));
};

let clearBtn = document.querySelector('[name="close"]');

clearBtn.onclick = function() {
  window.localStorage.clear();
  alert('local storage deleted')
}

//------------------------------------------ onload ----------------------------------------------------------
window.onload = function() {
  myModal.hide();
};