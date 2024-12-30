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

export const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState(false);
  const [failMessage, setFailMessage] = useState(
    "INCORRECT USERNAME OR PASSWORD!"
  );
  const [successMessage, setSuccessMessage] = useState(""); // Add success message state

  useEffect(() => {
    const accessToken = getToken();

    if (accessToken) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleSignup = async (event) => {
    setModalOpen(false);
    event.preventDefault();
    setLoading(true);
    const userData = {
      username: username,
      password: password,
      fullName: fullName,
    };
    try {
      const response = await axios.post("/user/signup", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      const data = await response.data;
      if (data.code === 1000) {
        setMessageType(true);
        setSuccessMessage(
          "Đăng ký thành công, vui lòng kiểm tra email để xác thực tài khoản!"
        );
        setModalOpen(true);
      } else {
        setMessageType(false);
        setFailMessage("Tên đăng nhập đã tồn tại!");
        setModalOpen(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);
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
              Đăng ký
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
                required
              />
              <TextField
                slotProps={{ input: { maxLength: 30 } }}
                label="Pháp danh của bạn..."
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => {if (e.target.value.length <= 30) {
                  setFullName(e.target.value);
                }}}
                required
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.key == 13) handleSignup();
                }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={handleSignup}
              >
                Đăng ký
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
            </form>
          </Box>
        </Container>
      </Box>
      {modalOpen && (
        <MessageModal
          message={messageType ? successMessage : failMessage}
          open={modalOpen}
          handleClose={handleClose}
          messageType={messageType}
        />
      )}
    </>
  );
};
