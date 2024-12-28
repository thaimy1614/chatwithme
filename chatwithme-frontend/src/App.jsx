import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { Login } from "./Layout/Login";
import { ChatPage2 } from "./Layout/ChatPage2";
import { Signup } from "./Layout/Signup";
import Authenticate from "./component/common/Authenticate";
import ChatLayout from "./component/layouts/ChatLayout";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Profile from "./component/accounts/Profile";
import { connectWebsocket } from "./services/ChatService";
import { useEffect } from "react";
import Header from "./component/layouts/Header";
import { UserProvider } from "./context/UserContext";
axios.defaults.baseURL =
  import.meta.env.VITE_API_PREFIX || "http://localhost:8080";
axios.defaults.withCredentials = true;
function App() {
  useEffect(() => {
    connectWebsocket();
  }, []);

  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <WithPrivateRoute>
              <ChatLayout />
            </WithPrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <WithPrivateRoute>
              <Profile />
            </WithPrivateRoute>
          }
        />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<ChatPage2 />} />
        <Route path="/authenticate" element={<Authenticate />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
