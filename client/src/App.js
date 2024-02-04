import './App.css';
import CustomCam from './Components/CustomCam';
import Login from './Components/Login';
import Registration from './Components/Registration';
import Acknowledgement from './Components/Acknowledgement';
import {useState} from "react"
import {
  BrowserRouter,Route,Routes
} from "react-router-dom";
function App() {
  const [curUser,setCurUser]=useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login curUser={curUser} setCurUser={setCurUser}/>} />
        <Route path="/registration" element={<Registration curUser={curUser} setCurUser={setCurUser}/>} />
        <Route path="/webcam" element={<CustomCam curUser={curUser} setCurUser={setCurUser}/>} />
        <Route path="/acknowledgement" element={<Acknowledgement curUser={curUser} setCurUser={setCurUser}/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
