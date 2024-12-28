import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Container, Typography } from "@mui/material";
import { OAuthConfig } from "../configurations/configuration";
import {
  getToken,
  setToken,
  setUserInfo,
} from "../services/localStorageService";
import Loading from "../component/common/loading";
import MessageModal from "../component/common/message-modal";
import axios from "axios";
import { useUser } from "../context/UserContext";

export const fetchUserInfo = async () => {
  try {
    const response = await axios.get("/user/my-info", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await response.data;
    setUserInfo(JSON.stringify(data.result));
    return data.result;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    setModalOpen(false);
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);

    window.location.href = targetUrl;
  };

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType] = useState(false);
  const [failMessage, setFailMessage] = useState(
    "INCORRECT USERNAME OR PASSWORD!"
  );

  const { setCurrentUser } = useUser();

  useEffect(() => {
    const accessToken = getToken();

    if (accessToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setModalOpen(false);
    setLoading(true);

    const userData = { username, password };

    try {
      const response = await axios.post("/user/login", userData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;
      setLoading(false);

      if (data.code === 1005) {
        setFailMessage("Tài khoản không tồn tại!");
        setModalOpen(true);
        return;
      }

      if (data.code === 1008) {
        setFailMessage("Tên đăng nhập hoặc mật khẩu không chính xác!");
        setModalOpen(true);
        return;
      }

      setToken(data.result.token);
      const userInfo = await fetchUserInfo();

      if (userInfo) {
        setCurrentUser(userInfo);
        navigate("/");
      } else {
        setCurrentUser(null);
        console.error("Failed to retrieve user info.");
        setFailMessage("Hệ thống sập rồi!!!");
        setModalOpen(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      setFailMessage("Hệ thống sập rồi!!!");
      setModalOpen(true);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  return (
    <>
      {loading && <Loading />}
      <Box
        sx={{
          height: "100vh",
          backgroundImage: `url("https://picsum.photos/1536/735?redscale")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Đăng nhập
            </Typography>
            <form noValidate>
              <TextField
                label="Tên đăng nhập"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.key == 13) handleLogin();
                }}
                required
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={handleLogin}
              >
                Đăng nhập
              </Button>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginTop: 2 }}
                className="google-signin"
                onClick={handleClick}
              >
                <img
                  style={{ width: 20 }}
                  src="/assets/images/google.png"
                  alt="Google"
                />{" "}
                Đăng Nhập Với Google
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={() => navigate("/signup")}
              >
                Đăng ký
              </Button>
            </form>
          </Box>
        </Container>
      </Box>
      {modalOpen && (
        <MessageModal
          message={failMessage}
          open={modalOpen}
          handleClose={handleClose}
          messageType={messageType}
        />
      )}
    </>
  );
};