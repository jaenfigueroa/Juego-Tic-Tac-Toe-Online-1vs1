// const { json } = require('express')
const express = require('express')
const servidor = express()

//para que reconozca json
servidor.use(express.json())

//para administrar de donde recibir las solicitudes
const cors = require('cors')
servidor.use(cors())

//para generar id unicos
// const { v4: uuidv4 } = require('uuid')

/////////////////////////////////////////////////////////////
// let listaEspera = []
// let listaParejas = []

// class Jugador {
//   constructor(id, nombre, pieza) {
//     this.id = id
//     this.nombre = nombre
//     this.pieza = pieza
//   }
// }

//////////////////////////////////////////////////////////////
//REGISTRAR JUGADOR NUEVO/////////////////////////////////////
// servidor.post('/unirme/:nombre', (req, res) => {

//   let nombreJugador = req.params.nombre
//   let idJugador = uuidv4()

//   let jugadorNuevo = new Jugador(nombreJugador, idJugador)

//   listaEspera.push(jugadorNuevo)

//   if (listaEspera.length === 2) {

//     let contenido = {

//     }

//     res.send(true)
//   } else {
//     res.send(false)
//   }

// })

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
let jugadoresEspera = []

let jugadoresParejas = [
  [
    jugadores = [
      {
        "id": 11111,
        "nombre": 'Mario',
        "permiso": true
      },
      {
        "id": 22222,
        "nombre": 'Sofia',
        "permiso": false
      }
    ],
    tablero = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']
  ],
  [
    jugadores = [
      {
        "id": 33333,
        "nombre": 'Jaen',
        "permiso": true
      },
      {
        "id": 44444,
        "nombre": 'Ahini',
        "permiso": false
      }
    ],
    tablero = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']
  ]
]


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
///PARA RECIBIR TABLERO ACTUALIZADO//////////////////////////

servidor.post('/enviarTablero/:indiceUsuario/:indiceGrupo', (req, res) => {
  const indiceGrupo = req.params.indiceGrupo
  // const indiceUsuario = req.params.indiceUsuario
  const tableroActualizado = req.body.contenido

  let grupoPareja = jugadoresParejas[indiceGrupo]
  grupoPareja[1] = tableroActualizado //ono

  let jugador0 = grupoPareja[0][0]
  let jugador1 = grupoPareja[0][1]

  jugador0.permiso = !jugador0.permiso
  jugador1.permiso = !jugador1.permiso

  res.json({
    candado: [jugador0.permiso, jugador1.permiso]
  })
})


///PARA ENVIAR TABLERO ACTUALIZADO////////////////////////////
servidor.get('/traerTablero/:id/:indiceGrupo', (req, res) => {
  let indiceGrupo = req.params.indiceGrupo
  // let idUsuario = req.params.idUsuario

  const grupoPareja = jugadoresParejas[indiceGrupo][1]

  console.log(grupoPareja);
  console.log(typeof grupoPareja);

  res.json({
    array: grupoPareja
  })
})

/////////////////////////////////////////////////////////////
//ESPERAR TURNO//////////////////////////////////////////////
servidor.get('/esperarTurno/:indiceGrupo/', (req, res) => {
  const indiceGrupo = req.params.indiceGrupo

  let grupoPareja = jugadoresParejas[indiceGrupo]

  let jugador0 = grupoPareja[0][0]
  let jugador1 = grupoPareja[0][1]

  res.json({
    candado: [jugador0.permiso, jugador1.permiso],
    // tablero: jugadoresParejas[1][1]
  })

})

/////////////////////////////////////////////////////////////
const PUERTO = process.env.PORT || 3000

servidor.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto: ${PUERTO}`);
})