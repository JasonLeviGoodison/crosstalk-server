const express = require('express');
const router = express.Router();


function init(usersTable) {
  router.post('/createNewEphemeralAccount', async (req, res) => {
    console.log("going to create user")
    let result = await usersTable.createNewEphemeralAccount();
    console.log("Created new ephem user", result)

    res.send(result);
  });

  // router.post('/deleteall', async (req, res) => {
  //   res.send(await usersTable.deleteAllUsers())
  // })

  return router;
}


module.exports = init;
