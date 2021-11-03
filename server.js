const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const roomsWithRouterInit = require('./src/apis/rooms');
const usersWithRouterInit = require('./src/apis/users');
const cors = require('cors');

var mongoose = require('mongoose')
var schemas = require('./src/schemas/schemas')

var RoomsTable = require("./src/dbOperations/rooms");
var UsersTable = require("./src/dbOperations/users");

const MONGODB_DB = "crosstalk"
var MONGO_URL = "mongodb://127.0.0.1:27017"
MONGO_URL = `${MONGO_URL}/${MONGODB_DB}?retryWrites=true&w=majority`

mongoose.connect(MONGO_URL).then(db => {

  roomSchema = mongoose.Schema(schemas.Room);
  userSchema = mongoose.Schema(schemas.User);
  dbRoom = mongoose.model('rooms', roomSchema);
  dbUser = mongoose.model('users', userSchema);

  var roomsTable = new RoomsTable(dbRoom);
  var usersTable = new UsersTable(dbUser);

  app.use(cors())

  app.use('/rooms', roomsWithRouterInit(roomsTable))
  app.use('/users', usersWithRouterInit(usersTable))

  app.set('view engine', 'ejs')
  app.use(express.static('public'))

  app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
  });

  app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
  });

  io.on('connection', socket => {
    console.log("New connection")

    socket.on('join-room', (roomId, userId) => {
      console.log("someone joined the room")
      socket.join(roomId)
      console.log("someone joined room", roomId)
      socket.broadcast.to(roomId).emit('user-connected', userId)

      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
      });
    })
  })

  server.listen(3000);


});
