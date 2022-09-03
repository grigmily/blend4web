import CustomElement from './custom-element.js';
import dndScript from './script-dnd.js';
// import style from './style-table.css';

export class MyTable extends CustomElement {

  set setData(val) {
    // Reflect the value of the open property as an HTML attribute.
    if (val) {
      this.setAttribute('data-set', JSON.stringify(val));
    } else {
      this.removeAttribute('data-set');
    }

  }
  get getData() {
    return JSON.parse(this.getAttribute('data-set'));
  };



  constructor() {
    super();
    let data = [];
    let saved = window.localStorage.getItem('data');
    if (saved) {
      data = JSON.parse(saved);
    } else {
      data = [{
        name: "name1",
        type: "main",
        color: "#581f1f",
      }, {
        name: "name2",
        type: "side",
        color: "#10ef40",
      }];
    };
    this.setData = data;
    this.state = {
      data: data,
      editing: false
    };

    let template = document.getElementById('table_template');
    let templateContent = template.content;
    const shadow = this.attachShadow({
      mode: 'open'
    });

    shadow.appendChild(templateContent.cloneNode(true));

    this.appendChild(document.getElementById('create-btn'));

    // Apply external styles to the shadow dom
    const styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute('href', 'style-table.css');
    const faLink = document.createElement('link');
    faLink.setAttribute('rel', 'stylesheet');
    faLink.setAttribute('href', 'fonts/font-awesome-4.7.0/css/font-awesome.min.css');



    // Attach the created elements to the shadow dom
    shadow.appendChild(styleLink);
    shadow.appendChild(faLink);


    // Run drag-and-drop script
    dndScript(shadow);

    // tbody
    this._tbody = shadow.querySelector('tbody');
  }

  render() { // (1)
    const myModal = document.querySelector('my-modal');
    const myTable = document.querySelector('my-table');
    const rowCount = this._tbody.rows.length;

    if (rowCount) { // если не пустая таблица
      if (this.state.editing) { // если редактируется
        let colorData = myTable.state.data.find(el => el.colorid === myModal.state.colorid);
        let row = this._tbody.rows[myModal.state.colorrow - 1];
        row.cells[1].innerText = colorData.name;
        row.cells[2].innerText = colorData.type;
        row.cells[0].querySelector('div').style.background = colorData.color;
        row.cells[3].innerText = colorData.colorid;
        console.log(row);
        this.state.editing = false;
      }

      this.state.data = this.getData;

      if (this.state.data.length > this._tbody.rows.length) { // если добавление элемента
        this.newRow(this._tbody, this.state.data[this.state.data.length - 1], this.state.data.length - 1)
      };
    } else { //если таблица пустая - присваиваются colorid и загружаются значения по умолчанию
      this.state.data.forEach((item, i) => {
        Object.assign(item, {
          colorid: i
        })
      });

      this.state.data.map((color) => {
        this.newRow(this._tbody, color, color.colorid)
      });
    }

  };

  connectedCallback() { // (2)
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() { // (3)
    return ['data-set'];
  }

  attributeChangedCallback(name, oldValue, newValue) { // (4)
    this.render();
    window.localStorage.setItem('data', JSON.stringify(this.getData))
  }


  //  --------------------------------------- useful fuctions---------------------------------------------------------

  fillRow(row, data_itm, i) {
    row.insertCell(0).innerHTML = (data_itm.hasOwnProperty('color')) ? "<div class=\"color\" style=\"background: " + `${data_itm.color}` + ";\">" : "";
    row.insertCell(1).textContent = (data_itm.hasOwnProperty('name')) ? `${data_itm.name}` : "";
    row.insertCell(2).innerText = (data_itm.hasOwnProperty('type')) ? `${data_itm.type.toLowerCase()}` : "";
    row.insertCell(3).textContent = `${i}`
    row.insertCell(4).textContent = `${data_itm.color}`;
    row.insertCell(5).innerHTML = "<i class=\"fa fa-pencil\"></i>";
    row.insertCell(6).innerHTML = "<i class=\"fa fa-trash\"></i>";
    let pencil = row.querySelector('.fa-pencil');
    this.activatePencil(pencil);
    let trashbin = row.querySelector('.fa-trash');
    this.activateTrashbins(trashbin);
  }

  newRow(tbody, color, i) {
    let row = document.createElement('tr');
    this.fillRow(row, color, i);
    tbody.appendChild(row);
  }

  activatePencil(pencil) {
    pencil.addEventListener('click', function(e) {
      var row = e.target.parentNode.parentNode;

      const myModal = document.querySelector('my-modal')
      const myTable = document.querySelector('my-table')
      myModal.setState({
        color: myTable.state.data[+row.cells[3].innerText].color,
        colorname: row.cells[1].innerText,
        colorid: +row.cells[3].innerText,
        colorrow: row.rowIndex,
        edit: true
      })
      myModal.setData = {
        edit: 'true',
      };
      myModal.show();
    })
  };

  activateTrashbins(trashbin) {
    trashbin.addEventListener('click', function(e) {
      const myTable = document.querySelector('my-table');
      var row = e.target.parentNode.parentNode;
      var rowIndex = row.rowIndex;
      const i = +row.cells[3].innerText;
      myTable.state.data.splice(i, 1);
      myTable.select('tbody').deleteRow(rowIndex - 1);
      myTable.setData = myTable.state.data;
    });
  };



  convertRGBtoHex(red, green, blue) {
    function colorToHex(color) {
      var hexadecimal = color.toString(16);
      return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    }

    return "#" + colorToHex(red) + colorToHex(green) + colorToHex(blue);
  }
};