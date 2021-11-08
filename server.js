const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
require('dotenv').config()
const roomsWithRouterInit = require('./src/apis/rooms');
const usersWithRouterInit = require('./src/apis/users');
const cors = require('cors');

var mongoose = require('mongoose')
var schemas = require('./src/schemas/schemas')

var RoomsTable = require("./src/dbOperations/rooms");
var UsersTable = require("./src/dbOperations/users");

var MONGO_URL = process.env.MONGO_URL
MONGO_URL = `${MONGO_URL}`

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
    res.send("I'm alive");
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

  var port = process.env.PORT
  server.listen(port);


});
