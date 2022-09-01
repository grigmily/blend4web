import CustomElement from './custom-element.js';



export class MyModal extends CustomElement {

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

    this.state = {
      edit: false,
      colorname: ''
    }

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

    // Attach the created elements to the shadow dom
    shadow.appendChild(styleLink);




    const myTable = document.querySelector('my-table');
    const myModal = document.querySelector('my-modal');

    // Get the button that opens the modal
    var btn = document.getElementById('create-btn');

    // Get the <span> element that closes the modal
    var span = shadow.querySelector(".close");

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      myModal.show();
      myModal.state.colorid = myTable.state.data.length;
      myModal.setData = {
        edit: false
      }
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      myModal.hide();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      console.log();
      if (event.path[0] == shadow.getElementById("modal_id")) {
        myModal.hide();
      }
    }

    // --  add color

    var btnM = shadow.getElementById("create-btn-modal");

    btnM.onclick = async function() { // сохранение-изменение цвета
      let name = shadow.getElementById('name').value;
      let select = shadow.getElementById('type');
      let type = select.options[select.selectedIndex].value;

      function updateStateColor(newData) {
        myTable.state.data[myModal.state.colorid] = {
          ...myTable.state.data[myModal.state.colorid],
          ...newData
        };
        myTable.state.editing = true;
        myModal.state.edit = false;
      }


      myModal.hide();

      let newData = { // новый цвет
        name: `${name}`,
        type: `${type}`,
        color: `${myModal.state.color}`,
        colorid: myModal.state.colorid
      }



      if (myModal.state.edit) { //если редактировать
        await updateStateColor(newData);
        myTable.setData = myTable.state.data;

        myModal.setData = {
          edit: false
        };
      } else { //если добавить
        myTable.state.data.push(newData);
        myTable.setData = myTable.state.data
      }
    }

    //переменные для рендера

    this.header = shadow.getElementById('modal-header');
    this.okbtn = shadow.getElementById('create-btn-modal');
    this.namearea = shadow.getElementById('name');
  }



  render() { // (1)
    this.header.innerText = this.state.edit ? "Изменить цвет" : "Добавить цвет";
    this.okbtn.innerText = this.state.edit ? "Изменить" : "Добавить";
    this.namearea.value = this.state.edit ? this.state.colorname : '';

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
  }




}