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

  async getJoinableRoom(userId, native, language) {
    var roomToJoin = null;
    let roomsFromDb = await this.dbRoom.find({"language1": language, "language2" : native, "userId2": null, "numberInRoom": {"$eq": 1 }, "deleted": false});
    console.log("RoomsFromDb with language and 1 person in them", language,  roomsFromDb)
    console.log("here0", roomsFromDb)
    if (roomsFromDb.length == 0) {
      roomsFromDb = await this.dbRoom.find({"language2": language, "language1" : native, "userId1": null, "numberInRoom": {"$eq": 1 }, "deleted": false});
    }
    console.log("here1", roomsFromDb)

    if (roomsFromDb.length == 0) {
      //roomsFromDb = [await this.createNewRoom(userId, native, language)];
      return null;
    } else {
      //roomsFromDb [await this.joinRoom(roomsFromDb[0], userId, native)];
    }

    console.log("here2", roomsFromDb)

    roomToJoin = roomsFromDb[0];

    return roomToJoin;
  }

  async createOrJoinRoom(roomId, userId, native, learning) {
    var room = await this.dbRoom.findById(roomId);
    if (room === null) {
      console.log("That room doesnt exist, creating a new one")
      room = await this.createNewRoom(roomId, userId, native, learning)
      console.log("room created, roomid", room._id)
      return room._id.toString()
    }
    console.log("That room does exist, joining it");
    if (room.numberInRoom > 1) throw "Can't join room, someone took your spot. Please go back to homepage"
    room = await this.joinRoom(room, userId, native);
    console.log("room joined, roomid", room._id)
    return room._id.toString();
  }

  async createNewRoom(roomId, userId, native, language) {
    let result = await this.dbRoom({
      language1: native,
      language2: language,
      numberInRoom: 1,
      creatorId: userId,
      userId1: userId,
      deleted: false, 
      _id: roomId
    })

    await result.save()

    console.log("result from create new room", result)
    return result;
  }

  async joinRoom(room, userId, language) {
    console.log("UserId going to join room", userId, room._id);
    if (room.userId1 != null) {
      room.language2 = language;
      room.userId2 = userId;
    } else {
      room.language1 = language;
      room.userId1 = userId;
    }
    room.numberInRoom = 1 + room.numberInRoom;
    await room.save();
    console.log("Room looks like after joining", room)
    return room;
  }

  async removeUserFromRoom(userId, roomId) {
    var room = await this.dbRoom.findById(roomId);
    console.log("going to check if" , userId, "is in ", roomId)
    console.log(room)
    console.log("is", room.userId1, " the same as ", userId)
    console.log("is", room.userId2, " the same as ", userId)
    if (room.userId1 === userId) {
      room.userId1 = null;
    }
    else if (room.userId2 === userId) {
      room.userId2 = null;
    }
    else {
      console.error("Somehow I am trying to remove a user from a room they arent in");
      throw "Error";
    }
    console.log("Dealing with number in room", room.numberInRoom)
    if (room.numberInRoom === 1) {
      room.deleted = true;
    }
    else {
      room.numberInRoom = 1;
    }

    room.save();
    return;
  }
}

module.exports = RoomsTable;
