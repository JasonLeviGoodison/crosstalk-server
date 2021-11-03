var mongoose = require('mongoose')

class UsersTable {
  constructor(dbUser) {
    this.dbUser = dbUser;
  }

  async getNumberOfUsers() {
    let usersInDb = await dbUser.find()

    console.log("All users make: ", usersInDb.length)
    return usersInDb.length;
  }

  async createNewEphemeralAccount() {
    let result = new dbUser({
      _id: new mongoose.Types.ObjectId()
    });

    await result.save();

    console.log("result from create new room", result)
    return result;
  }

  async deleteAllUsers() {
    this.dbUser.deleteMany({}, () => {})
  }
}

module.exports = UsersTable;
