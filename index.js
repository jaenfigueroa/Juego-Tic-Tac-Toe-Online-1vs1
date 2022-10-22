const express = require('express')
const servidor = express()

//para que reconozca json
servidor.use(express.json())

//para administrar de donde recibir las solicitudes
const cors = require('cors')
servidor.use(cors())

//para generar id unicos
const { v4: uuidv4 } = require('uuid')

/////////////////////////////////////////////////////////////
// class Jugador {
//   constructor(id, nombre) {
//     this.id = id
//     this.nombre = nombre
//   }
// }

// class Pareja {
//   constructor(jugador1, jugador2, indexGrupo, tablero) {
//     this.jugador1 = jugador1
//     this.jugador2 = jugador2
//     this.indexGrupo = indexGrupo
//     this.tablero = tablero
//   }
// }
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
let tablero = ['', '', '', '', '', '', '', '', '']
let jugadoresEnEspera = []
let jugadoresConPareja = []

// REGISTRAR JUGADOR NUEVO/////////////////////////////////////
servidor.get('/unirme/:nombre', (req, res) => {

  let id = uuidv4()
  let nombre = req.params.nombre

  // let jugadorNuevo = new Jugador(id, nombre)

  let jugadorNuevo = [
    id,
    nombre
  ]

  console.log('jugador nuveo', jugadorNuevo);
  //agregar el jugador a la lista de espera
  jugadoresEnEspera.push(jugadorNuevo)

  console.log('Jugador agregado a la lista de espera');
  console.log(jugadoresEnEspera);

  if (jugadoresEnEspera.length >= 2) {

    let indexGrupo = jugadoresConPareja.length

    let nuevaPareja = [
      [
        jugadoresEnEspera[0],
        jugadoresEnEspera[1]
      ],
      indexGrupo,
      tablero
    ]

    jugadoresConPareja.push(nuevaPareja)
    jugadoresEnEspera = []
  }

  console.log(jugadoresConPareja);

  res.json({
    mensaje: 'usuario agregado con exito',
    id
  })
})

// VEREFICAR SI TIENE PAREJA////////////////////////////////
servidor.post('/verificarPareja/:id', (req, res) => {
  let id = req.params.id

  console.log('indice que llega', id);

  console.log('vista previa', jugadoresConPareja);

  if (jugadoresConPareja.length > 0) {

    let indiceDelGrupo = buscarindexGrupo(jugadoresConPareja, id)

    console.log('inidce del grupo', indiceDelGrupo);

    if (indiceDelGrupo !== -1) {

      res.json({
        seEncontro: true,
        indiceDelGrupo,
        indexJugador: 10000,
        arrayCompleto: 20000,
      })
    } else {
      res.json({
        seEncontro: false
      })
    }

  } else {
    res.json({
      seEncontro: false
    })
  }

})


/////////////////////////////////////////////////////////////
function buscarindexGrupo(array, id) {

  for (let x = 0; x < array.length; x++) {

    for (let y = 0; y < 2; y++) {

      for (let z = 0; z < 2; z++) {

        if (array[x][y][z][0] == id) {
          console.log('se encontro el index del grupo es: ' + x);
          return x
        }

      }
    }
  }
  return -1
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

