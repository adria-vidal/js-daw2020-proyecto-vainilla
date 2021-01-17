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

/**
 * declaracion/asignacion de elementos a variables
 */
let userActual = getuserActual();
let preguntas = [];
let tiempo = 5000;
let contPreguntas = document.getElementById('container');
let txtArea = document.getElementById('pregunta');
let txtPuntuacion = document.getElementById('puntuacion');
let tabla = document.getElementById('respuestas');
let buttonBack = document.getElementById('atras');
let buttonSave = document.getElementById('guardar');

/**
 * Evento al cargar,cuando usuario entra a sus preguntas,la fecha se actualiza a la actual
 */
window.addEventListener('load', updateFecha(userActual));

/**
 * Evento al hacer click sobre boton atrás vuelve a la pantalla2
 */
buttonBack.addEventListener(
  'click',
  (event) => {
    event.preventDefault();
    var redirecciona = '/Proyecto_Vainilla/PROYECTO/HTML/pantalla2.html';
    location.href = redirecciona;
  },
  true
);
/**
 *Evento para Deshabilitar el botón de atrás cuando pulsamos guardar
 */
buttonSave.addEventListener('click', () => (buttonBack.disabled = true));

/**
 * Al cargar la página,creamos/cargamos la tabla que se ha definido en los requisitos
 */
window.addEventListener('load', (tiempo) => {
  //Deshabilitamos boton mientras cargamos preguntas
  buttonSave.disabled = true;

  try {
    //Obtiene una promsa de la cookie con retraso tiempo = 5s
    let cargarpregunta = cargarPreguntas(true, tiempo, userActual);

    //Si la peticion a la cookie sale bien se crea la tabla con las preguntas
    cargarpregunta.then((datos) => {
      contPreguntas.removeChild(
        document.querySelector('div#container p#cargando')
      );

      let tabla = document.createElement('table');

      tabla.setAttribute('style', 'border:2px solid blue');
      tabla.setAttribute('id', 'tabla');
      tabla.setAttribute('border', '3');

      let cabeceras = document.createElement('tr');
      cabeceras.style.backgroundColor = 'blue';
      cabeceras.style.textShadow = '1px 1px 1px black';
      //titulo
      let cellTitulo = document.createElement('td');
      cellTitulo.textContent = 'Titulo';
      cellTitulo.style.padding = '15px';
      cellTitulo.style.margin = '10px';
      //respuestas
      let cellRes = document.createElement('td');
      cellRes.textContent = 'Respuesta';
      cellRes.style.padding = '15px';
      cellRes.style.margin = '10px';
      //puntuación
      let cellPuntos = document.createElement('td');
      cellPuntos.textContent = 'Puntuación';
      cellPuntos.style.padding = '15px';
      cellPuntos.style.margin = '10px';
      //estado
      let cellState = document.createElement('td');
      cellState.textContent = 'Estado';
      cellState.style.padding = '15px';

      cabeceras.appendChild(cellTitulo);
      cabeceras.appendChild(cellRes);
      cabeceras.appendChild(cellPuntos);
      cabeceras.appendChild(cellState);

      tabla.appendChild(cabeceras);
      contPreguntas.appendChild(tabla);

      //Obtengo  preguntas de la cookie
      let numeroRows = datos.preguntas;

      /**
       * Cuando este creado todo correctamente,llamaremos a
       * la función para crear las filas con los datos de la cookie
       */
      crearRowPreguntas(numeroRows, datos, tabla);

      /**
       * Activamos boton una vez cargadas las preguntas
       */
      buttonSave.disabled = false;
    });
  } catch (error) {
    let mensaje = error;
    let divError = document.getElementById('error');
    divError.textContent = mensaje;
  }
});

/**
 * Comprobación de cantidad de preguntas que tiene el usuario
 * y crea filas según cuántas haya
 *
 * @param {Array} numeroRows Array que contiene las preguntas
 * @param {Object} datos Objeto de la cookie para acceder al array de preguntas
 * @param {Node} tabla Elemento donde al que se le insertará otros elementos
 */
function crearRowPreguntas(numeroRows = 0, datos, tabla) {
  if (numeroRows == 0) return false;
  else {
    let numeroRows = datos.preguntas.length;

    for (let i = 0; i < numeroRows; i++) {
      //creamos fila
      let newRow = document.createElement('tr');

      //creamos columnas
      let newcellTitulo = document.createElement('td');
      let newcellRes = document.createElement('td');
      let newcellPuntos = document.createElement('td');
      let newcellState = document.createElement('td');

      // inserto el contenido obtenido de la cookie en las celdas
      newcellTitulo.textContent = datos.preguntas[i].titulo;
      newcellRes.textContent = datos.preguntas[i].respuesta;
      newcellPuntos.textContent = datos.preguntas[i].puntuacion;
      newcellState.textContent = datos.preguntas[i].estado;

      newRow.appendChild(newcellTitulo);
      newRow.appendChild(newcellRes);
      newRow.appendChild(newcellPuntos);
      newRow.appendChild(newcellState);

      //Agrego la nueva fila a la tabla
      tabla.appendChild(newRow);

      //Obtengo los datos de la cookie del usuario actual con  retraso
      let promesa = getDatosCookie(userActual, tiempo);
      /**
       * Promesa para crear una nueva pregunta al usuario
       * y agregarla y guardarla en la cookie del usuario de manera asíncrona
       */
      promesa
        .then((datosUser) => {
          //Creo la pregunta para el usuario
          let cuestionario = {
            titulo: txtTitulo,
            respuesta: radioResp,
            puntuacion: txtPuntuacion,
            estado: 'OK',
          };

          //La agrego
          datosUser.preguntas.push(cuestionario);

          /**Guardos los datos modificados en la cookie del usuario*/
          try {
            saveUserCookie(datosUser, usuarioActual);
            newcellState.textContent = 'OK';
          } catch (error) {
            newcellState.textContent = 'IMPOSIBLE AL GUARDAR';
          }

          /**Seleccionamos ultima fila y columna*/
          let statePregunta = document.querySelector(
            '#tabla tr:last-child td:last-child'
          );

          /**
           * Si el estado no es OK, el boton de atrás estará deshabilitado
           */
          if (statePregunta.textContent != 'OK') btnAtras.disabled = true;
          else btnAtras.disabled = false;
        })
        /**
         * capturamos error y enviamos mensaje de error
         */
        .catch((txtError) => {
          let mensaje = txtError.message;
          let divError = document.getElementById('error');
          divError.textContent = mensaje;
        });
    }
  }
}

/**
 * llamada a la funcion de comprobar a través del evento 'keyup'
 */
txtPuntuacion.addEventListener('keyup', checkValue);

txtArea.addEventListener('keyup', checkValue);

/**
 * Comprueba si los campos  estan vacios.
 * Si falta algun campo por rellenar, el boton de guardar
 * se desactiva hasta rellenar ese campo/s
 */
function checkValue() {
  let txtTitulo = document.getElementById('txtTitulo').value;
  let radioResp = document.querySelector('input[name=res]:checked');
  let txtPuntuacion = document.getElementById('puntuacion').value;

  if (
    txtTitulo == '' ||
    txtTitulo === undefined ||
    radioResp === null ||
    txtPuntuacion == '' ||
    txtPuntuacion === undefined
  ) {
    buttonSave.disabled = true;
  } else buttonSave.disabled = false;
}
