import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import axios from "axios";
import List from "../components/List";
import { GetHistory, GetOpenBets, GetRequests, GetloseBets, getWins } from "../utils/UtilityFunctions";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const location = useLocation();
   const token = localStorage.getItem("token");
   const headers = {
     headers: { authorization: token },
   };

  // Function to get user information
  const getUser = async () => {
    try {
      const user = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/user/${localStorage.getItem("user")}`,headers 
      );
      setUsername(user.data.name);
    } catch (error) {
      console.error("Error while fetching user data:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };
  const [BetList, setBetList] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getUser();
    if(location.pathname==="/home/open"){
      GetOpenBets(setBetList)
    }
  }, [navigate]);


  return (
    <div className="w-screen h-screen flex bg-blue-100 flex-col">
      <Nav username={username} />
      <div className="py-3 flex w-full justify-around my-2 text-black mt-2 border-solid border-b-2 border-slate-600">
        <span className="font-semibold md:text-xl cursor-pointer relative liner">
          <NavLink
            className="nav_link"
            to={"/home/request"}
            onClick={() =>{setBetList([]); GetRequests(setBetList)}}
          >
            Bet Request
          </NavLink>
        </span>
        <span className="font-semibold md:text-xl cursor-pointer">
          <NavLink
            className="nav_link"
            to={"/home/open"}
            onClick={() => {setBetList([]);GetOpenBets(setBetList)}}
          >
            Open Bets
          </NavLink>
        </span>
        <span className="font-semibold md:text-xl cursor-pointer">
          <NavLink
            className="nav_link"
            to={"/home/wins"}
            onClick={() => {setBetList([]); getWins(setBetList)}}
          >
            Wins
          </NavLink>
        </span>
        <span className="font-semibold md:text-xl cursor-pointer">
          <NavLink
            className="nav_link"
            to={"/home/lose"}
            onClick={() =>{setBetList([]); GetloseBets(setBetList)}}
          >
            Loses
          </NavLink>
        </span>
        <span className="font-semibold md:text-xl cursor-pointer">
          <NavLink
            className="nav_link"
            to={"/home/history"}
            onClick={() =>{setBetList([]); GetHistory(setBetList)}}
          >
            History
          </NavLink>
        </span>
      </div>
      <div className="w-full h-full overflow-y-scroll scroller scroll-smooth  flex justify-center items-center">
        <List BetList={BetList} setBetList={setBetList} />
      </div>
    </div>
  );
};

export default Home;
