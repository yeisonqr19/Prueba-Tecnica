class App {
  constructor(idCalendar, idUsers) {
    this.insCalendario = new Calendar(idCalendar);
    this.insUsers = new users(idUsers);
  }
}

class Calendar {
  constructor(id) {
    this.elCalendar = document.getElementById(id);
    this.cells = [];
    this.currentMonth = moment();
    this.showTemplate();
    this.elGridBody = document.querySelector(".grid__body");
    this.elMonthName = document.querySelector(".month-name");
    this.showCells();
  }

  showTemplate() {
    this.elCalendar.innerHTML = this.getTemplate();
    this.addEventListenerToControls();
  }

  getTemplate() {
    let template = `
    <div class="calendar__header">
      <button type="button" class="control control--prev">
        &lt;
      </button>
      <span class="month-name"></span>
      <button type="button" class="control control--next">
        &gt;
      </button>
    </div>

    <div class="calendar__body">
      <div class="grid">
        <div class="grid__header">
          <span class="grid-cell">
            Lun
          </span>
          <span class="grid-cell">
            Mar
          </span>
          <span class="grid-cell">
            Mie
          </span>
          <span class="grid-cell">
            Jue
          </span>
          <span class="grid-cell">
            Vie
          </span>
          <span class="grid-cell">
            Sab
          </span>
          <span class="grid-cell">
            Dom
          </span>
        </div>

        <div class="grid__body">
          
        </div>
      </div>
    </div>
    `;
    return template;
  }

  //Metodo de los eventos del calendario
  addEventListenerToControls() {
    //Variable que tiene las dos flechas:
    let controls = document.querySelectorAll(".control");

    controls.forEach((control) => {
      control.addEventListener("click", (e) => {
        let target = e.target;
        if (target.classList.contains("control--next")) {
          this.changeMonth(true);
        } else if (target.classList.contains("control--prev")) {
          this.changeMonth(false);
        }

        //Actualizo el Calendario:
        this.showCells();
      });
    });
  }

  addEventListenerToCells() {
    let losCells = document.querySelectorAll(".grid__cell--gd");
    losCells.forEach((loscell) => {
      loscell.addEventListener("click", ({ target }) => {
        target.classList.add("grid__cell--selected");
        let selectedCells = document.querySelectorAll(".grid__cell--selected");

        if (target.classList.contains("grid__cell--disabled")) {
          target.classList.remove("grid__cell--selected");
        }
        if (selectedCells.length === 8) {
          console.log("Solo puede Seleccionar Siete dias");

          let element = document.querySelectorAll(".grid__cell--selected");

          element.forEach((ele) => {
            ele.classList.remove("grid__cell--selected");
          });
        }
      });
    });
  }

  //Funcion De Apoyo para cambiar los meses:
  changeMonth(next = true) {
    if (next) {
      this.currentMonth.add(1, "month");
    } else {
      this.currentMonth.subtract(1, "month");
    }
  }

  //Para mostrar las fechas en el template del calendario
  showCells() {
    this.cells = this.generateDates(this.currentMonth);
    //Valido las Fechas
    if (this.cells === null) {
      console.log("No fue Posible Crear las Fechas del Calendario");
      return;
    }

    this.elGridBody.innerHTML = "";
    let templateCells = "";
    let cleanClass = "";

    for (let i = 0; i < this.cells.length; i++) {
      cleanClass = "";
      if (!this.cells[i].isInCurrentMonth) {
        cleanClass = "grid__cell--disabled";
      } else {
        cleanClass = "";
      }
      templateCells += `
      <span class="grid-cell grid__cell--gd ${cleanClass}"> 
        ${this.cells[i].date.date()}
      </span>`;
    }

    this.elMonthName.innerHTML = this.currentMonth.format("MMM YYYY");
    this.elGridBody.innerHTML = templateCells;
    this.addEventListenerToCells();
  }

  //Genero las fechas que mostrare en el template
  generateDates(monthToShow = moment()) {
    //Verifico si Recibo un objeto moment:
    if (!moment.isMoment(monthToShow)) {
      return null;
    }

    //DateStart es un objeto moment
    let dateStart = moment(monthToShow).startOf("month");
    let dateEnd = moment(monthToShow).endOf("month");

    let cellsDates = [];

    //miro si el primer dia del mes es el primer dia del calendario
    while (dateStart.day() !== 1) {
      dateStart.subtract(1, "days");
    }

    //Busco la ultima fecha que mostrare en el calendario
    while (dateEnd.day() !== 0) {
      dateEnd.add(1, "days");
    }

    //Aqui recorri de la fecha inicial a la final del calendario y lo almacene en el arreglo
    do {
      cellsDates.push({
        date: moment(dateStart),
        isInCurrentMonth: dateStart.month() === monthToShow.month(),
      });

      dateStart.add(1, "days");
    } while (dateStart.isSameOrBefore(dateEnd));

    //Arreglo con todas mis Fechas
    return cellsDates;
  }
}

//CLASE PARA CONSULTAR LA API Y MOSTRAR LOS USUARIOS:
class users {
  constructor(id) {
    this.elementUser = document.getElementById(id);
    this.requestUser();
    this.userResult = [];
  }

  requestUser() {
    const options = {
      method: "GET",
      headers: {
        "secret-key": "06a446e5dd12470cf4086d1fd53c205b",
      },
    };

    const peticion = async () => {
      const result = await fetch(
        "https://www.inspectorsystems.co/v1/api/servicio-static/TI/servicios-gantt",
        options
      );

      const data = await result.json();
      return data;
    };

    peticion().then((users) => {
      this.userResult = users.data;
      console.log(this.userResult);
      return this.userResult;
    });
  }
}

class Grafica {}

function MostrarGrafica(e) {
  const days = document.querySelectorAll(".chart-values li");
  const tasks = document.querySelectorAll(".chart-bars li");
  const daysArray = [...days];

  tasks.forEach((el) => {
    const duracion = el.dataset.duration.split("-");

    const diaInicial = duracion[0];

    const diaFinal = duracion[1];

    let left = 0,
      width = 0;

    if (diaInicial.endsWith("½")) {
      const filteredArray = daysArray.filter(
        (dia) => dia.textContent == diaInicial.slice(0, -1)
      );
      left = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth / 2;
    } else {
      const filteredArray = daysArray.filter(
        (dia) => dia.textContent == diaInicial
      );
      left = filteredArray[0].offsetLeft;
    }

    if (diaFinal.endsWith("½")) {
      const filteredArray = daysArray.filter(
        (dia) => dia.textContent == diaFinal.slice(0, -1)
      );
      width =
        filteredArray[0].offsetLeft + filteredArray[0].offsetWidth / 2 - left;
    } else {
      const filteredArray = daysArray.filter(
        (dia) => dia.textContent == diaFinal
      );
      width = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth - left;
    }

    // apply css
    el.style.left = `${left}px`;
    el.style.width = `${width}px`;
    if (e.type == "load") {
      el.style.backgroundColor = el.dataset.color;
      el.style.opacity = 1;
    }
  });
}

const eventListeners = () => {
  window.addEventListener("load", MostrarGrafica);
  window.addEventListener("resize", MostrarGrafica);
};
