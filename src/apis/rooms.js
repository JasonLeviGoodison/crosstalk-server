const express = require('express');
const router = express.Router();
var mongoose = require('mongoose')

function init(roomsTable) {

  router.get('/all', async (req, res) => {
    return res.send(await roomsTable.getAllRooms())
  });

  router.get('/getAllJoinableRooms', async (req, res) => {
    //return res.send(await roomsTable.getAllJoinableRoom());
  });

  router.get('/getJoinableRoom', async (req, res) => {
    const {
      learning,
      native,
      userId
    } = req.query;

    let room = await roomsTable.getJoinableRoom(userId, native, learning);

    if (room === null) {
      console.log("No rooms available, going to send you a random id")
      return res.send({ roomId: mongoose.Types.ObjectId() })
    }

    return res.send({ roomId: room._id });
  });

  return router;
}


module.exports = init;
