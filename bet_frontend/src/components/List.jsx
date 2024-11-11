import { useEffect } from "react";
import {
  AcceptBet,
  DeleteBet,
  GetOpenBets,
  SendRespone,
  WagerStatus,
} from "../utils/UtilityFunctions";
import DetailsCard from "./DetailsCard";

const List = ({ BetList, setBetList }) => {

  const num = localStorage.getItem("phone");
  
  if (BetList.length === 0) {
    return (
      <div className="w-[96%] pb-4 h-full text-2xl font-semibold text-black flex justify-center items-center">
        No Bets Yet....
      </div>
    );
  }

 
  return (
    <div className="w-[96%] pb-4 h-full flex flex-col scroller">
      {BetList.map((bet, index) => {
        const {
          senderName,
          senderResponse,
          senderNumber,
          receiverName,
          receiverResponse,
          receiverNumber,
          criteria,
          resolDate,
          wager,
          senderFinalResp,
          receiverFinalResp,
          senderWager,
          receiverWager,
        } = bet;
        let result = "none";
        if (bet.status == "close") {
          if (
            (senderNumber == num && senderFinalResp == "Yes") ||
            (receiverNumber == num && receiverFinalResp == "Yes")
          ) {
            result = "win";
          }
          if (
            (senderNumber == num && senderFinalResp == "No") ||
            (receiverNumber == num && receiverFinalResp == "No")
          ) {
            result = "lose";
          }
        }

        return (
          <DetailsCard
            key={index}
            betid={bet._id}
            sender={senderName}
            senderResp={senderResponse}
            receiver={receiverName}
            receiverResp={receiverResponse}
            senderNumber={senderNumber}
            receiverNumber={receiverNumber}
            description={criteria}
            resolutionDate={resolDate}
            wager={wager}
            status={bet.status}
            result={result}
            finalSenderResp={senderFinalResp}
            finalReceiverResp={receiverFinalResp}
            senderWager={senderWager}
            receiverWager={receiverWager}
            wagerStatus={WagerStatus}
            deleteBet={DeleteBet}
            acceptBet={AcceptBet}
            sendResponse={SendRespone}
            setBetList={setBetList}
          />
        );
      })}
    </div>
  );
};

export default List;
