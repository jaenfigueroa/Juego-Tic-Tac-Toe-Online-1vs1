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
    {
      "id": 11111,
      "nombre": 'Jaen'
    },
    {
      "id": 22222,
      "nombre": 'Ahini'
    }
  ],
  [
    {
      "id": 33333,
      "nombre": 'Jose'
    },
    {
      "id": 44444,
      "nombre": 'Sofia'
    }
  ]
]

/////////////////////////////////////////////////////////////
///PARA RECIBIR TABLERO ACTUALIZADO//////////////////////////
let contenidoActualizado = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']

servidor.post('/enviarTablero/:id', (req, res) => {

  contenidoActualizado = req.body.contenido

  res.json({
    candado: true
  })
})

///PARA ENVIAR TABLERO ACTUALIZADO////////////////////////////
servidor.get('/traerTablero/:id', (req, res) => {

  res.json({ contenido: contenidoActualizado })
})


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
const PUERTO = 3000

servidor.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto: ${PUERTO}`);
})