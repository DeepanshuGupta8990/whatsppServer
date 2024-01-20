const mongoose = require("mongoose");

const messaageSchema = mongoose.Schema({
  message: {
    text: {
      type: String,
      required: true,
    },
  },
  users: Array,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
},
  {
    timeStamp: true
  }
)

module.exports = mongoose.model('Messages', messaageSchema);