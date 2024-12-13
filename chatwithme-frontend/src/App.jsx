import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { Login } from "./Layout/Login";
import { ChatPage2 } from "./Layout/ChatPage2";
import { Signup } from "./Layout/Signup";
import Authenticate from "./component/common/Authenticate";
axios.defaults.baseURL = import.meta.env.VITE_API_PREFIX || "http://localhost:8080";
axios.defaults.withCredentials = true;
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/chat" element={<ChatPage2 />} />
      <Route path="/authenticate" element={<Authenticate />} />
    </Routes>
  );
}

export default App;
