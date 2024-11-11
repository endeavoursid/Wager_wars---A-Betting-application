import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CreateBet from './pages/CreateBet'
import Login from './pages/Login'
import SiginUp from './pages/Sigin'
import Home from './pages/Home'

import List from './components/List'

function App() {
 

  return (
    <>
      <div className="flex justify-center items-center">
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={SiginUp}></Route>
            <Route path="/login" Component={Login}></Route>
            <Route path="/createBet" Component={CreateBet}></Route>
            <Route path="/home" Component={Home}>
              <Route path="/home/open" Component={List}></Route>
              <Route path="/home/request" Component={List}></Route>
              <Route path="/home/wins" Component={List}></Route>
              <Route path="/home/lose" Component={List}></Route>
              <Route path="/home/history" Component={List}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App
