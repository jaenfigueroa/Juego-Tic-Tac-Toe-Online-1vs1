const DOMINIO = 'http://localhost:3000'
/////////////////////////////////////////////////////////////////////////////
const seccion1 = document.querySelector('#seccion1')
const seccion2 = document.querySelector('#seccion2')

const inputName = document.querySelector('#inputName')
const botonJugar = document.querySelector('#botonJugar')
////////////////////////////////////////////////////////////////////////////
const jugador = document.querySelector('#jugador')
const enemigo = document.querySelector('#enemigo')

const armaJugador = document.querySelector('#armaJugador')
const armaEnemigo = document.querySelector('#armaEnemigo')

const contenedorCajas = document.querySelector('#contenedorCajas')
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
let nombreJugadorLocal // COMPLETADO
let nombreEnemigoLocal // COMPLETADO 

let idJugadorLocal //COMPLETADO

let indiceJugadorLocal // COMPLETADO
let indiceEnemigoLocal // CMPLETADO

let indiceGrupoLocal // COMPLETADO

let empezarPrimero

let armaJugadorValor
let armaEnemigoValor

let arrayTableroLocal = ['', '', '', '', '', '', '', '', '']

//OTRO
let permisoDeContinuar
//ESCUCHADOR DE EVENTO DE EMPEZAR JUEGO/////////////////////////
botonJugar.addEventListener('click', jugar)

function jugar() {
  nombreJugador = inputName.value
  console.log('el nombre obtenido del input es: ', nombreJugador);

  registrarNuevoUsuario()

  setTimeout(() => {
    //cambiar pantalla
    cambiarPantalla()

    //mostrar en pantalla con los valores recibidos
    jugador.textContent = nombreJugadorLocal

    if (indiceJugadorLocal === 0) {
      armaJugadorValor = 'X'
      armaEnemigoValor = 'O'
    } else {
      armaJugadorValor = 'O'
      armaEnemigoValor = 'X'
    }

    armaJugador.textContent = armaJugadorValor
    armaEnemigo.textContent = armaEnemigoValor
  }, 500);


}

//REGISTRAR NUEVO USUARIO///////////////////////////////////////
function registrarNuevoUsuario() {

  let url = `${DOMINIO}/registrarJugador/${nombreJugador}`

  fetch(url)
    .then((res) => {
      if (res.ok) {
        res.json().then(({ mensaje, nombreJugador, idJugador, indiceJugador, indiceGrupo, permiso }) => {
          //mostrar mensaje
          console.log(mensaje);

          //asignar y rellenar los valores llegados del backend en local
          nombreJugadorLocal = nombreJugador
          idJugadorLocal = idJugador
          indiceJugadorLocal = indiceJugador
          indiceGrupoLocal = indiceGrupo

          //asignar el "indice del enemigo local y el permiso de empezar primero" a partir del indice del jugador
          if (indiceJugadorLocal == 0) {
            indiceEnemigoLocal = 1
            empezarPrimero = true
          } else {
            indiceEnemigoLocal = 0
            empezarPrimero = false
          }

          verificarPareja()
        })
      }
    })

}

// CAMBIAR DE PANTALLA/////////////////////////////////////////////
function cambiarPantalla() {
  console.log('se cambio de pantalla/seccion');

  seccion1.classList.toggle('desactivado')
  seccion2.classList.toggle('desactivado')
}

//OBTENER EL NOMBRE DEL OTRO USUARIO Y EL TABLERO
function verificarPareja() {
  let url = `${DOMINIO}/verificarPareja/`
  let empaque = {
    indiceGrupoLocal,
    indiceEnemigoLocal
  }

  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(empaque), // los datos pueden ser `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (res.ok) {
        res.json().then(({ mensaje, permiso, nombreEnemigo }) => {

          //verificar si se puso obtener el nombre del enemigo
          if (permiso) {
            //guardar el nombre del enemigo y asignarlo al html
            nombreEnemigoLocal = nombreEnemigo
            enemigo.textContent = nombreEnemigoLocal

            //bloquear el tablero si el usuario tiene el id 1
            if (indiceJugadorLocal == 1) {
              bloquearTablero(true)

              //empezo con el tablero bloqueado, asi que empieza a pedir el tablero actualizado
              traerTableroActualizado()

            } else {
              bloquearTablero(false)
            }
          } else {
            verificarPareja()
          }

        })
      }
    })
}


function bloquearTablero(valor) {
  console.log(`se ${valor ? 'desactivo' : 'activo'} las cajas del jugador`);

  let todasLasCajas = document.querySelectorAll('.caja')
  console.log('las cajas', todasLasCajas);

  todasLasCajas.forEach(caja => {

    //dependiendo de su id se bloqueara o no las cajas al incicio del juego
    caja.disabled = valor

    //agregarle un addevenlistener para que agrege el arma
    caja.addEventListener('click', () => {
      caja.textContent = armaJugadorValor

      //bloquear las cajas inmediatamente despues de poner la ficha/arma 
      bloquearTablero(true)

      //obtener el tablero actualizado del html
      arrayTableroLocal = obtenerTableroNuevoDelHTML() // 

      //enviar el tablero actualizado
      enviarTableroActualizado()


    })

  });
}

//OBTENER EL ARRAY/TABLERO NUEVO DEL HTML////////////////////////////////////////////////
function obtenerTableroNuevoDelHTML() {
  console.log('se obtuvo las piezas del html');

  const todasLasCajas = document.querySelectorAll('.caja')

  let tableroActualizado = []

  todasLasCajas.forEach(caja => {
    tableroActualizado.push(caja.textContent)
  });

  return tableroActualizado
}



/// 1. ENVIAR EL ARRAY NUEVO AL ENEMIGO // LISTO
/// 2. TTAER EL TABLERO ACTUALIZADO DEL BACKEND // LISTO
/// 3. RENDERIZAR EL ARRAY DEL TABLERO QUE LLEGA Y ACTIVAR TURNO DEL OTRO JUGADOR // LISTO

//ENVIAR TABLERO ACTUALIZADO////////////////////////////////////
function enviarTableroActualizado() {
  console.log('se envio el nuevo array/tablero al servidor');

  let url = `${DOMINIO}/enviarTablero/${idJugadorLocal}`
  let contenido = {
    indiceGrupoLocal,
    arrayTableroLocal
  }

  fetch(url, {
    method: 'POST', // o 'PUT'
    body: JSON.stringify(contenido), // los datos pueden ser un`string` o {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (res.ok) {
        res.json().then(({ mensaje }) => {

          console.log(mensaje);

          //despues de enviar el tablero se bloquea y empieza a pedir el tablero actualizado
          traerTableroActualizado()

        })
      }
    })
}


//TRAER TABLERO ACTUALIZADO////////////////////////////////////////////////////////////////////
function traerTableroActualizado() {
  console.log('llego el arra/tablero actualizado del backend');

  let url = `${DOMINIO}/traerTablero/${idJugadorLocal}`
  let contenido = {
    indiceGrupoLocal
  }

  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(contenido), // los datos pueden ser `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (res.ok) {
        res.json().then(({ mensaje, tableroActualizado }) => {

          console.log("Respuesta del servidor:", mensaje);

          if (JSON.stringify(arrayTableroLocal) == JSON.stringify(tableroActualizado)) {
            console.log('el tablero que llego es IGUAL al que ya tenemos en local');

            //como es tablero que llego es igual al tablero local, entonces volvemos a pedir el tablero al backend
            setTimeout(() => {
              traerTableroActualizado()
            }, 1000);

          } else {
            console.log('el tablero que llego es DIFERENTE al que ya tenemos en local');

            //actualizar el tablero/array local y renderizar las nuevas piezas en el tablero
            arrayTableroLocal = tableroActualizado
            renderizarPiezas(arrayTableroLocal)
          }
        })
      }
    })
}


//RENDERIZAR EL ARRAY DEL TABLERO QUE LLEGA/////////////////////////////////////////
function renderizarPiezas(arrayTablero) {
  // console.log(array);
  const todasLasCajas = document.querySelectorAll('.caja')

  let contador = 0

  todasLasCajas.forEach(caja => {
    // console.log(caja);
    caja.textContent = arrayTablero[contador]
    contador++
  });

  console.log('se renderizo las piezas del tablero actualizado');

  //desbloquear tablero
  bloquearTablero(false)
}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////









////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// function esperarTurno() {
//   console.log('esperando turno');

//   let url = `${DOMINIO}/esperarTurno/${indiceGrupo}`

//   fetch(url)
//     .then((res) => {
//       if (res.ok) {
//         res.json().then(({ candado }) => {

//           // console.log('se supone que se acaba de recibir los candados');

//           candadoIndividual = candado[indiceJugador]

//           if (candadoIndividual) {
//             console.log('PUEDE PRESIONAR');

//             desactivarCajas(false)
//             traerTableroActualizado()

//           } else {
//             console.log('NO PUEDE PRESIONAR');

//             esperarTurno()
//           }

//         })
//       }
//     })
// }



