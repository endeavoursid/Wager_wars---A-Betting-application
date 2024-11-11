require('dotenv').config();
const accountSid=process.env.TWILIO_ACCOUNT_SID
const authToken=process.env.TWILIO_AUTH_TOKEN
const serviceId=process.env.TWILIO_MESSAGING_SERVICE_ID;
const adminNumber = process.env.TWILIO_ADMIN_NUMBER;
const client = require('twilio')(accountSid, authToken);
const Bet = require('../model/betSchema');


const sendMessage = async (req, resp) => {
    try {
      const message = await client.messages.create({
        to: `+${req.body.number}`,
        from:adminNumber,
        messagingServiceSid: serviceId,
        body: `Hi ${req.body.receName} there is a bet being placed by ${req.body.sendName}.`,
      });
      console.log("message sent");
      // Send a response to the API
      resp.status(200).json({ message: 'Message sent successfully', messageSid: message.sid });
    } catch (error) {
      // Handle the error if the message wasn't sent
      console.error(error);
      resp.status(500).json({ error: 'Message sending failed', details: error.message });
    }
};

const sendResolutionUpdate = async (req, resp) => {

    const dateObj = new Date(req.body.resolDate);
    // Extract the individual components
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Months are zero-based, so add 1
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();


    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

    // Calculate the date and time 5 hours and 30 minutes behind
    utcDate.setUTCHours(utcDate.getUTCHours() - 5);
    utcDate.setUTCMinutes(utcDate.getUTCMinutes() - 30);
  
    // Extract the year, month, day, hours, minutes, and seconds in UTC
    const utcYear = utcDate.getUTCFullYear();
    const utcMonth = utcDate.getUTCMonth() + 1; // Months are 0-based
    const utcDay = utcDate.getUTCDate();
    const utcHours = utcDate.getUTCHours();
    const utcMin = utcDate.getUTCMinutes();
    const utcSec = utcDate.getUTCSeconds();
    
  try {
    console.log(req.body.nuber);
    const message = await client.messages.create({
     
      to: `+${req.body.number}`,
      from:adminNumber,
      messagingServiceSid: serviceId,
      sendAt: new Date(Date.UTC(utcYear,utcMonth-1,utcDay,utcHours,utcMin,utcSec)),
      scheduleType: 'fixed',
      body: `Hello, Today the resolution date has hit, please give the final responses of the outcome of the bet placed. `,
    });
    
    // Send a response to the API
    resp.status(200).json({ message: `Message scheduled successfully for ${req.body.resolDate}`, messageSid: message.sid });
  } catch (error) {
    // Handle the error if the message wasn't sent
    console.error(error);
    resp.status(500).json({ error: 'Message sending failed', details: error.message });
  }

};

const sendResult = async (req, resp) => {
  try {
    console.log(req.body.number);
    const message = await client.messages.create({
      to: `+${req.body.number}`,
      from:adminNumber,
      messagingServiceSid: serviceId,
      body: `Hi ${req.body.user} you are the ${req.body.result} of the bet`,
    });
    console.log("message sent");
    // Send a response to the API
    resp.status(200).json({ message: 'Message sent successfully', messageSid: message.sid });
  } catch (error) {
    // Handle the error if the message wasn't sent
    console.error(error);
    resp.status(500).json({ error: 'Message sending failed', details: error.message });
  }
};

module.exports = {sendMessage, sendResolutionUpdate, sendResult};

