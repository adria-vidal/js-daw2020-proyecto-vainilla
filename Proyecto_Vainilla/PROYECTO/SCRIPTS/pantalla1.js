/**
 * Importamos funciones del documento exterior
 */
import {
  guardarUsuarioCookie,
  getFechaActual,
  setUsuarioActual,
} from './moduleCookieFecha.js';

/**
 * Al pulsar la combinación de teclas o al esperar 5s de manera asincrona(promesa)
 * aparecerá la pantalla de bienvenida para introducir los datos
 */
window.addEventListener('keyup', function (teclaf10) {
  if (teclaf10.altKey == true && teclaf10.key == 'F10') {
    mostrar();
  }
});

let promesa = new Promise((resolve, reject) => {
  resolve = setTimeout(mostrar, 5000);
});
promesa.then(() => {
  console.log('Fase 1 OK');
});

/**
 * Funcion para mostrar pa pantalla inicial para insertar email
 */
function mostrar() {
  document.body.style.backgroundColor = 'white';
  document.getElementById('form').style.visibility = 'visible';
  document.getElementById('header').style.visibility = 'hidden';
}

/*  asignamos el elemento 'email' a la variable */
let textoEmail = document.getElementById('email');

/** Comprobamos si el formato es correcto cuando perdemos el focus a través del evento */
textoEmail.addEventListener(
  'blur',
  (event) => {
    let pattemail = /\S+@\S+\.\S+/;

    /**
     * creamos un mensaje de error si el formato no es el correcto
     * y seleccionamos el texto del input
     */
    if (pattemail.test(event.target.value) == false) {
      let errorEmail = document.createElement('span');
      errorEmail.setAttribute('class', 'errorEmail');
      errorEmail.style.color = 'red';
      errorEmail.style.backgroundColor = 'black';
      //contenido del mensaje
      errorEmail.textContent = 'FORMATO INCORRECTO. DEBE SER aaaa@bbbb.ccc';

      textoEmail.select();

      event.target.parentNode.insertBefore(
        errorEmail,
        event.target.nextSibling
      );
      /**
       * si esta correcto el email, redireccionamos a la pantalla2
       * creamos y guardamos en la cookie el email del usuario
       */
    } else {
      if (!Cookies.get(textoEmail.value)) {
        let datosUser = {
          fechaIn: getFechaActual(),
          preguntas: [],
        };
        guardarUsuarioCookie(textoEmail.value, datosUser);

        var redirecciona = '../HTML/pantalla2.html';
        location.href = redirecciona;

        //en caso de que exista, solo modificamos añadiendo el email
      } else {
        setUsuarioActual(textoEmail.value);
        var redirecciona = '../HTML/pantalla2.html';
        location.href = redirecciona;
      }
    }
  },
  true
);

//evitamos la repetición del mensaje error
document.getElementById('email').addEventListener('focus', (event) => {
  let errorEmail = document.querySelector('.errorEmail');
  if (errorEmail) {
    errorEmail.parentNode.removeChild(errorEmail);
  }
});
