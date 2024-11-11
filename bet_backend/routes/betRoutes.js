const express = require("express");
const router = express.Router();
const {createBet, updateStatus, getBet, setFinalResp, deleteBet,getRequestBet, changetofinal, SetWagerResp} = require('../task/betFunctions');
const {sendMessage, sendResolutionUpdate, sendResult} = require('../task/twilioFunctions');
const { Verifytoken } = require("../middlerware");

//api to create a new bet
router.post('/api/createbet', createBet);

//api to get all the bets
router.get('/api/getbet/:num/:status', getBet);

router.get('/api/getrequest/:num/:status', getRequestBet);

//api to delete a specific bet
router.delete('/api/deletebet/:id', deleteBet);

//api to change the status to final
router.patch("/api/updatefinal",changetofinal);

//api to update the status of bet
router.patch('/api/updatestatus/:id', updateStatus);

//api to getmessage response using twilio
router.post('/api/sendmessage', sendMessage);

//api to send scheduled message at resolution date using twilio
router.post('/api/sendresolupdate/:id', sendResolutionUpdate);

//api to send final message of win and loss
router.post("/api/sendresult",sendResult);

//api to set the final response of both individuals/parties depending on an check code passed as params
router.patch('/api/setfinalresp/:id/:check', setFinalResp);


router.patch('/api/setwagerResp/:id/:check', SetWagerResp);

module.exports = router;


