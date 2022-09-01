import CustomElement from './custom-element.js';
import dndScript from './script-dnd.js';
// import style from './style-table.css';

export class MyTable extends CustomElement {

  set setData(val) {
    // Reflect the value of the open property as an HTML attribute.
    if (val) {
      this.setAttribute('data-set', JSON.stringify(val));
      this._data = val;
    } else {
      this.removeAttribute('data-set');
    }

  }
  get getData() {
    return JSON.parse(this.getAttribute('data-set'));
  };



  constructor() {
    super();
    this._data = [];
    let template = document.getElementById('table_template');
    let templateContent = template.content;
    const shadow = this.attachShadow({
      mode: 'open'
    });

    shadow.appendChild(templateContent.cloneNode(true));

    this._tbody = shadow.querySelector('tbody');

    this.appendChild(document.getElementById('create-btn'));

    // Apply external styles to the shadow dom
    const styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute('href', 'style-table.css');
    const faLink = document.createElement('link');
    faLink.setAttribute('rel', 'stylesheet');
    faLink.setAttribute('href', 'fonts/font-awesome-4.7.0/css/font-awesome.min.css');

    // Apply external scripts to the shadow dom


    // Attach the created elements to the shadow dom
    shadow.appendChild(styleLink);
    shadow.appendChild(faLink);

    // Run drag-and-drop script
    dndScript(shadow);
  }

  render() { // (1)
    this._data = this.getData;
    this._data.map((colorData, i) => {
      let row = document.createElement('tr');
      this.fillRow(row, colorData, i);
      this._tbody.appendChild(row);
    });
  };

  connectedCallback() { // (2)
    if ((!this.rendered) && (this._data.length)) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() { // (3)
    return ['data-set'];
  }

  attributeChangedCallback(name, oldValue, newValue) { // (4)
    this.render();
  }




  fillRow(row, data_itm, i) {
    row.insertCell(0).innerHTML = (data_itm.hasOwnProperty('color')) ? "<div class=\"color\" style=\"background: " + `${data_itm.color}` + ";\">" : "";
    row.insertCell(1).textContent = (data_itm.hasOwnProperty('name')) ? `${data_itm.name}` : "";
    row.insertCell(2).innerText = (data_itm.hasOwnProperty('type')) ? `${data_itm.type.toLowerCase()}` : "";
    row.insertCell(3).textContent = `${i}`;
    row.insertCell(4).innerHTML = "<i class=\"fa fa-pencil\"></i>";
    row.insertCell(5).innerHTML = "<i class=\"fa fa-trash\"></i>";
    let pencil = row.querySelector('.fa-pencil');
    this.activatePencil(pencil);
    let trashbin = row.querySelector('.fa-trash');
    this.activateTrashbins(trashbin);
  }

  updateRow(row, data) {
    row.cells[0].innerHTML = (data.hasOwnProperty('color')) ? "<div class=\"color\" style=\"background: " + `${data.color}` + ";\">" : "";
    row.cells[1].textContent = (data.hasOwnProperty('name')) ? `${data.name}` : "";
    row.cells[2].innerText = (data.hasOwnProperty('type')) ? `${data.type.toLowerCase()}` : "";
  }


  // filling the table
  drawTable() {
    for (var i = 0; i < data.length; i++) {
      var row = tbody.insertRow(i);
      fillRow(row, data[i], i);
    };
  };

  rowPosbyID(currenti) {
    for (let i in tbody.rows) {
      let row = tbody.rows[i];
      if (row.cells[3].innerHTML == currenti) return row.rowIndex - 1
    }
  }

  activatePencil(pencil) {
    pencil.addEventListener('click', function(e) {
      var row = e.target.parentNode.parentNode;
      var i = +row.cells[3].innerHTML;
      // let data = JSON.parse((e.path.find((el) => el.tagName == 'MY-TABLE')).getAttribute('data-set'));
      // let color = data[i].color;
      // document.getElementById('modal-header').innerText = "Изменение цвета";
      // document.getElementById('name').value = data[i].name;
      // let select = document.getElementById('type');
      // select.value = data[i].type;
      // document.getElementById('create-btn-modal').innerText = "Изменить"

      document.querySelector('my-modal').setState({
        colorid: i,
        edit: true
      })
      document.querySelector('my-modal').show()
      console.log(document.querySelector('my-modal').state);

    })
  };

  activateTrashbins(trashbin) {
    trashbin.addEventListener('click', function(e) {
      var row = e.target.parentNode.parentNode;
      console.log(e);
      var rowIndex = row.rowIndex;
      tbody.deleteRow(rowIndex - 1);
      currenti = rowIndex - 1;
      data.splice(currenti, 1);
    });
  };
};