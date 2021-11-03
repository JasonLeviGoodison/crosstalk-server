var mongoose = require('mongoose')

class RoomsTable {
  constructor(dbRoom) {
    this.dbRoom = dbRoom;
  }

  async getAllRooms() {
    console.log("Something")
    let roomsFromDb = await dbRoom.find()
    console.log("Something2", roomsFromDb)
    return roomsFromDb;
  }

  async getJoinableRoom(userId, language) {
                                                                      // OR NULL OR SOMETHING
    let roomsFromDb = await this.dbRoom.find({"language2" : language, "userId2": "$null", "numberInRoom": {"$eq": 1 }});
    console.log("RoomsFromDb with language and 1 person in them", language,  roomsFromDb)
    console.log("here0", roomsFromDb)
    if (roomsFromDb.length == 0) {
      roomsFromDb = await this.dbRoom.find({ "language1": language, "userId1": "$null", numberInRoom: {"$eq": 1 } });
    }
    console.log("here1", roomsFromDb)

    if (roomsFromDb.length == 0) {
      roomsFromDb = [await this.createNewRoom(userId, language)];
    }

    console.log("here2", roomsFromDb)

    // should always have at least 1 thing in list (make random so 2 people joining dont get the same room?)
    var roomToJoin = roomsFromDb[0];

     // (maybe if that returns null we search on the second user ? or check first userId is null)
    return roomToJoin;
  }

  async createNewRoom(userId, language) {
    let result = await this.dbRoom({
      language1: language,
      numberInRoom: 1,
      creatorId: userId,
      userId1: userId,
      _id: new mongoose.Types.ObjectId()
    })

    console.log("result from create new room", result)
    return result;
  }

  async joinRoom(roomId, userId, language) {
    let room = await this.dbRoom.findOne({_id: roomId});
    if (room.language1 != null) {
      room.language2 = language;
      room.userId2 = userId;
    } else {
      room.language1 = language;
      room.userId1 = userId;
    }
    room.numberInRoom += 1;
    await room.save();
    console.log("Room looks like after joining", room)
    return room;
  }
}

module.exports = RoomsTable;
