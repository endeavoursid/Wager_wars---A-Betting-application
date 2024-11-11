import axios from "axios";

const num = localStorage.getItem("phone");
const token = localStorage.getItem("token");

const headers = {
    headers: { authorization: token },
};

const isDateInResolved = (customDateFormat) => {
    // Extract the year, month, day, and time from the custom format
    const [datePart, timePart] = customDateFormat.split("T");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");
    // Create a Date object from the custom format
    const givenDate = new Date(year, month - 1, day, hours, minutes);
    const currentDate = new Date();
    return givenDate <= currentDate;
};
// Function to fetch bet history
export const GetHistory = async (setBetList) => {
    try {
        let list = await axios.get(
            `http://localhost:5200/api/getbet/${num}/close`,headers
        );
        console.log("called");
        setBetList(list.data);
    } catch (error) {
        console.error("An error occurred while fetching bet history:", error);
    }
};

// Function to fetch lose bets
export const GetloseBets = async (setBetList) => {
    try {
        let list = await axios.get(
            `http://localhost:5200/api/getbet/${num}/close`, headers
        );
        let final_list = [];
        list = list.data;

        for (let i = 0; i < list.length; i++) {
            if (list[i].senderNumber == num && list[i].senderFinalResp == "No") {
                final_list.push(list[i]);
            }
            if (
                list[i].receiverNumber == num &&
                list[i].receiverFinalResp == "No"
            ) {
                final_list.push(list[i]);
            }
        }
        setBetList(final_list);
    } catch (error) {
        console.error("An error occurred while fetching lose bets:", error);
    }
};


// Function to fetch open bets
export const GetOpenBets = async (setBetList) => {
    try {
        // console.log("ho")
        let list1 = await axios.get(
            `http://localhost:5200/api/getbet/${num}/open`, headers
        );
        list1 = list1.data;
        let list2 = await axios.get(
            `http://localhost:5200/api/getbet/${num}/final`, headers
        );
        let ids = [];

        for (let i = 0; i < list1.length; i++) {
            const { resolDate, _id } = list1[i];
            if (isDateInResolved(resolDate)) {
                ids.push(_id);
                list1[i].status = "final";
            }
        }

        list2 = list2.data;
        list2 = [...list2, ...list1];
        setBetList(list2);

        if (ids.length > 0) {
            await axios.patch(`http://localhost:5200/api/updatefinal`, {
                ids: [...ids],
            }, headers);
        }
    } catch (error) {
        console.error("An error occurred while fetching open bets:", error);
    }
};


// Function to send a response to the bet
export const SendRespone = async (
    senderPhone,
    receiverPhone,
    id,
    resp,
    senderResp,
    receiverResp,
    sendername,
    receivername,
    setBetList
) => {
    let check = 0;
    if (senderPhone == num) {
        check = 1;
    }
    if (check == 1) {
        if (receiverResp == "NIL") {
            await axios.patch(`http://localhost:5200/api/setfinalresp/${id}/1`, {
                finalResp: resp,
            }, headers);
        } else {
            if (receiverResp == resp) {
                alert("Both participants have given the same response");
            } else {
                await axios.patch(`http://localhost:5200/api/setfinalresp/${id}/1`, {
                    finalResp: resp,
                }, headers);
                await axios.patch(`http://localhost:5200/api/updatestatus/${id}`, {
                    status: "close",
                }, headers);
                if (resp == "Yes") {
                    alert("Congratulations, you won the bet");
                    GetOpenBets(setBetList);

                    try {
                        await axios.post(`http://localhost:5200/api/sendresult`, {
                            number: senderPhone,
                            user: sendername,
                            result: "Winner",
                        }, headers);
                        await axios.post(`http://localhost:5200/api/sendresult`, {
                            number: receiverPhone,
                            user: receivername,
                            result: "Loser",
                        }, headers);
                    } catch (e) {
                        alert("Something went wrong cannot send result message");
                    }
                }
                if (resp == "No") {
                    alert("You lose");
                    GetOpenBets(setBetList);

                    try {
                        await axios.post(`http://localhost:5200/api/sendresult`, {
                            number: senderPhone,
                            user: sendername,
                            result: "Loser",
                        }, headers);
                        await axios.post(`http://localhost:5200/api/sendresult`, {
                            number: receiverPhone,
                            user: receivername,
                            result: "Winner",
                        }, headers);
                    } catch (e) {
                        alert("Something went wrong cannot send result message");
                    }
                }
            }
        }
    } else {
        if (senderResp == "NIL") {
            await axios.patch(`http://localhost:5200/api/setfinalresp/${id}/0`, {
                finalResp: resp,
            }, headers);
        } else {
            if (senderResp == resp) {
                alert("Both participants have given the same response");
            } else {
                await axios.patch(`http://localhost:5200/api/setfinalresp/${id}/0`, {
                    finalResp: resp,
                }, headers);
                await axios.patch(`http://localhost:5200/api/updatestatus/${id}`, {
                    status: "close",
                }, headers);
                if (resp == "Yes") {
                    alert("Congratulations, you won the bet");
                    GetOpenBets(setBetList);

                    await axios.post(`http://localhost:5200/api/sendresult`, {
                        number: senderPhone,
                        user: sendername,
                        result: "Loser",
                    }, headers);
                    await axios.post(`http://localhost:5200/api/sendresult`, {
                        number: receiverPhone,
                        user: receivername,
                        result: "Winner",
                    }, headers);
                }
                if (resp == "No") {
                    alert("You lose");
                    GetOpenBets(setBetList);

                    await axios.post(`http://localhost:5200/api/sendresult`, {
                        number: senderPhone,
                        user: sendername,
                        result: "Winner",
                    }, headers);
                    await axios.post(`http://localhost:5200/api/sendresult`, {
                        number: receiverPhone,
                        user: receivername,
                        result: "Loser",
                    }, headers);
                }
            }
        }
    }
    GetOpenBets(setBetList);
    alert("Your Response is noted");
};


// Function to fetch pending bet requests
export const GetRequests = async (setBetList) => {
    try {
        let list = await axios.get(
            `http://localhost:5200/api/getrequest/${num}/pending`, headers
        );
        list = list.data;
        setBetList(list);
    } catch (error) {
        console.error("An error occurred while fetching pending bets:", error);
    }
};

// Function to delete a bet request
export const DeleteBet = async (id,setBetList) => {
    try {
        let result = await axios.delete(
            `http://localhost:5200/api/deletebet/${id}`, headers
        );
        GetRequests(setBetList); // Refresh the bet list after deletion
    } catch (error) {
        console.error("An error occurred while deleting the bet:", error);
    }
};

// Function to accept a bet request
export const AcceptBet = async (id, resolDate, senderNumber, receiverNumber,setBetList) => {
    try {
        let result = await axios.patch(
            `http://localhost:5200/api/updatestatus/${id}`,
            {
                status: "open",
            }, headers
        );
  
        console.log(receiverNumber);
        let msg2 = await axios.post(
            `http://localhost:5200/api/sendresolupdate/${id}`,
            {
                resolDate: resolDate,
                number: receiverNumber,
            }, headers
        );
        // Perform scheduled tasks here
        console.log(senderNumber);
        let msg1 = await axios.post(
            `http://localhost:5200/api/sendresolupdate/${id}`,
            {
                resolDate: resolDate,
                number: senderNumber,
            }, headers
        );

        GetRequests(setBetList)
        console.log(`Scheduled message sent for: ${resolDate} `);
    } catch (error) {
        console.error("An error occurred while accepting the bet:", error);
    }
};


// Function to fetch closed bets with wins
export const getWins = async (setBetList) => {
    try {
        let list = await axios.get(
            `http://localhost:5200/api/getbet/${num}/close`,headers
        );
        list = list.data;
        let finalList = [];

        for (let i = 0; i < list.length; i++) {

            if (list[i].senderNumber == num && list[i].senderFinalResp == "Yes") {

                finalList.push(list[i]);
            }
            if (
                list[i].receiverNumber == num &&
                list[i].receiverFinalResp == "Yes"
            ) {

                finalList.push(list[i]);
            }
        }

        setBetList(finalList);
    } catch (error) {
        console.error("An error occurred while fetching bets:", error);
    }
};

//Function to set the Wager Status
export const WagerStatus = async (isSender, betId, senderWager, receiverWager, setBetList) => {
    if (isSender) {
        let result = await axios.patch(
            `http://localhost:5200/api/setwagerResp/${betId}/1`, headers
        );
        // console.log(result)
        
            GetHistory(setBetList);
            console.log("vaa")
       
    } else {
        let result = await axios.patch(
            `http://localhost:5200/api/setwagerResp/${betId}/0`, headers
        );
        
            GetHistory(setBetList);
      
    }

    alert("response noted")
};