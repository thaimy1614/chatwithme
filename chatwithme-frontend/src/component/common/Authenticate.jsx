import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setToken } from "../../services/localStorageService";
import { Box, CircularProgress, Typography } from "@mui/material";
import { fetchUserInfo } from "../../Layout/Login";

export default function Authenticate() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];

      fetch(
        `${import.meta.env.VITE_API_PREFIX}/user/outbound/authentication?code=${authCode}`,
        {
          method: "POST",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);

          setToken(data.result.token);
          setIsLoggedin(true);
        });
    }
  }, []);

  useEffect(() => {
    const fetchUserAndNavigate = async () => {
      if (isLoggedin) {
        try {
          const userInfo = await fetchUserInfo(); 

          if (userInfo) {
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
