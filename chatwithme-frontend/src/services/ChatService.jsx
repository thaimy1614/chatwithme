import axios from "axios";
import { getToken } from "./localStorageService";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { over } from "stompjs";

var stompClient = null;

export const connectWebsocket = () => {
  let sock = new SockJS(import.meta.env.VITE_API_HOST_PORT + "/ws");
  stompClient = over(sock);
  stompClient.connect({}, onConnect, onError);
};

const onConnect = () => {
  console.log("Connected");
};
const onError = (err) => {
  console.log("err=>", err);
};

export const subscribeToTopic = (topic, callback) => {
  if (stompClient && stompClient.connected) {
    stompClient.subscribe(topic, (message) => {
      callback(JSON.parse(message.body));
    });
  } else {
    console.error("Stomp client is not connected.");
  }
};

// Hàm gửi tin nhắn qua WebSocket
export const sendMessage = (destination, message) => {
  if (stompClient && stompClient.connected) {
    stompClient.send(destination, {}, JSON.stringify(message));
  } else {
    console.error("Stomp client is not connected.");
  }
};

export const getSocket = () => stompClient;

const createHeader = async () => {
  const payloadHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };
  return payloadHeader;
};

export const getMyRooms = async () => {
  const header = await createHeader();

  try {
    const res = await axios.get(`/room/my-rooms`, header);
    return res.data.result.content;
  } catch (e) {
    console.error(e);
  }
};

export const getAllMessages = async (chatRoomId) => {
  const header = await createHeader();
  try {
    const res = await axios.get(`/message/${chatRoomId}/messages`, header);
    return res.data.result.content;
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
};

export const getAllUsers = async () => {
  const header = await createHeader();

  try {
    const res = await axios.get(`/user`, header);
    return res.data.result;
  } catch (e) {
    console.error(e);
  }
};

export const getUser = async (userId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`/user/${userId}`, header);
    console.log(res.data.result)
    return res.data.result;
  } catch (e) {
    console.error(e);
  }
};
export const getMyInfo = async () => {
  const header = await createHeader();

  try {
    const res = await axios.get(`/user/my-info`, header);
    return res.data.result;
  } catch (e) {
    console.error(e);
  }
};

export const getUsers = async (users) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`/user/users`, users, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getChatRoomOfUsers = async (firstUserId, secondUserId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(
      `${baseURL}/room/${firstUserId}/${secondUserId}`,
      header
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const createPrivateChatRoom = async (userId) => {
  const header = await createHeader();
  
  try {
    const res = await axios.post(`/room/private?userId2=${userId}`, header);
    return res.data.result;
  } catch (e) {
    console.error(e);
  }
};
export const createGroupChatRoom = async (room) => {
  const header = await createHeader();
  
  try {
    const res = await axios.post(`/room/group`, room, header);
    return res.data.result;
  } catch (e) {
    console.error(e);
  }
};

export const getMessagesOfChatRoom = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`/message/${chatRoomId}/messages`, header);
    const messages = res.data.result.content.sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    console.log(messages)
    return messages;
  } catch (e) {
    console.error(e);
  }
};

export const saveMessage = async (messageBody) => {
  const header = await createHeader();

  try {
    const res = await axios.post(`/message`, messageBody, header);
    return res.data.result;
  } catch (e) {
    console.error(e);
  }
};

export const updateMyInfo = async (info) => {
  const header = await createHeader();

  try {
    const res = await axios.put(`/user`, info, header);
    return res.data.result;
  } catch (e) {
    console.error(e);
  }
};
