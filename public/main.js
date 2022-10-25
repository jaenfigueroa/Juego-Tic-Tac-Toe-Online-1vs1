// const DOMINIO = 'http://localhost:3000'
const DOMINIO = 'https://tic-tac-toe-jaenfigueroa.herokuapp.com'
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

//NUEVO
let nombreGanador
//OTRO
let permisoDeContinuar
//ESCUCHADOR DE EVENTO DE EMPEZAR JUEGO/////////////////////////
botonJugar.addEventListener('click', jugar)

function jugar() {
  nombreJugadorLocal = inputName.value
  console.log('el nombre obtenido del input es: ', nombreJugadorLocal);

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

  let url = `${DOMINIO}/registrarJugador/${nombreJugadorLocal}`

  fetch(url)
    .then((res) => {
      if (res.ok) {
        res.json().then(({ mensaje, nombreJugador, idJugador, indiceJugador, indiceGrupo, permiso }) => {
          //mostrar mensaje
          console.log(mensaje);

          //asignar y rellenar los valores llegados del backend en local
          nombreJugadorLocal = nombreJugadorLocal
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



/// 1. ENVIAR EL ARRAY NUEVO AL ENEMIGO // COMPLETADO
/// 2. TRAER EL TABLERO ACTUALIZADO DEL BACKEND // COMPLETADO
/// 3. RENDERIZAR EL ARRAY DEL TABLERO QUE LLEGA Y ACTIVAR TURNO DEL OTRO JUGADOR // COMPLETADO


//ENVIAR TABLERO ACTUALIZADO////////////////////////////////////
function enviarTableroActualizado() {
  console.log('se envio el nuevo array/tablero al servidor');

  let url = `${DOMINIO}/enviarTablero/${idJugadorLocal}`
  let contenido = {
    indiceGrupoLocal,
    arrayTableroLocal,
    nombreJugadorLocal
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
        res.json().then(({ mensaje, hayGanador }) => {

          console.log(mensaje);


          //antes de volver a pedir el tablero actualizado , comprobar si gano o no ESTOY AQUIIIIIIIIIIIIIIIIIIII
          if (hayGanador[0] == true) {
            obtenerGanadorPerdedor(hayGanador) ////////////AQUI ESTOYYYYYYYYYYYYYYY

            console.log('ARRAY DEL GANADOR QUE LLEGA DEL BACK: ', hayGanador);
          } else {
            //despues de enviar el tablero se bloquea y empieza a pedir el tablero actualizado
            traerTableroActualizado()
          }

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
        res.json().then(({ mensaje, tableroActualizado, hayGanador }) => {

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

            //verificar si hay o no ganador y saccar los nombres si hay
            if (hayGanador[0] == true) {
              obtenerGanadorPerdedor(hayGanador) ////////////QUI ESTOYYYYYYYYYYYYYYY
            }
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

  //desbloquear cajas vacias
  desbloquearCajasVacias()
}

//DESBLOQUEAR SOLO LAS CAJAS SIN CONTENIDO/ARMAS//////////////////////////////////
function desbloquearCajasVacias() {
  let todasLasCajas = contenedorCajas.querySelectorAll('.caja')

  todasLasCajas.forEach(caja => {
    if (caja.textContent == '') {

      caja.disabled = false
    }

  });
}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/// TAREAS PENDIENTES

///1. COMPROBAR QUIEN GANO
///2. MOSTRAR EL AVISO DE QUE GANO O PERDIO


// MOSTRAR MENSAJE DEL GANADOR Y/O PERDEDOR/////////////////////////////////
const aviso1 = document.querySelector('#aviso1')
const aviso2 = document.querySelector('#aviso2')

const seccion3 = document.querySelector('#seccion3')

//OBTENER NOMBRES DEL GANADOR Y PERDEDOR
function obtenerGanadorPerdedor(hayGanador) {
  console.log('entro en la funcion de obtener ganador o perdedor');
  console.log(hayGanador);

  let texto1
  let texto2
  let colorAviso

  //obtener los nombre del ganador y perdeor y formar los textos
  if (hayGanador[0]) {
    if (nombreJugadorLocal == hayGanador[1]) {

      console.log('asignar nombres a las variables de gaandor y perdedor');
      nombreGanador = nombreJugadorLocal
      nombrePerdedor = nombreEnemigoLocal

      console.log('asignar los textos de ganaste, el orto juagdor perdio y color');
      //mostrar AVISO de visctoria o derrota
      texto1 = `⭐GANASTE⭐`
      texto2 = `${nombrePerdedor} perdio el juego`
      colorAviso = 'amarillo'

    } else {
      nombreGanador = nombreEnemigoLocal
      nombrePerdedor = nombreJugadorLocal

      //mostrar AVISO de visctoria o derrota
      texto1 = `🥺PERDISTE🥺`
      texto2 = `${nombreGanador} gano el juego`
      colorAviso = 'celeste'
    }


    console.log('se se agrego blur a la seccion2 y se mostro la seccion3');
    //CAMBIAR LAS PANTALLAS (MOSTRAR LA SECCION3 FINAL)
    seccion2.classList.add('efecto-blur')
    // seccion2.classList.toggle('desactivado')
    seccion3.classList.remove('desactivado')

    //PONER EL COLOR AMARILLO O CELESTE AL AVISO
    aviso1.classList.add('colorAviso')

    //rendecizar los textos en pantalla
    aviso1.textContent = texto1
    aviso2.textContent = texto2
  }

}


///VOLVER A JUGAR/////////////////////////////////////////
const botonVolverAJugar = document.querySelector('#volverAJugar')
botonVolverAJugar.addEventListener('click', volverAJugar)

function volverAJugar() {
  location.reload()
}