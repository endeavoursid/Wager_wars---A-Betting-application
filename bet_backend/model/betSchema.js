const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true, 
  },
  senderResponse: {
    type: String,
    required: true, 
  },
  senderNumber:{
    type: Number,
    required: true,
  },
  receiverName: {
    type: String,
    required: true, 
  },
  receiverResponse: {
    type: String,
    required: false, 
  },
  receiverNumber: {
    type: Number,
    required: true,
  },
  criteria: {
    type: String,
    required: true, 
  },
  resolDate: {
    type: String,
    required: true, 
  },
  wager: {
    type: String,
    required: true, 
  },
  status: {
    type: String,
    required: true,
  },
  senderFinalResp:{
    type: String,
    required: true,
  },
  receiverFinalResp:{
    type: String,
    required: true,
  },
  senderWager:{
    type:String
  },
  receiverWager:{
    type:String
  }
});

module.exports = mongoose.model('Bet', betSchema);
