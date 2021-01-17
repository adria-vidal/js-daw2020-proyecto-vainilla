/**
 * Creamos modulo y exportamos las funciones para su utilizacion en los
 * otros archivos JS
 * Funcion para retornar fecha actual
 */
function getFecha() {
  let hoy = new Date();
  let fecha =
    hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
  let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
  let fechaActual = fecha + ' ' + hora;
  return fechaActual;
}
/**
 * Actualizacion de la fecha y la hora por la actual
 */
function updateFecha(userActual) {
  let fechaNow = getFecha();

  //Obtenemos cookie del usuario conectado
  let infoUsuario = Cookies.get(userActual);

  //convertimos para poder modificarlo
  let objUsuario = JSON.parse(infoUsuario);
  objUsuario.fechaEntrada = fechaNow;
  let stringUsuario = JSON.stringify(objUsuario);

  //Guardo de nuevo la cookie
  Cookies.set(userActual, stringUsuario, { expires: 7 });
}

//FUNCIONES RESPECTIVAS A LA COOKIE

/**
 * Envia los datos de la cookie del usuario que se le pase.
 * @param {String} userActual
 * @param {Number} tiempo
 * @returns {Promise} Promesa que devuelve los datos del usuario actual
 */
function getDatosCookie(userActual) {
    let tiempo = 50;
  return new Promise((resolv, reject) => {
    setTimeout(() => {
      let datosUsuario = JSON.parse(Cookies.get(userActual));
      resolv(datosUsuario);
    }, tiempo);

    setTimeout(() => {
      let error = new Error('Error al obtener datos de la cookie');
      reject(error);
    }, tiempo * 2);
  });
}
/**
 * funcion para realizar petición del los datos de la cookie
 * del usuario que está conectado
 */
function cargarPreguntas(delay = false, userActual, tiempo = 0) {
  return new Promise((resolv, reject) => {
    if (delay) {
      setTimeout(() => {
        let user = JSON.parse(Cookies.get(userActual));
        resolv(user);
      }, tiempo);

      setTimeout(() => {
        let error = 'No se ha podido cargar las preguntas';
        reject(error);
      }, tiempo * 2);
    } else {
      let user = JSON.parse(Cookies.get(userActual));
      resolv(user);
    }
  });
}

/**
 *
 * Guarda los datos en la cookie del usuario que se le pase por paramentro
 * @param {Object} objDatos Datos cookie modificados
 * @param {String} userActual Usuario al que se le modifica su informacion
 */
function guardarDatosEnCookie(objDatos, userActual) {
  let strPreguntas = JSON.stringify(objDatos);
  Cookies.set(userActual, strPreguntas, { expires: 7 });
}

/**
 * Guarda un usuario en una cookie junto con sus datos como son la fecha de acceso
 *  y sus preguntas
 * @param {Object} userSave Usuario que guardamos en la cookie
 * @param {*} datosUsuario Los datos de dicho usuario
 */
function saveUserCookie(userSave, datosUsuario) {
  let strDatosUsuario = JSON.stringify(datosUsuario);

  Cookies.set(userSave, strDatosUsuario, { expires: 5 });
  Cookies.set('userActual', userSave);
}

/**
 *  Establece cookie que indica el usuario que ha iniciado sesion
 *  @param {String} userActual Usuario actual
 */
function setUserActual(userActual) {
  Cookies.set('userActual', userActual);
}

/**
 *
 * @returns {String} Devuelve el correo del usuario actual
 */
function getuserActual() {
  return Cookies.get('userActual');
}

export {
  getFecha,
  updateFecha,
  getDatosCookie,
  guardarDatosEnCookie,
  saveUserCookie,
  setUserActual,
  getuserActual,
  cargarPreguntas,
};
