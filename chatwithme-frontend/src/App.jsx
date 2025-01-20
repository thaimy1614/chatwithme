import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./Layout/Login";
import { Signup } from "./Layout/Signup";
import Authenticate from "./component/common/Authenticate";
import ChatLayout from "./component/layouts/ChatLayout";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Profile from "./component/accounts/Profile";
import { connectWebsocket } from "./services/ChatService";
import { useEffect } from "react";
import Header from "./component/layouts/Header";
import { UserProvider, useUser } from "./context/UserContext";

import React from "react";

const AudioPlayer = () => {
  useEffect(() => {
    let audio = new Audio("/assets/audio/elakhongth.mp3");
    audio.loop = true;

    const savedTime = localStorage.getItem("audioCurrentTime");
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }

    const handleInteraction = () => {
      audio.play().catch((error) => {
        console.warn("Audio play failed due to:", error);
      });

      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    
    const saveTimeInterval = setInterval(() => {
      if (!audio.paused) {
        localStorage.setItem("audioCurrentTime", audio.currentTime.toString());
      }
    }, 1000);

    return () => {
      // Dọn dẹp sự kiện và audio khi component unmount
      clearInterval(saveTimeInterval);
      audio.pause();
      audio = null; // Giải phóng bộ nhớ
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return null; // Không render gì lên giao diện
};

function App() {
  useEffect(() => {
    connectWebsocket();
  }, []);

  return (
    <UserProvider>
      <AudioPlayer />
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
        <Route path="/authenticate" element={<Authenticate />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
