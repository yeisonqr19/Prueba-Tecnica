class App {
  constructor(idCalendario) {
    let calendario = new Calendario(idCalendario);
    calendario.mostrarCalendario();
  }
}

class Calendario {
  constructor(id) {
    this.elementoCalendario = document.getElementById(id);

    this.celdas = [];
    this.mesActual = moment();
    this.mostrarFechas();
  }

  mostrarCalendario() {
    this.elementoCalendario.innerHTML = `<div class="calendario-header">
    <button
      type="button"
      class="control control-atras"
      id="control-siguiente"
    >
      &#60;
    </button>
    <span class="nombre-mes">Feb 2022</span>
    <button
      type="button"
      class="control control-siguiente"
      id="control-siguiente"
    >
      &#62;
    </button>
  </div>

  <div class="calendario-body">
    <div class="calendario-grid">
      <!--Nombre de los dias de la semana-->
      <div class="calendario-grid-header">
        <span class="grid-cell grid-cell-hd"> Lun </span>
        <span class="grid-cell grid-cell-hd"> Mar </span>
        <span class="grid-cell grid-cell-hd"> Mie </span>
        <span class="grid-cell grid-cell-hd"> Jue </span>
        <span class="grid-cell grid-cell-hd"> Vie </span>
        <span class="grid-cell grid-cell-hd"> Sab </span>
        <span class="grid-cell grid-cell-hd"> Dom </span>
      </div>
      <div class="calendario-grid-body">
        <span class="grid-cell grid-cell-bd grid-cell-selected"
          >1</span
        ><span class="grid-cell grid-cell-bd">2</span
        ><span class="grid-cell grid-cell-bd">3</span
        ><span class="grid-cell grid-cell-bd">4</span
        ><span class="grid-cell grid-cell-bd">5</span
        ><span class="grid-cell grid-cell-bd">6</span
        ><span class="grid-cell grid-cell-bd">7</span
        ><span class="grid-cell grid-cell-bd">8</span
        ><span class="grid-cell grid-cell-bd">9</span
        ><span class="grid-cell grid-cell-bd">10</span
        ><span class="grid-cell grid-cell-bd">11</span
        ><span class="grid-cell grid-cell-bd">12</span
        ><span class="grid-cell grid-cell-bd">13</span
        ><span class="grid-cell grid-cell-bd">14</span
        ><span class="grid-cell grid-cell-bd">15</span
        ><span class="grid-cell grid-cell-bd">16</span
        ><span class="grid-cell grid-cell-bd">17</span
        ><span class="grid-cell grid-cell-bd">18</span
        ><span class="grid-cell grid-cell-bd">19</span
        ><span class="grid-cell grid-cell-bd">20</span
        ><span class="grid-cell grid-cell-bd">21</span
        ><span class="grid-cell grid-cell-bd">22</span
        ><span class="grid-cell grid-cell-bd">23</span
        ><span class="grid-cell grid-cell-bd">24</span
        ><span class="grid-cell grid-cell-bd">25</span
        ><span class="grid-cell grid-cell-bd">26</span
        ><span class="grid-cell grid-cell-bd">27</span
        ><span class="grid-cell grid-cell-bd">28</span
        ><span class="grid-cell grid-cell-bd">29</span
        ><span class="grid-cell grid-cell-bd">30</span
        ><span class="grid-cell grid-cell-bd">31</span
        ><span class="grid-cell grid-cell-bd">32</span
        ><span class="grid-cell grid-cell-bd">33</span
        ><span class="grid-cell grid-cell-bd grid-cell-disabled"
          >34</span
        ><span class="grid-cell grid-cell-bd grid-cell-disabled"
          >35</span
        >
      </div>
    </div>
  </div>`;
  }

  generarFecha(mesMostrar = moment()) {
    //Valido si estoy Recibiendo un objeto de Tipo Moment
    if (!moment.isMoment(mesMostrar)) {
      return null;
    }

    //primer dia calendario:
    let primerDiaCld = moment(mesMostrar).startOf("month");

    //ultimo dia Calendario:
    let ultimoDiaCld = moment(mesMostrar).endOf("month");

    let arregloFechas = [];

    //busco el primer y ultimo dia del calendario con el metodo day:
    while (primerDiaCld.day() !== 1) {
      primerDiaCld.subtract(1, "days");
    }

    while (ultimoDiaCld.day() !== 0) {
      ultimoDiaCld.add(1, "days");
    }

    //Arreglo con todas las fechas:
    do {
      arregloFechas.push({
        fecha: moment(primerDiaCld),
        fechaMesActual: primerDiaCld.month() === mesMostrar.month(),
      });
      primerDiaCld.add(1, "days");
    } while (primerDiaCld.isSameOrBefore(ultimoDiaCld));

    return arregloFechas;
  }

  mostrarFechas() {
    this.celdas = this.generarFecha(this.mesActual);
    if (this.celdas === null) {
      return;
    }

    

  }
}

const eventListeners = () => {
  window.addEventListener("load", MostrarGrafica);
  window.addEventListener("resize", MostrarGrafica);
};

eventListeners();

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
