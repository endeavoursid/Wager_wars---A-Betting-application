const Bet = require('../model/betSchema');
const User=require("../model/userModel")
// API to create a new bet
const createBet = async (req, resp) => {
  try {
    const { receiverNumber }=req.body;
    console.log(receiverNumber)
    let check = await User.findOne({ phone: receiverNumber })
    
    if(check){
      let bet = new Bet(req.body);
      let result = await bet.save();
      resp.send(result);
      
    }
    else{
      console.log('The reciver is not registered')
      resp.send({ error: 'The reciver is not registered'});
    }
 
  } catch (error) {
    resp.status(500).send({ error: 'Error creating a bet', details: error.message });
  }
};

// API to find all the bets using a specific number involved in both sender and receiver.
const getBet = async (req, resp) => {
  try {
    const arr1 = await Bet.find({
      senderNumber: req.params.num,
      status: req.params.status
    });

    const arr2 = await Bet.find({
      receiverNumber: req.params.num,
      status: req.params.status
    });

    const arr3 = [...arr1, ...arr2];
    resp.send(arr3);
  } catch (error) {
    resp.status(500).send('An error occurred: ' + error.message);
  }
};

// API to get bet requests
const getRequestBet = async (req, resp) => {
  try {
    const arr2 = await Bet.find({
      receiverNumber: req.params.num,
      status: req.params.status
    });

    resp.send(arr2);
  } catch (error) {
    resp.status(500).send('An error occurred: ' + error.message);
  }
};

// API to change the status to "final" for multiple bets
const changetofinal = async (req, resp) => {
  try {
    const filter = { _id: { $in: req.body.ids } };
    const update = { $set: { status: "final" } };
    const result = await Bet.updateMany(filter, update);
    resp.status(200).send("Success");
  } catch (e) {
    resp.status(500).send(e.message);
  }
};

// API to delete a bet by ID
const deleteBet = async (req, resp) => {
  try {
    const result = await Bet.deleteOne({ _id: req.params.id });
    resp.send(result);
  } catch (error) {
    resp.status(500).send('Error deleting your bet');
  }
};

// API to update the status of a bet
const updateStatus = async (req, resp) => {
  try {
    let result = await Bet.findOne({ _id: req.params.id });
    if (!result) {
      resp.status(404).send('Bet not found');
      return;
    }
    result.status = req.body.status;
    result = await result.save();
    resp.send(result);
  } catch (error) {
    resp.status(500).send({ error: 'Error updating bet status', details: error.message });
  }
};

// API to find a bet with a specific ID and then set the final response of both parties
const setFinalResp = async (req, resp) => {
  try {
    let result = await Bet.findOne({ _id: req.params.id });
    if (!result) {
      resp.status(404).send('Bet not found');
      return;
    }
    const check = req.params.check;
    const finalResp = req.body.finalResp;
    if (check === '1') {
      result.senderFinalResp = finalResp;
    } else if (check === '0') {
      result.receiverFinalResp = finalResp;
    } else {
      result.senderFinalResp = "NIL";
      result.receiverFinalResp = "NIL";
    }
    result = await result.save();
    resp.send(result);
  } catch (error) {
    resp.status(500).send({ error: 'An error occurred while processing your request' });
  }
};

const SetWagerResp=async(req,resp)=>{
  let result = await Bet.findOne({ _id: req.params.id });
  if(req.params.check=="1"){
    result.senderWager="Yes"
  }
  else{
    result.receiverWager = "Yes"
  }
  result.save();
  resp.send(result);
}

module.exports = { createBet, updateStatus, getBet, setFinalResp, deleteBet, getRequestBet, changetofinal,SetWagerResp};
