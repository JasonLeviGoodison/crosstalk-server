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

    socket.on('set userId', (userId) => {
      console.log("I'm getting informed of this sockets userId", userId);
      socket.userId = userId;
      console.log("saved, now updated client");
      socket.emit('ready userId');
    })

    socket.on('join-room', (roomId, userId) => {
      console.log("someone joined room", roomId)
      socket.roomId = roomId;
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('user-connected', userId)

      socket.on('disconnect', () => {
        console.log("Disconnect")
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
        console.log("UserId", socket.userId, "disconnected" );
        console.log("Going to remove", socket.userId, " from ", socket.roomId)
        roomsTable.removeUserFromRoom(socket.userId, socket.roomId);
      });

      socket.on('mic set', value => {
        console.log("got a mic request", value)
        socket.broadcast.to(roomId).emit('mic set', value);
      })
    })
  })

  server.listen(3000);


});
