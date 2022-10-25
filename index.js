const express = require('express')
const servidor = express()

//para que reconozca json
servidor.use(express.json())

//para administrar de donde recibir las solicitudes
const cors = require('cors')
servidor.use(cors())

//para generar id unicos
const { v4: uuidv4 } = require('uuid')

//para que cuando se visite la pagina principal '/' muestre los archivos de public
servidor.use(express.static('public'))
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
let tableroDefault = ['', '', '', '', '', '', '', '', '']
let jugadoresEnEspera = []
let jugadoresConPareja = []

//////////////////////////////////////////////////////////////////////////////////////////////////
// REGISTRAR JUGADOR NUEVO////////////////////////////////////////////////////////////////////////
servidor.get('/registrarJugador/:nombreJugador', (req, res) => {
  //obtenemos el nombre del jugador nuevo
  let nombreJugador = req.params.nombreJugador
  //generamos un id unico
  let idNuevo = uuidv4()
  //obtenemos el indice del proximo array de la pareja
  let indiceNuevoGrupo = jugadoresConPareja.length


  console.log('nombre del jugador nuevo:', nombreJugador);
  console.log('id para el jugador nuevo:', idNuevo);

  //creamos el objeto con los datos del jugador nuevo
  let jugadorNuevo = {
    id: idNuevo,
    nombre: nombreJugador,
  }

  console.log('Objeto con los datos jugador nuevo:', jugadorNuevo);

  //agregar el jugador a la lista de espera
  jugadoresEnEspera.push(jugadorNuevo)

  console.log('array con los jugadores en espera', jugadoresEnEspera);

  //comprobar si ya hay 2 jugadores en espera 
  if (jugadoresEnEspera.length >= 2) {
    console.log(nombreJugador + ': es el segundo jugador');


    console.log('indice del grupo nuevo: ', jugadoresConPareja.length);

    //creamos un objeto con la nueva pareja
    let nuevaPareja = {
      jugadores: [
        jugadoresEnEspera[0],
        jugadoresEnEspera[1]
      ],
      tablero: tableroDefault
    }

    console.log('Array de la nueva pareja: ' + nuevaPareja);

    //agregar la nueva pareja al array de jugadores con pareja
    jugadoresConPareja.push(nuevaPareja)
    console.log('array de los jugadores con pareja: ', jugadoresConPareja);

    //remover los 2 jugadores del array de jugadores en espera
    jugadoresEnEspera.splice(0, 2)
    console.log('array de los jugadores en espera: ', jugadoresEnEspera);

    //responder con un mensaje al usuario
    res.json({
      mensaje: 'Usuario agregado al array de jugadores con pareja, junto a otro jugador',
      permiso: true,
      nombreJugador: nombreJugador,
      idJugador: idNuevo,
      indiceJugador: 1,
      indiceGrupo: indiceNuevoGrupo
    })
  } else {
    console.log(nombreJugador + ': es el primer jugador');
    //responder con un mensaje al usuario
    res.json({
      mensaje: 'Usuario agregado al array de jugadores en espera',
      permiso: false,
      nombreJugador: nombreJugador,
      idJugador: idNuevo,
      indiceJugador: 0,
      indiceGrupo: indiceNuevoGrupo
    })
  }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////
// VEREFICAR SI TIENE PAREJA/////////////////////////////////////////////////////////////////////////
servidor.post('/verificarPareja/', (req, res) => {

  let indiceGrupo = req.body.indiceGrupoLocal
  let indiceEnemigo = req.body.indiceEnemigoLocal

  //verificar que el grupo de pareja ya este incluido en el array de parejas
  if (jugadoresConPareja.length > indiceGrupo) {

    //obtener el nombre del enemigo
    let nombreEnemigo = jugadoresConPareja[indiceGrupo].jugadores[indiceEnemigo].nombre
    console.log(nombreEnemigo);

    res.json({
      mensaje: 'Ya tienes pareja',
      permiso: true,
      nombreEnemigo
    })
  } else {
    res.json({
      mensaje: 'Aun no tienes pareja',
      permiso: false
    })
  }

})

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
servidor.post('/enviarTablero/:idUsuario', (req, res) => {
  let indiceGrupo = req.body.indiceGrupoLocal
  let tableroActualizado = req.body.arrayTableroLocal

  // console.log('indice del grupo: ', indiceGrupo);
  // console.log('tablero actualizado: ', tableroActualizado);

  //actualizar el tablero del grupo
  jugadoresConPareja[indiceGrupo].tablero = tableroActualizado

  console.log('array de jugadores con pareja con el tablero actualizado: ', jugadoresConPareja);

  res.json({
    mensaje: 'tablero del backend actualizado con exito',
  })
})

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
servidor.post('/traerTablero/:idUsuario', (req, res) => {
  let indiceGrupo = req.body.indiceGrupoLocal
  console.log(indiceGrupo);

  // obtener el array actualizado
  let tableroActualizado = jugadoresConPareja[indiceGrupo].tablero

  console.log('tablero actualizado para enviar: ', tableroActualizado);

  res.json({
    mensaje: 'indice del grupo recibido',
    tableroActualizado
  })

})

/////////////////////////////////////////////////////////////////////////////////////////////////////
//COMPROBAR VICTORIA////////////////////////////////////////////////////////////////////////////////
function comprobarVictoria(t) {
  if (
    t[0] == t[1] && t[0] == t[2] ||
    t[3] == t[4] && t[3] == t[5] ||
    t[6] == t[7] && t[6] == t[8] ||
    t[0] == t[3] && t[0] == t[6] ||
    t[1] == t[4] && t[1] == t[7] ||
    t[2] == t[5] && t[2] == t[8] ||
    t[0] == t[4] && t[0] == t[8] ||
    t[6] == t[4] && t[6] == t[2]
  ) {
    console.log('hay ganador')
  } else {
    console.log('no hay ganador')
  }
}


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
const PUERTO = process.env.PORT || 3000

servidor.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto: ${PUERTO}`);
})


















/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
///PARA RECIBIR TABLERO ACTUALIZADO//////////////////////////

// servidor.post('/enviarTablero/:indiceUsuario/:indiceGrupo', (req, res) => {
//   const indiceGrupo = req.params.indiceGrupo
//   // const indiceUsuario = req.params.indiceUsuario
//   const tableroActualizado = req.body.contenido

//   let grupoPareja = jugadoresParejas[indiceGrupo]
//   grupoPareja[1] = tableroActualizado //ono

//   let jugador0 = grupoPareja[0][0]
//   let jugador1 = grupoPareja[0][1]

//   jugador0.permiso = !jugador0.permiso
//   jugador1.permiso = !jugador1.permiso

//   res.json({
//     candado: [jugador0.permiso, jugador1.permiso]
//   })
// })


///PARA ENVIAR TABLERO ACTUALIZADO////////////////////////////
// servidor.get('/traerTablero/:id/:indiceGrupo', (req, res) => {
//   let indiceGrupo = req.params.indiceGrupo
//   // let idUsuario = req.params.idUsuario

//   const grupoPareja = jugadoresParejas[indiceGrupo][1]

//   console.log(grupoPareja);
//   console.log(typeof grupoPareja);

//   res.json({
//     array: grupoPareja
//   })
// })

/////////////////////////////////////////////////////////////
//ESPERAR TURNO//////////////////////////////////////////////
// servidor.get('/esperarTurno/:indiceGrupo/', (req, res) => {
//   const indiceGrupo = req.params.indiceGrupo

//   let grupoPareja = jugadoresParejas[indiceGrupo]

//   let jugador0 = grupoPareja[0][0]
//   let jugador1 = grupoPareja[0][1]

//   res.json({
//     candado: [jugador0.permiso, jugador1.permiso],
//     // tablero: jugadoresParejas[1][1]
//   })

// })

