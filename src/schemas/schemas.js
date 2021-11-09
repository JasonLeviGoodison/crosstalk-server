var mongoose = require('mongoose')

exports.Room = {
  _id: mongoose.Schema.Types.ObjectId,
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  deleted: {
    required: true,
    default: false,
    type: Boolean
  },
  spanishSpeakers: Number,
  englishSpeakers: Number,
  zoomLink: String
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
