var mongoose = require('mongoose')

exports.Room = {
  _id: mongoose.Schema.Types.ObjectId,
  creatorId: String,
  numberInRoom: Number,
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  language1: String,
  language2: String,
  userId1: String,
  userId2: String,
  deleted: {
    required: true,
    default: false,
    type: Boolean
  }
}

exports.User = {
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  isEmphemeral: {
    isRequired: true,
    default: true,
    type: Boolean
  },
  created: {
    type: Date,
    isRequired: true,
    default: Date.now
  },
  native: String,
  learning: String
}
