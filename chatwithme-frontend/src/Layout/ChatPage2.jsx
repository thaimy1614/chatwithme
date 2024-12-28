import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { over } from "stompjs";
import { getCurrentRoom, getToken } from "../services/localStorageService";
import ChatRoomList from "./ChatRoomList";
import axios from "axios";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  IconButton,
  InputBase,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

var stompClient = null;

export const ChatPage2 = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) {
    navigate.push("/login");
  }
  const user = JSON.parse(userInfo);

  const [fullName] = useState(user.fullName);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [messages, setMessages] = useState();
  const [currentRoom, setCurrentRoom] = useState("");
  const [page, setPage] = useState(0);

  const fetchMyRooms = async () => {
    try {
      const response = await axios.get("/room/my-rooms", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.data;
      console.log(data);
      setRooms(data.result.content);
      return data.result.content;
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/message/${currentRoom}/messages`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.data;
      console.log(data);
      setMessages(data.result.content);
      return data.result;
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchCurrentRoom = async () => {
    try {
      const response = await axios.get(`/room/${currentRoom}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.data;
      console.log(data);
      setRoomInfo(data.result);
      return data.result;
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  //const data = media.split(";")[0].split("/")[0].split(":")[1];
  //console.log(data);

  function getMediaType(media) {
    if (!media || typeof media !== "string") return null;
    try {
      const type = media.split(";")[0].split("/")[0].split(":")[1];
      return type;
    } catch (error) {
      console.error("Error parsing media type:", error);
      return null;
    }
  }

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log(payloadData);

    setMessages((prev) => [...prev, payloadData]);
  };

  const onConnect = () => {
    console.log("Connected");
    stompClient.subscribe(`/user/${user.userId}/chat`, onMessageReceived);
    // userJoin();
  };
  const onError = (err) => {
    console.log("err=>", err);
  };
  const handleLogout = () => {
    userLeft();
    localStorage.removeItem("chat-username");
    navigate.push("/login");
  };
  const userJoin = () => {
    let chatMessage = {
      senderName: fullName,
      status: "JOIN",
    };

    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };
  const userLeft = () => {
    let chatMessage = {
      senderName: fullName,
      status: "LEAVE",
    };

    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const connect = () => {
    let sock = new SockJS(import.meta.env.VITE_API_HOST_PORT + "/ws");
    stompClient = over(sock);
    stompClient.connect({}, onConnect, onError);
  };

  useEffect(() => {
    if (currentRoom != "") {
      fetchCurrentRoom();
      fetchMessages();
    }
  }, [currentRoom]);
  useEffect(() => {
    fetchMyRooms();
    connect();
  }, []);

  async function base64ConversionForImages(e) {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  function getBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setMedia(reader.result);
      const base64Data = reader.result;

      setMedia(base64Data);
    };
    reader.onerror = function (error) {
      console.log("Error", error);
    };
  }

  const sendMessage = () => {
    if (message.trim().length > 0 || message.media != null) {
      stompClient.send(
        `/app/chat/${roomInfo.roomId}`,
        {},
        JSON.stringify({
          senderId: user.userId,
          media: media,
          content: message,
        })
      );
      const messageToSave = {
        content: message,
        senderId: user.userId,
        senderName: fullName,
        media: media,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, messageToSave]);
      setMessage("");
      setMedia("");
    }
  };

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      className="d-flex justify-content-center align-items-center"
      sx={{
        height: "100vh",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://picsum.photos/1536/735?redscale")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        className="container d-flex p-0"
        sx={{
          display: "flex",
          width: "90%",
          maxWidth: "1200px",
          maxHeight: "90vh",
          flexDirection: { xs: "column", sm: "row" },
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <ChatRoomList
          setCurrentRoom={setCurrentRoom}
          rooms={rooms}
          currentRoom={currentRoom}
          page={page}
          setPage={setPage}
        />
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          <Paper
            className="chat-messages p-3"
            ref={messagesEndRef}
            sx={{
              height: 500, // Fixed height
              flexGrow: 1,
              backgroundColor: "#f5f5f5",
              overflowY: "auto", // Enables scroll if content exceeds height
              padding: 2,
              border: "1px solid #1976d2",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: 2,
            }}
          >
            {messages &&
              messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.senderId === user.userId
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      padding: 1,
                      backgroundColor:
                        message.senderId === user.userId
                          ? "primary.main"
                          : "white",
                      color:
                        message.senderId === user.userId ? "white" : "black",
                      borderRadius: 2,
                      maxWidth: "60%",
                      wordWrap: "break-word",
                    }}
                  >
                    <div>{message.content}</div>
                    {getMediaType(message.media) === "image" && (
                      <img
                        src={message.media}
                        alt=""
                        width={"100%"}
                        style={{
                          marginTop: 8,
                          borderRadius: 4,
                        }}
                      />
                    )}
                    {getMediaType(message.media) === "video" && (
                      <video
                        width="100%"
                        height="240"
                        controls
                        style={{ marginTop: 8, borderRadius: 4 }}
                      >
                        <source src={message.media} type="video/mp4" />
                      </video>
                    )}
                  </Paper>
                </Box>
              ))}
          </Paper>

          <Paper
            className="d-flex align-items-center p-2"
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "space-between",
              borderRadius: 2,
            }}
          >
            <InputBase
              placeholder="Tin nhắn..."
              value={message}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                flexGrow: 1,
                ml: 1,
                padding: 1,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: 2,
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="primary" component="label">
                <AttachFileIcon />
                <input
                  type="file"
                  hidden
                  onChange={base64ConversionForImages}
                />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={sendMessage}
                sx={{ marginLeft: 2 }}
              >
                Gửi
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
