import CustomElement from './custom-element.js';



export class MyModal extends CustomElement {

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
    return document.querySelector('my-table');
    // return JSON.parse(this.getAttribute('data-set'));
  };

  constructor() {
    super();

    let template = document.getElementById('modal_template');
    let templateContent = template.content;
    const shadow = this.attachShadow({
      mode: 'open'
    });

    shadow.appendChild(templateContent.cloneNode(true));


    this.appendChild(document.getElementById('color-picker'));

    // Apply external styles to the shadow dom
    const styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute('href', 'style-modal.css');


    // Apply external scripts to the shadow dom


    // Attach the created elements to the shadow dom
    shadow.appendChild(styleLink);


    const table = document.querySelector('my-table');


    // Get the modal
    var modal = shadow.getElementById("modal_id");

    // Get the button that opens the modal
    var btn = document.getElementById('create-btn');

    // Get the <span> element that closes the modal
    var span = shadow.querySelector(".close");

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      this.show();
      shadow.getElementById('modal-header').innerText = "Добавить цвет"
      shadow.getElementById('create-btn-modal').innerText = "Добавить";
      shadow.getElementById('name').value = '';
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      this.hide();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    // -- add color

    var btnM = shadow.getElementById("create-btn-modal");
    // var currenti = data.length - 1;
    btnM.onclick = function() {
      let name = shadow.getElementById('name').value;
      let select = shadow.getElementById('type');
      let type = select.options[select.selectedIndex].value;
      modal.style.display = "none";

      let newData = {
        name: `${name}`,
        type: `${type}`,
        color: `${color}`
      }

      // var row = (this.state.edit) ? tbody.rows[currenti] : tbody.insertRow();
      if (this.state.edit) {
        table._data[this.state.colorid] = {
          ...table._data[this.state.colorid],
          ...newData
        };
        table.setData(table._data);
        this.state.edit = false;
      } else {
        table.setData(table._data.push(newData));
      }
    }


  }
}