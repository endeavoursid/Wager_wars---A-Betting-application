import axios from "axios";
import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CreateBet = () => {
  const [senderName, setSenderName] = useState("");
  const [senderResponse, setSenderResponse] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverNumber, setReceiverNumber] = useState();
  const [criteria, setCriteria] = useState("");
  const [resolDate, setResolDate] = useState("");
  const [wager, setWager] = useState("");
  const status = "pending"
  const senderFinalResp = "NIL"
  const receiverFinalResp = "NIL"
  const senderNumber = localStorage.getItem("phone");
  const [error, setError] = useState(false);
  const [dateErr, setDateErr] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function isDate20MinutesGreater(inputDate) {
    // Parse the input date in ISO format
    const givenDate = new Date(inputDate);

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = givenDate - currentDate;

    // Convert 20 minutes to milliseconds (1 minute = 60,000 milliseconds)
    const twentyMinutesInMilliseconds = 15 * 60000;
    
    // Compare the time difference with 20 minutes
    if (timeDifference > twentyMinutesInMilliseconds) {
      return true;
    }
    return false;
  }
  // Function to fetch user data
  const getUser = async () => {
    try {
      let user = await axios.get(
        `http://localhost:5200/user/${localStorage.getItem("user")}`
      );
      user = user.data;
      setUsername(user.name);
    } catch (e) {}
  };
  const sendResp = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5200/api/sendmessage`,
        {
          number: receiverNumber,
          receName: receiverName,
          sendName: senderName,
        }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("An error occurred while fetching user data:", error);
    }
  };

  const handlenumberChange = (value, data) => {
    setReceiverNumber(value);
  };

  // Function to initiate a bet
  const initiateBet = async () => {
    let receiverResponse = "Yes";
    if (senderResponse == "Yes") {
      receiverResponse = "No";
    } else {
      receiverResponse = "Yes";
    }

    if (
      !senderName ||
      !senderResponse ||
      !senderNumber ||
      !receiverName ||
      !receiverNumber ||
      !criteria ||
      !resolDate ||
      !wager
    ) {
      setError(true);
      return;
    }

    if (isNaN(receiverNumber)) {
      setError(true);
      return;
    }

    if (!isDate20MinutesGreater(resolDate)) {
      console.log("false");
      setDateErr(true);
      return;
    }
    const betData = {
      senderName,
      senderResponse,
      senderNumber,
      receiverName,
      receiverResponse,
      receiverNumber,
      criteria,
      resolDate,
      wager,
      status,
      senderFinalResp,
      receiverFinalResp,
      senderWager: "none",
      receiverWager: "none",
    };

    try {
      const response = await axios.post(
        "http://localhost:5200/api/createbet",
        betData
      );
      if (response.data.error) {
        alert("Receiver is not registerd");
        return false;
      }
      console.log(response.data);
      if (response.status === 200) {
        // Calling the send response API after posting a new bet to get the bet confirmation from the counterparty.
        sendResp();
        alert("Bet created successfully");
        navigate("/home");
      } else {
        console.error("Error creating bet", response.status, response.data);
      }
    } catch (error) {
      console.error(error.message);
    }

   
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getUser();
  }, []);

  return (
    <div className="w-screen h-full flex justify-center bg-blue-100 flex-col items-center">
      <Nav username={username} />
      <div className="w-full max-w-md p-8 m-4 bg-white rounded-lg shadow-2xl">
        <h1 className="text-center text-3xl font-semibold mb-4">
          Initiate Bet
        </h1>
        <div className="mb-4 ">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="initName"
          >
            Initiator Name
          </label>
          <input
            type="text"
            id="senderName"
            placeholder="Enter initiator's name"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />

          {error && !senderName && (
            <span className="text-red-500 text-left">Enter a valid name</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-slate-900 text-sm font-bold mb-2 text-left">
            Initiator Response
          </label>

          <div className="flex items-start">
            <div className="mr-2">
              <label>
                <input
                  type="radio"
                  name="senderResponse"
                  value="Option 1"
                  checked={senderResponse === "Yes"}
                  onChange={() => setSenderResponse("Yes")}
                  className="mr-1"
                />
                Yes
              </label>
            </div>
            <div className="mr-2">
              <label>
                <input
                  type="radio"
                  name="senderResponse"
                  value="Option 2"
                  checked={senderResponse === "No"}
                  onChange={() => setSenderResponse("No")}
                  className="ml-3 mr-1"
                />
                No
              </label>
            </div>
          </div>

          {error && !senderResponse && (
            <span className="text-red-500 text-left">Select a response</span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="receiverName"
          >
            Counterparty Name
          </label>
          <input
            type="text"
            id="receiverName"
            placeholder="Enter counterparty's name"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
          />

          {error && !receiverName && (
            <span className="text-red-500 text-left">Enter a valid name</span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="wager"
          >
            Counterparty Phone Number
          </label>
          <PhoneInput
            country={"us"}
            id="receiverNumber"
            inputProps={{
              required: true,
            }}
            value={receiverNumber}
            onChange={handlenumberChange}
          />
          {error && (!receiverNumber || isNaN(receiverNumber)) && (
            <span className="text-red-500 text-left">
              Enter a valid Phone number
            </span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="criteria"
          >
            Criteria
          </label>
          <textarea
            type="text"
            id="criteria"
            placeholder="Enter criteria"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
          />
          {error && !criteria && (
            <span className="text-red-500 text-left">Enter valid criteria</span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="resolDate"
          >
            Resolution Date
          </label>
          <input
            type="datetime-local"
            id="resolDate"
            placeholder="Enter resolution date"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={resolDate}
            onChange={(e) => setResolDate(e.target.value)}
          />

          {error && !resolDate && (
            <span className="text-red-500 text-left">Enter a valid date</span>
          )}
          {dateErr && (
            <span className="text-red-500 text-left">
              Enter a date 20 mins greater than current date and less than 7
              days
            </span>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-slate-900 text-sm font-bold mb-2 text-left"
            htmlFor="wager"
          >
            Wager
          </label>
          <input
            type="text"
            id="wager"
            placeholder="Enter wager"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={wager}
            onChange={(e) => setWager(e.target.value)}
          />
          {error && !wager && (
            <span className="text-red-500 text-left">Enter a valid wager</span>
          )}
        </div>

        <button
          onClick={initiateBet}
          className="text-xl bg-blue-500 text-slate-50 px-4 py-2 font-semibold rounded-lg w-full active:scale-105 duration-200 "
        >
          Initiate Bet
        </button>
      </div>
    </div>
  );
};

export default CreateBet;
