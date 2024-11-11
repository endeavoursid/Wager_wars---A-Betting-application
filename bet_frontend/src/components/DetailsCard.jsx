import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";

const DetailsCard = ({
  betid,
  sender,
  senderResp,
  senderNumber,
  receiver,
  receiverResp,
  receiverNumber,
  description,
  resolutionDate,
  wager,
  status,
  deleteBet,
  acceptBet,
  sendResponse,
  finalSenderResp,
  finalReceiverResp,
  result,
  senderWager,
  receiverWager,
  wagerStatus,
  setBetList
}) => {
  // CSS classes for different card styles
  const normal =
    "w-full tbl flex items-start px-5 py-3 my-3 lg:flex-row flex-col justify-evenly";
  const lose =
    "w-full lose flex items-start px-5 py-3 my-3 lg:flex-row flex-col justify-evenly";
  const win =
    "w-full win flex items-start px-5 py-3 my-3 lg:flex-row flex-col justify-evenly";

  // Get the current user's phone number
  const phone = localStorage.getItem("phone");
  const [Isender, setIsender] = useState(false);
  useEffect(() => {
    if (senderNumber == phone) {
      setIsender(true);
    } else {
      setIsender(false);
    }
  }, []);


  return (
    <div
      className={
        (result == "none" && normal) ||
        (result == "lose" && lose) ||
        (result == "win" && win)
      }
    >
      <div className="flex my-2">
        <span className="flex flex-col mx-3  text-black">
          <span className="text-lg font-semibold">Bet Initiator</span>
          <span className="text-lg font-light">{sender}</span>
        </span>
        <span className="flex flex-col mx-3 text-black">
          <span className="text-lg font-semibold">Response</span>
          <span className="text-lg font-light">{senderResp}</span>
        </span>
      </div>
      <div className="flex my-2">
        <span className="flex flex-col mx-3 text-black">
          <span className="text-lg font-semibold">Bet Receiver</span>
          <span className="text-lg font-light">{receiver}</span>
        </span>
        <span className="flex flex-col mx-3 text-black">
          <span className="text-lg font-semibold">Response</span>
          <span className="text-lg font-light">{receiverResp}</span>
        </span>
      </div>

      <span className="flex flex-col max-h-[12rem] lg:max-w-[38%] mx-3  my-2 text-black">
        <span className="text-lg font-semibold">Description</span>
        <span className="text-lg font-light overflow-y-scroll scroller">
          {description}
        </span>
      </span>
      <div className="flex my-2">
        <span className="flex flex-col mx-3 text-black">
          <span className="text-lg font-semibold">Date Of Resolution</span>
          <span className="text-lg font-light">{resolutionDate}</span>
        </span>
        <span className="flex flex-col mx-3  text-black">
          <span className="text-lg font-semibold">wager</span>
          <span className="text-lg font-light">{wager}</span>
        </span>
      </div>
      {status == "pending" && (
        <div className="flex lg:flex-col  justify-evenly h-full mx-3 ">
          <button
            className="sm:text-[3rem] text-3xl lg:mx-0 mx-4 text-green-600 active:scale-105 duration-200 "
            onClick={() => {
              acceptBet(betid, resolutionDate, senderNumber, receiverNumber,setBetList);
            }}
          >
            <AiOutlineCheckCircle />
          </button>
          <button
            className="sm:text-[3rem] text-3xl text-red-600 active:scale-105 duration-200 "
            onClick={() => {
              deleteBet(betid,setBetList);
            }}
          >
            <RxCrossCircled />
          </button>
        </div>
      )}
      {((status == "final" && Isender && finalSenderResp == "NIL") ||
        (status == "final" && !Isender && finalReceiverResp == "NIL")) && (
        <div className="flex flex-col mx-3">
          <div className="text-black font-semibold text-lg">
            Was this Bet result in your Favour?
          </div>
          <div className="flex justify-around my-3">
            <button
              className="text-xl mx-3 bg-blue-600 text-black font-semibold py-1 px-2 rounded-md active:scale-105 duration-200 "
              onClick={() => {
                sendResponse(
                  senderNumber,
                  receiverNumber,
                  betid,
                  "Yes",
                  finalSenderResp,
                  finalReceiverResp,
                  sender,
                  receiver,
                  setBetList
                );
              }}
            >
              YES
            </button>
            <button
              className="text-xl bg-red-600 text-black font-semibold py-1 px-2 rounded-md active:scale-105 duration-200 "
              onClick={() => {
                sendResponse(
                  senderNumber,
                  receiverNumber,
                  betid,
                  "No",
                  finalSenderResp,
                  finalReceiverResp,
                  sender,
                  receiver,
                  setBetList
                );
              }}
            >
              NO
            </button>
          </div>
        </div>
      )}
      {((status == "final" && Isender && finalSenderResp != "NIL") ||
        (status == "final" && !Isender && finalReceiverResp != "NIL")) && (
        <div className="flex h-full items-center justify-center flex-col mx-3">
          <div className="text-black font-bold text-xl">
            Your response was {Isender ? finalSenderResp : finalReceiverResp}
          </div>
        </div>
      )}
      {((senderWager == "none" || receiverWager == "none")&&status=="close") && (
        <div className="flex flex-col items-center h-full justify-center">
          <div className="text-lg font-semibold">
            Is the wager of this bet completed?
          </div>
          <div className="flex w-full justify-center">
            {Isender && senderWager == "none" && (
              <button
                className="text-3xl active:scale-105 duration-200"
                onClick={() => {
                  wagerStatus(Isender, betid, senderWager, receiverWager,setBetList);
                }}
              >
                <AiOutlineCheckCircle />
              </button>
            )}
            {!Isender && receiverWager == "none" && (
              <button
                className="text-3xl active:scale-105 duration-200"
                onClick={() => {
                  wagerStatus(Isender, betid, senderWager, receiverWager,setBetList);
                }}
              >
                <AiOutlineCheckCircle />
              </button>
            )}
            {!Isender && receiverWager == "Yes" && <div>Response Noted</div>}
            {Isender && senderWager == "Yes" && <div>Response Noted</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsCard;
