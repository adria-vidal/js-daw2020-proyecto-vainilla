/**
 * Importamos las funciones necesarias del documento moduleCookieFecha
 */
import {
  getDatosCookie,
  getuserActual,
  saveUserCookie,
  cargarPreguntas,
  updateFecha,
} from './moduleCookieFecha.js';

//Obtengo primero el usuario que ha iniciado sesion
let userActual = getuserActual();

let tiempo = 5000;

//--- Reseteo el formulario al entrar a la pagina
let formulario = document.getElementById('formulario');
formulario.reset();
//--------
let contenedorPreguntas = document.getElementById('wrapper-Pregunta');
let btnGrabar = document.getElementById('btnGrabar');
let btnAtras = document.getElementById('btnAtras');
let inputTitulo = document.getElementById('txtTitulo');
let inputPuntuacion = document.getElementById('txtPuntuacion');

//Cuando el usuario entra a sus preguntas, se acutaliza la fecha de entrada
window.addEventListener('load', updateFecha(userActual));

// Al cargar la pagina se carga la tabla de las preguntas
window.addEventListener('load', crearTabla);

//  GRABAMOS PREGUNTA
btnGrabar.addEventListener('click', savePregunta);

// VOLVEMOS ATRAS 
btnAtras.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.replace('pantalla2.html');
});

/**
 * agregamos pregunta a la tabla y a la cookie del usuario
 * @param {Event} event Elemento que desencadena la accion
 */
function savePregunta(event) {
  
  event.preventDefault();

  let tabla = document.getElementById('tablaPreguntas');

  /** CREO LA NUEVA FILA Y SUS CELDAS */
  let filaAgregada = document.createElement('tr');

  let columnaTitulo = document.createElement('td');
  let columnaRespuesta = document.createElement('td');
  let columnaPuntuacion = document.createElement('td');
  let columnaEstado = document.createElement('td');
  

  /**------- | OBTENGO EL VALOR DEL FORMULARIO | ------- */
  let inputTitulo = document.getElementById('txtTitulo').value;
  let radioRespuesta = document.querySelector('input[name=respuesta]:checked')
    .value;
  let inputPuntuacion = document.getElementById('txtPuntuacion').value;

  //Agrego a cada celda el valor del formulario
  columnaTitulo.textContent = inputTitulo;
  columnaRespuesta.textContent = radioRespuesta;
  columnaPuntuacion.innerHTML = inputPuntuacion;
  columnaEstado.textContent = 'Guardando...';
  console.log("guardado");

  //Agrego las celdas a la fila y la fila a la tabla
  filaAgregada.appendChild(columnaTitulo);
  filaAgregada.appendChild(columnaRespuesta);
  filaAgregada.appendChild(columnaPuntuacion);
  filaAgregada.appendChild(columnaEstado);
  tabla.appendChild(filaAgregada);

  //Obtengo los datos de la cookie del usuario actual con un retraso de 5000 mls
  let promesa = getDatosCookie(userActual, tiempo);

  promesa
    .then((datosUsuario) => {
      //Creo la pregunta para el usuario
      let pregunta = {
        titulo: inputTitulo,
        respuesta: radioRespuesta,
        puntuacion: inputPuntuacion,
        estado: 'OK',
      };

      //La agrego
      datosUsuario.preguntas.push(pregunta);

      //Guardos los datos modificados en la cookie del usuario
      try {
        saveUserCookie(datosUsuario, userActual);
        columnaEstado.textContent = 'OK';
      } catch (error) {
        columnaEstado.textContent = 'ERROR AL GUARDAR';
      }

      //Selecciona la ultima fila y la ultima columna, la columna de estado
      let cellStatePregunta = document.querySelector(
        '#tablaPreguntas tr:last-child td:last-child'
      );

      //Mientras que la columna de estado no esté en "OK" el boton de atras estará
      //deshabilitado
      if (cellStatePregunta.textContent != 'OK') btnAtras.disabled = true;
      else btnAtras.disabled = false;
    })
    .catch((mensajeError) => {
      let mensaje = mensajeError.message;
      let divError = document.getElementById('mensajeError');
      divError.textContent = mensaje;
    });

  //Reseteo el formulario para introducir una nueva pregunta mientras se guarda la pregunta
  formulario.reset();
}

/**
 * Recoge informacion de la cookie y crea una tabla donde de mostrará al usuario
 * cada pregunta guardada de la cookie en filas
 */
function crearTabla() {
  //Deshabilito el boton para grabar mientras cargan las preguntas
  btnGrabar.disabled = true;

  try {
    //Obtiene una promsa de la cookie con retraso de 5 segundos (TRUE)
    let cargarpregunta = cargarPreguntas(true, tiempo, userActual);

    //Si la peticion a la cookie sale bien se crea la tabla con las preguntas
    cargarpregunta.then((datos) => {
      contenedorPreguntas.removeChild(
        document.querySelector('section#wrapper-Pregunta h1#cargandoPreguntas')
      );

      let tabla = document.createElement('table');

      tabla.setAttribute('style', 'border:2px solid black');
      tabla.setAttribute('id', 'tablaPreguntas');
      tabla.setAttribute('border', '3');

      let columnCabecera = document.createElement('tr');
      columnCabecera.style.backgroundColor = 'orange';
      columnCabecera.style.textShadow = '1px 1px 1px black';

      let cellTitulo = document.createElement('td');
      cellTitulo.textContent = 'Titulo';
      cellTitulo.style.padding = '1rem';
      let cellResp = document.createElement('td');
      cellResp.textContent = 'Respuesta';
      cellResp.style.padding = '1rem';
      let cellPuntuacion = document.createElement('td');
      cellPuntuacion.textContent = 'Puntuación';
      cellPuntuacion.style.padding = '1rem';
      let cellState = document.createElement('td');
      cellState.textContent = 'Estado';
      cellState.style.padding = '1rem';

      columnCabecera.appendChild(cellTitulo);
      columnCabecera.appendChild(cellResp);
      columnCabecera.appendChild(cellPuntuacion);
      columnCabecera.appendChild(cellState);

      tabla.appendChild(columnCabecera);
      contenedorPreguntas.appendChild(tabla);

      //Obtengo el array de preguntas de la cookie
      let numeroFilas = datos.preguntas;

      /** llamo a crear las filas de la preguntas guardadas en cookie */
      crearFilasPreguntas(numeroFilas, datos, tabla);

      /** Activo el boton cuando estan cargadas */
      btnGrabar.disabled = false;
    });
  } catch (error) {
    let mensaje = error;
    let divError = document.getElementById('mensajeError');
    divError.textContent = mensaje;
  }
}

/**
 *
 * Comprueba cuentas preguntas tiene el usuario y, en funcion de las que tenga
 * crea sus filas para cada pregunta.
 *
 * @param {Array} numeroFilas Array que contiene las preguntas
 * @param {Object} datos Objeto de la cookie con el que se puede acceder al array de preguntas
 * @param {Node} tabla Elemento donde se va a "pintar" todo
 */
function crearFilasPreguntas(numeroFilas = 0, datos, tabla) {
  if (numeroFilas == 0) return false;
  else {
    let numeroFilas = datos.preguntas.length;

    for (let i = 0; i < numeroFilas; i++) {
      //------- | CREO NUEVA FILA | ------------
      let nuevaFila = document.createElement('tr');
      //---------------------------------------

      /**------ | CREO SUS COLUMNAS | ------------- */
      let nuevacellTitulo = document.createElement('td');
      let nuevacellResp = document.createElement('td');
      let nuevacellPuntuacion = document.createElement('td');
      let nuevacellState = document.createElement('td');
      //--------------------------------------------

      /**| Creo su conteneido a partir de los datos de la cookie | */
      nuevacellTitulo.textContent = datos.preguntas[i].titulo;
      nuevacellResp.textContent = datos.preguntas[i].respuesta;
      nuevacellPuntuacion.textContent = datos.preguntas[i].puntuacion;
      nuevacellState.textContent = datos.preguntas[i].estado;

      /**| LOS AGREGO | */
      nuevaFila.appendChild(nuevacellTitulo);
      nuevaFila.appendChild(nuevacellResp);
      nuevaFila.appendChild(nuevacellPuntuacion);
      nuevaFila.appendChild(nuevacellState);

      /** Agrego a la tabla la nueva fila */
      tabla.appendChild(nuevaFila);
    }
  }
}

/** Evento para comprobar si los camos input estan rellenados o no */
inputPuntuacion.addEventListener('keyup', comprobarValor);

inputTitulo.addEventListener('keyup', comprobarValor);

/**
 * Comprueba si los campos input estan vacios. Si algu de ellos esta vacio,
 * se desactivara el boton para grabar hasta que se rellene al campo.
 */
function comprobarValor() {
  let inputTitulo = document.getElementById('txtTitulo').value;
  let radioRespuesta = document.querySelector('input[name=respuesta]:checked');
  let inputPuntuacion = document.getElementById('txtPuntuacion').value;

  if (
    inputTitulo == '' ||
    inputTitulo === undefined ||
    radioRespuesta === null ||
    inputPuntuacion == '' ||
    inputPuntuacion === undefined
  ) {
    btnGrabar.disabled = true;
  } else btnGrabar.disabled = false;
}