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


const table = document.getElementById('table_id');
const tbody = document.getElementById('tbody_id');

function fillRow(row, data_itm, i) {
  row.insertCell(0).innerHTML = (data_itm.hasOwnProperty('color')) ? "<div class=\"color\" style=\"background: " + `${data_itm.color}` + ";\">" : "";
  row.insertCell(1).textContent = (data_itm.hasOwnProperty('name')) ? `${data_itm.name}` : "";
  row.insertCell(2).innerText = (data_itm.hasOwnProperty('type')) ? `${data_itm.type.toLowerCase()}` : "";
  row.insertCell(3).textContent = `${i}`;
  row.insertCell(4).innerHTML = "<i class=\"fa fa-pencil\"></i>";
  row.insertCell(5).innerHTML = "<i class=\"fa fa-trash\"></i>";
  let pencil = row.querySelector('.fa-pencil');
  activatePencil(pencil);
  let trashbin = row.querySelector('.fa-trash');
  activateTrashbins(trashbin)

}

function updateRow(row, data) {
  row.cells[0].innerHTML = (data.hasOwnProperty('color')) ? "<div class=\"color\" style=\"background: " + `${data.color}` + ";\">" : "";
  row.cells[1].textContent = (data.hasOwnProperty('name')) ? `${data.name}` : "";
  row.cells[2].innerText = (data.hasOwnProperty('type')) ? `${data.type.toLowerCase()}` : "";
}
// filling the table
function drawTable() {
  for (var i = 0; i < data.length; i++) {
    var row = tbody.insertRow(i);
    fillRow(row, data[i], i);
  };
};

drawTable();
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("create-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "flex";
  document.getElementById('modal-header').innerText = "Добавить цвет"
  document.getElementById('create-btn-modal').innerText = "Добавить";
  document.getElementById('name').value = '';

}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// -- add color

var btnM = document.getElementById("create-btn-modal");
var currenti = data.length - 1;
btnM.onclick = function() {
  let name = document.getElementById('name').value;
  let select = document.getElementById('type');
  let type = select.options[select.selectedIndex].value;
  modal.style.display = "none";
  let newData = {
    name: `${name}`,
    type: `${type}`,
    color: `${color}`
  }
  var row = (edit) ? tbody.rows[rowPosbyID(currenti)] : tbody.insertRow();
  if (edit) {
    data[currenti] = {
      ...data[currenti],
      ...newData
    };
    updateRow(row, data[currenti]);
    edit = false;

  } else {
    data.push(newData)
    fillRow(row, data[data.length - 1], data.length - 1);
  }
}

function rowPosbyID(currenti) {
  for (let i in tbody.rows) {
    let row = tbody.rows[i];
    if (row.cells[3].innerHTML == currenti) return row.rowIndex - 1
  }
}

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
  $code.innerText = color;
  $color.style.setProperty('--color', color);
}

function onChangeType(e) {
  picker.setType(e.value);
}

window.onload = function() {
  initPicker();
  updateColor(color);
};

//----edit


let edit = false;

function activatePencil(pencil) {
  pencil.addEventListener('click', function(e) {
    var row = e.target.parentNode.parentNode;
    currenti = row.cells[3].innerHTML;
    color = data[currenti].color;
    document.getElementById('modal-header').innerText = "Изменение цвета"
    document.getElementById('name').value = data[currenti].name;
    let select = document.getElementById('type');
    select.value = data[currenti].type;
    document.getElementById('create-btn-modal').innerText = "Изменить"
    picker.destroy();
    initPicker({
      color: color
    });
    edit = true;
    modal.style.display = "flex";
  });
};

function activatePencils() {
  let pencils = document.querySelectorAll('.fa-pencil');
  pencils.forEach(activatePencil);
};


activatePencils();


function activateTrashbins(trashbin) {
  trashbin.addEventListener('click', function(e) {
    var row = e.target.parentNode.parentNode;
    var rowIndex = row.rowIndex;
    tbody.deleteRow(rowIndex - 1);
    currenti = rowIndex - 1;
    data.splice(currenti, 1);
  });
};
//---- remove

let trashbins = document.querySelectorAll('i.fa.fa-trash');

//---------------------------------------------- localstorage --------------------------------------------------------------

let saveBtn = document.querySelector('i.fa.fa-save');

saveBtn.onclick = function() {
  window.localStorage.setItem('data', JSON.stringify(data));
};

// ----------------------------------------  Drag and Drop function --------------------------------------------------------
(function() {
  "use strict";



  var currRow = null,
    dragElem = null,
    mouseDownX = 0,
    mouseDownY = 0,
    mouseX = 0,
    mouseY = 0,
    mouseDrag = false;

  function init() {
    bindMouse();
  }

  function bindMouse() {
    document.addEventListener('mousedown', (event) => {
      if (event.button != 0) return true;

      let target = getTargetRow(event.target);
      if (target) {
        currRow = target;
        addDraggableRow(target);
        currRow.classList.add('is-dragging');


        let coords = getMouseCoords(event);
        mouseDownX = coords.x;
        mouseDownY = coords.y;

        mouseDrag = true;
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (!mouseDrag) return;

      let coords = getMouseCoords(event);
      mouseX = coords.x - mouseDownX;
      mouseY = coords.y - mouseDownY;

      moveRow(mouseX, mouseY);
    });

    document.addEventListener('mouseup', (event) => {
      if (!mouseDrag) return;

      currRow.classList.remove('is-dragging');
      table.removeChild(dragElem);

      dragElem = null;
      mouseDrag = false;
    });
  }


  function swapRow(row, index) {
    let currIndex = Array.from(tbody.children).indexOf(currRow),
      row1 = currIndex > index ? currRow : row,
      row2 = currIndex > index ? row : currRow;

    tbody.insertBefore(row1, row2);
  }

  function moveRow(x, y) {
    dragElem.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";

    let dPos = dragElem.getBoundingClientRect(),
      currStartY = dPos.y,
      currEndY = currStartY + dPos.height,
      rows = getRows();

    for (var i = 0; i < rows.length; i++) {
      let rowElem = rows[i],
        rowSize = rowElem.getBoundingClientRect(),
        rowStartY = rowSize.y,
        rowEndY = rowStartY + rowSize.height;

      if (currRow !== rowElem && isIntersecting(currStartY, currEndY, rowStartY, rowEndY)) {
        if (Math.abs(currStartY - rowStartY) < rowSize.height / 2)
          swapRow(rowElem, i);
      }
    }
  }

  function addDraggableRow(target) {
    dragElem = target.cloneNode(true);
    dragElem.classList.add('draggable-table__drag');
    dragElem.style.height = getStyle(target, 'height');
    dragElem.style.background = getStyle(target, 'backgroundColor');
    for (var i = 0; i < target.children.length; i++) {
      let oldTD = target.children[i],
        newTD = dragElem.children[i];
      newTD.style.width = getStyle(oldTD, 'width');
      newTD.style.height = getStyle(oldTD, 'height');
      newTD.style.padding = getStyle(oldTD, 'padding');
      newTD.style.margin = getStyle(oldTD, 'margin');
    }

    table.appendChild(dragElem);


    let tPos = target.getBoundingClientRect(),
      dPos = dragElem.getBoundingClientRect();
    dragElem.style.bottom = ((dPos.y - tPos.y) + tPos.height / 4) + "px"; //- tPos.y) - tPos.height)
    dragElem.style.left = "-1px";

    document.dispatchEvent(new MouseEvent('mousemove', {
      view: window,
      cancelable: true,
      bubbles: true
    }));
  }







  function getRows() {
    return table.querySelectorAll('tbody tr');
  }

  function getTargetRow(target) {
    let elemName = target.tagName.toLowerCase();

    if (elemName == 'tr') return target;
    if (elemName == 'td') return target.closest('tr');
  }

  function getMouseCoords(event) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }

  function getStyle(target, styleName) {
    let compStyle = getComputedStyle(target),
      style = compStyle[styleName];

    return style ? style : null;
  }

  function isIntersecting(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) &&
      Math.min(min0, max0) <= Math.max(min1, max1);
  }



  init();

})();