import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './component/Navbar'
import Home from './component/Home'
import Login from './component/Login'
import View_Bus from "./component/View_Bus"
import Error from "./component/Error"
import UserInfo from './component/UserInfo'
import UserUpdate from './component/UserUpdate'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route>
          <Route path='/' element={<Home/>}></Route>
          <Route path="/Login" element={<Login/>}></Route>
          <Route path="/View_Bus/:_id" element={<View_Bus/>}></Route>
          <Route path="*" element={<Error/>}></Route>
          <Route path='/UserInfo' element={<UserInfo/>}></Route>
          <Route path='/UserInfo/update/:email' element={<UserUpdate/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
