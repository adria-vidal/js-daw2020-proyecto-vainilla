/** Importamos funciones de modulo exterior */
import { getDatosCookie, getUsuarioActual } from "./moduleCookieFecha.js";

/**
 * Funcion para mostrar un saludo con el correo
 * que se ha insertado en la página anterior
 * y la fecha de la utima vez que entro el usuario
 */
function intro() {
  let container = document.getElementById("body2");
  //creamos elementos
  let saludo = document.createElement("h3");
  let parr = document.createElement("p");

  //añadimos estilos/atributos
  saludo.setAttribute("id", "saludo");
  parr.setAttribute("id", "fecha");
  saludo.style.margin = "10px";
  parr.style.margin = "10px";

  let saludocookie = getUsuarioActual();
  saludo.textContent = `Hola ${saludocookie}`;

  //Obtengo los datos del usuario
  let promesa = getDatosCookie(saludocookie);
  //Fecha de la ultima vez que entra el usuario
  promesa.then((datosFecha) => {
    let fechaIn = datosFecha.fechaIn;
    parr.textContent = `Sesión última vez: ${fechaIn}`;
  });

  //-agregamos los elementos al container para mostrar por pantalla
  container.appendChild(saludo);
  container.appendChild(parr);
}

intro();
