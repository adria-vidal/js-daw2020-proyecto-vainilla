/**
 *Modulo para crear la funciones necesarias para el proyecto
 * Funcion para retornar fecha actual
 */
function getFechaActual() {
  let hoy = new Date();
  let fecha =
    hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
  let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
  let fechaActual = fecha + ' ' + hora;
  return fechaActual;
}

/**
 *Actualizamos fecha y hora cuando entre el usuario
 */
function updateFecha(usuarioActual) {
  let fechaAhora = getFechaActual();

  /** Obtenemos la cookie del usuario */
  let infoUsuario = Cookies.get(usuarioActual);
  /** operaciones con JSON para poder modificar */
  let objUsuario = JSON.parse(infoUsuario);
  objUsuario.fechaEntrada = fechaAhora;
  let strUsuario = JSON.stringify(objUsuario);

  /** Guardamos cookie */
  Cookies.set(usuarioActual, strUsuario, { expires: 7 });
}

//FUNCIONES RESPECTIVAS A LA COOKIE

/** Obtenemos los datos de la cookie del usuario */
function getDatosCookie(usuarioActual, tiempo = 0) {
  return new Promise((resolv, reject) => {
    setTimeout(() => {
      let datosUsuario = JSON.parse(Cookies.get(usuarioActual));
      resolv(datosUsuario);
    }, tiempo);

    setTimeout(() => {
      let error = new Error('Error al obtener datos de la cookie');
      reject(error);
    }, tiempo * 2);
  });
}

/**
 * Guardamos datos en la cookie del usuario atual
 * @param {Object} objDatos Datos cookie modificados
 * @param {String} usuarioActual Usuario que modificamos la info
 */
function saveDatosCookie(objDatos, usuarioActual) {
  let strPreguntas = JSON.stringify(objDatos);
  Cookies.set(usuarioActual, strPreguntas, { expires: 7 });
}

/**
 * Funcion para guardar el usuario y sus datos en la cookie
 * @param {Object} usuarioAGuardar Usuario que guardamos en cookie
 * @param {*} datosUsuario datos del usuario
 */
function guardarUsuarioCookie(usuarioAGuardar, datosUsuario) {
  let strDatosUsuario = JSON.stringify(datosUsuario);

  Cookies.set(usuarioAGuardar, strDatosUsuario, { expires: 7 });
  Cookies.set('usuarioActual', usuarioAGuardar);
}

/**
 *  Establece una cookie que indica en todo momento cual es el usuario que ha iniciado sesion
 *  @param {String} usuarioActual Usuario que esta acutualmente
 */
function setUsuarioActual(usuarioActual) {
  Cookies.set('usuarioActual', usuarioActual);
}

/**
 *
 * @returns {String} Devuelve el correo del usuario actual
 */
function getUsuarioActual() {
  return Cookies.get('usuarioActual');
}

/**
 *
 * Funcion para realizar peticion a la cookie para que devuelva los datos guardados
 *  @param {Boolean} delay tiempo de delay
 */
function cargarPreguntas(delay = false, tiempo = 0, usuarioActual) {
  return new Promise((resolv, reject) => {
    if (delay) {
      setTimeout(() => {
        let usuario = JSON.parse(Cookies.get(usuarioActual));
        resolv(usuario);
      }, tiempo);

      setTimeout(() => {
        let mensaje = 'Error';
        reject(mensaje);
      }, tiempo * 2);
    } else {
      let usuario = JSON.parse(Cookies.get(usuarioActual));
      resolv(usuario);
    }
  });
}

export {
  getDatosCookie,
  saveDatosCookie,
  guardarUsuarioCookie,
  setUsuarioActual,
  getUsuarioActual,
  cargarPreguntas,
  updateFecha,
  getFechaActual,
};
