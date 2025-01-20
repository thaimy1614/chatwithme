import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken, setIoStreamToken, setToken } from "../../services/localStorageService";
import { Box, CircularProgress, Typography } from "@mui/material";
import { fetchUserInfo } from "../../Layout/Login";
import axios from "axios";
import { useUser } from "../../context/UserContext";

export default function Authenticate() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const {currentUser, setCurrentUser} = useUser();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);
  
        if (isMatch) {
          const authCode = isMatch[1];
  
          const response = await axios.post(
            `${import.meta.env.VITE_API_PREFIX}/user/outbound/authentication?code=${authCode}`,
            {},
            {
              headers: {
                'Content-Type': 'application/json', // Replace with your actual token if needed
              },
            }
          );
  
          const data = response.data;
          console.log(data);
  
          setToken(data.result.token);
          setIoStreamToken(data.result.ioStreamToken);
          setIsLoggedin(true);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    };
  
    authenticateUser();
  }, []);
  
  useEffect(() => {
    const fetchUserAndNavigate = async () => {
      if (isLoggedin) {
        try {
          const userInfo = await fetchUserInfo(getToken()); 

          if (userInfo) {
            setCurrentUser(userInfo);
            navigate("/");
          } else {
            console.error("Failed to retrieve user info.");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserAndNavigate();
  }, [isLoggedin, navigate]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress></CircularProgress>
        <Typography>Đang xác minh...</Typography>
      </Box>
    </>
  );
}
