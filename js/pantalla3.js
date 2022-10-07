/**
 * Importamos las funciones necesarias del documento moduleCookieFecha
 */
'use strict';
import {
  getDatosCookie,
  saveDatosCookie,
  getUsuarioActual,
  cargarPreguntas,
  updateFecha,
} from './moduleCookieFecha.js';

let time = 5000;
/** Obtenemos el usuario */
let userActual = getUsuarioActual();

/** Reseteamos formulario */
let formulario = document.getElementById('formulario');
formulario.reset();

let inTitulo = document.getElementById('txtTitulo');
let inPuntuacion = document.getElementById('txtPuntuacion');
let button_grabar = document.getElementById('btGrabar');
let button_atras = document.getElementById('btAtras');
let contPreguntas = document.getElementById('wrapper-Pregunta');

/** Evento para cargar las preguntas */
window.addEventListener('load', crearTabla);

/** Actualizamos fecha/hora cuando entre el user */
window.addEventListener('load', updateFecha(userActual));

/** Evento para agregar y guardar pregunta cuando se haga click */
button_grabar.addEventListener('click', agregarPregunta);

/** Evento para volver a pantalla2 al pulsar btn Atras  */
button_atras.addEventListener('click', (e) => {
  e.preventDefault();
  var redirecciona = '../pantalla2.html';
  location.href = redirecciona;
});

/**
 * Funcion para crear el nº de filas segun la preguntas del usuario
 * @param {Object} datos Objeto para acceder al array de preguntas de la cookie
 */
function rowPreguntas(nRows = 0, datos, tabla) {
  if (nRows == 0) return false;
  else {
    let nRows = datos.preguntas.length;

    for (let i = 0; i < nRows; i++) {
      let newRow = document.createElement('tr');

      /** Columnas */
      let newCellTitulo = document.createElement('td');
      let newCellRespuesta = document.createElement('td');
      let newCellPuntuacion = document.createElement('td');
      let newlastCellState = document.createElement('td');

      /** Asignamos datos de la cookie en las celdas */
      newCellTitulo.textContent = datos.preguntas[i].titulo;
      newCellRespuesta.textContent = datos.preguntas[i].respuesta;
      newCellPuntuacion.textContent = datos.preguntas[i].puntuacion;
      newlastCellState.textContent = datos.preguntas[i].estado;

      /** Insertamos datos de la cookie en las celdas */
      newRow.appendChild(newCellTitulo);
      newRow.appendChild(newCellRespuesta);
      newRow.appendChild(newCellPuntuacion);
      newRow.appendChild(newlastCellState);

      //** Nueva fila */
      tabla.appendChild(newRow);
    }
  }
}
/**
 * Funcion para agregar una pregunta a la tabla y a la cookie del usuario actual
 */
function agregarPregunta(event) {
  /** Eliminamos accion por defecto  */
  event.preventDefault();

  let tabla = document.getElementById('tablaPreguntas');

  let rowAdd = document.createElement('tr');

  let cTitulo = document.createElement('td');
  let cRespuesta = document.createElement('td');
  let cPuntuacion = document.createElement('td');
  let cState = document.createElement('td');

  /** Obtenemos las respuestas del formulario */
  let inTitulo = document.getElementById('txtTitulo').value;
  let radioRespuesta = document.querySelector('input[name=respuesta]:checked')
    .value;
  let inPuntuacion = document.getElementById('txtPuntuacion').value;

  /** Agregamos la respuesta a cada celda */
  cTitulo.textContent = inTitulo;
  cRespuesta.textContent = radioRespuesta;
  cPuntuacion.innerHTML = inPuntuacion;
  cState.textContent = 'Guardando...';

  rowAdd.appendChild(cTitulo);
  rowAdd.appendChild(cRespuesta);
  rowAdd.appendChild(cPuntuacion);
  rowAdd.appendChild(cState);
  tabla.appendChild(rowAdd);

  /** Obtenemos datos cookie con retraso */
  let promesa = getDatosCookie(userActual, time);
  /** Promesa para crear la pregunta y añadirla a la cookie */
  promesa
    .then((datosUsuario) => {
      let pregunta = {
        titulo: inTitulo,
        respuesta: radioRespuesta,
        puntuacion: inPuntuacion,
        estado: 'OK',
      };
      datosUsuario.preguntas.push(pregunta);

      try {
        saveDatosCookie(datosUsuario, userActual);
        cState.textContent = 'OK';
      } catch (error) {
        cState.textContent = 'Ha surgido error al guardar';
      }

      /** Seleccion ultima celda del State */
      let lastCellState = document.querySelector(
        '#tablaPreguntas tr:last-child td:last-child'
      );

      /** estará deshabilitado el boton atras, mientras la celda no se encuentre en OK */
      if (lastCellState.textContent != 'OK') button_atras.disabled = true;
      else button_atras.disabled = false;
    })
    .catch((error) => {
      let mensaje = error.message;
      let divError = document.getElementById('error');
      divError.textContent = mensaje;
    });

  //Reseteo el formulario para introducir una nueva pregunta mientras se guarda la pregunta
  formulario.reset();
}

/**
 * Funcion para obtener info de la cookie del user y mostrar preguntas guardadas creando filas
 */
function crearTabla() {
  //Deshabilito el boton para grabar mientras cargan las preguntas
  button_grabar.disabled = true;

  try {
    /** Obtenemos la promesa con un retraso de 5s */
    let cargarpregunta = cargarPreguntas(true, time, userActual);

    /** Si ha ido OK, creamos tabla */
    cargarpregunta.then((datos) => {
      contPreguntas.removeChild(
        document.querySelector('article#wrapper-Pregunta h2#cargando')
      );

      let tabla = document.createElement('table');

      tabla.setAttribute('style', 'border:2px solid black');
      tabla.setAttribute('id', 'tablaPreguntas');

      let colCabecera = document.createElement('tr');
      colCabecera.style.backgroundColor = 'lightblue';

      let cellTitulo = document.createElement('td');
      cellTitulo.textContent = 'TITULO';
      cellTitulo.style.padding = '2rem';
      let cellRespuesta = document.createElement('td');
      cellRespuesta.textContent = 'RESPUESTA';
      cellRespuesta.style.padding = '2rem';
      let cellPuntuacion = document.createElement('td');
      cellPuntuacion.textContent = 'PUNTUACION';
      cellPuntuacion.style.padding = '2rem';
      let cellState = document.createElement('td');
      cellState.textContent = 'ESTADO';
      cellState.style.padding = '2rem';

      colCabecera.appendChild(cellTitulo);
      colCabecera.appendChild(cellRespuesta);
      colCabecera.appendChild(cellPuntuacion);
      colCabecera.appendChild(cellState);

      tabla.appendChild(colCabecera);
      contPreguntas.appendChild(tabla);

      /** Obtenemos preguntas de la cookie */
      let nRows = datos.preguntas;

      /** LLamamos a la funcion para crear las filas */
      rowPreguntas(nRows, datos, tabla);

      /** Activamos boton de grabar */
      button_grabar.disabled = false;
    });
  } catch (error) {
    let mensaje = error;
    let divError = document.getElementById('error');
    divError.textContent = mensaje;
  }
}

/** Evento para comprobar los campos */
inPuntuacion.addEventListener('keyup', checkRespuesta);
inTitulo.addEventListener('keyup', checkRespuesta);

/**
 * Funcion para comprobar si estan rellenos los campos
 * para habilitar o deshabiliotar el boton de grabar
 */
function checkRespuesta() {
  let inTitulo = document.getElementById('txtTitulo').value;
  let inPuntuacion = document.getElementById('txtPuntuacion').value;
  let radioRespuesta = document.querySelector('input[name=respuesta]:checked');

  if (
    inTitulo == '' ||
    inTitulo === undefined ||
    radioRespuesta === null ||
    inPuntuacion == '' ||
    inPuntuacion === undefined
  ) {
    button_grabar.disabled = true;
  } else button_grabar.disabled = false;
}
