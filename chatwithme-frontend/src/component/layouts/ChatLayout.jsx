import { useEffect, useRef, useState } from "react";

import {
  connectWebsocket,
  createPrivateChatRoom,
  getAllUsers,
  getMyRooms,
  getSocket,
  subscribeToTopic,
  subscribeVideoCallRequest,
} from "../../services/ChatService";

import ChatRoom from "../chat/ChatRoom";
import Welcome from "../chat/Welcome";
import AllUsers from "../chat/AllUsers";
import SearchUsers from "../chat/SearchUsers";
import { getUserInfo } from "../../services/localStorageService";
import SearchPopup from "./SearchPopup";
import { use } from "react";
import { MyUILayout } from "../../utils/MyUILayout";

export default function ChatLayout() {
  const [users, SetUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsersId, setonlineUsersId] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isContact, setIsContact] = useState(false);

  const socket = useRef();

  const currentUser = JSON.parse(getUserInfo());

  // useEffect(() => {
  // const getSocket = async () => {
  //   const res = await initiateSocketConnection();
  //   socket.current = res;
  //   socket.current.emit("addUser", currentUser.userId);
  //   socket.current.on("getUsers", (users) => {
  //     const userId = users.map((u) => u[0]);
  //     setonlineUsersId(userId);
  //   });
  // };

  // getSocket();

  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMyRooms(currentUser.userId);
      setChatRooms(res);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllUsers();
      SetUsers(res);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
    setFilteredRooms(chatRooms);
  }, [users, chatRooms]);

  useEffect(() => {
    if (isContact) {
      setFilteredUsers([]);
    } else {
      setFilteredRooms([]);
    }
  }, [isContact]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  useEffect(() => {
    subscribeToTopic(`/user/${currentUser.userId}/chat`, (message) => {
      handleChatRoomChange(message.roomId, {
        lastMessage: message,
        lastModifiedAt: message.createdAt,
      });
    });
  }, [currentUser.userId]);

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery);

    const searchedUsers = users.filter((user) => {
      return user.fullName.toLowerCase().includes(newSearchQuery.toLowerCase());
    });

    const searchedUsersId = searchedUsers.map((u) => u.userId);

    // If there are initial contacts
    if (chatRooms.length !== 0) {
      chatRooms.forEach((chatRoom) => {
        // Check if searched user is a contact or not.
        const isUserContact = chatRoom.members.some(
          (e) => e !== currentUser.userId && searchedUsersId.includes(e)
        );
        setIsContact(isUserContact);

        isUserContact
          ? setFilteredRooms([chatRoom])
          : setFilteredUsers(searchedUsers);
      });
    } else {
      setFilteredUsers(searchedUsers);
    }
  };
  const [modal, setModal] = useState(false);
  const handleShowSearchPopup = () => {
    setModal(true);
  };

  const openChatRoom = async (userId) => {
    if (userId === currentUser.userId) return;
    // if (chatRooms.length !== 0) {
    //   const res = chatRooms.find((room) => {
    //     return room.members.includes(userId);
    //   });

    //   if (res) {
    //     setCurrentChat(res);
    //     return;
    //   }
    // }
    const res = await createPrivateChatRoom(userId);
    const isRoomExist = chatRooms.some((room) => room.roomId === res.roomId);
    if (!isRoomExist) setChatRooms([res, ...chatRooms]);
    setCurrentChat(res);
    setModal(false);
  };

  const handleChatRoomChange = (roomId, updatedFields) => {
    console.log(roomId);
    console.log(updatedFields);
    setChatRooms((prevRooms) => {
      const updatedRooms = prevRooms.map((room) =>
        room.roomId === roomId ? { ...room, ...updatedFields } : room
      );

      const updatedRoom = updatedRooms.find((room) => room.roomId === roomId);
      const filteredRooms = updatedRooms.filter(
        (room) => room.roomId !== roomId
      );

      return [updatedRoom, ...filteredRooms];
    });
    if (currentChat?.roomId === roomId) {
      setCurrentChat((prev) => {
        return { ...prev, ...updatedFields };
      });
    }
  };
  const [isCallIncoming, setIsCallIncoming] = useState(false);
  const [callData, setCallData] = useState(null);

  const stompClient = getSocket();
  useEffect(() => {
    if (!currentUser || !stompClient) return;

    const subscribeToCallRequest = () => {
      stompClient.connect({}, () => {
        stompClient.subscribe(`/user/${currentUser.userId}/queue/call/request`, (message) => {
          const data = JSON.parse(message.body);
          if (data) {
            setCallData(data);
            setIsCallIncoming(true);
          }
        });
      }, (error) => {
        console.error("Error connecting to WebSocket:", error);
      });
    };
  
    subscribeToCallRequest();
    return () => {
      if (currentUser?.userId && stompClient?.connected) {
        stompClient.unsubscribe(`/user/${currentUser.userId}/queue/call/request`);
      }
    };
  }, [currentUser]); 

  return (
    <div className="container mx-auto h-full flex flex-col">
      <div className="flex flex-grow bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-lg">
        <div className="w-1/4 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <SearchUsers
            handleSearch={handleSearch}
            handleShowSearchPopup={handleShowSearchPopup}
          />

          <AllUsers
            users={searchQuery !== "" ? filteredUsers : users}
            chatRooms={searchQuery !== "" ? filteredRooms : chatRooms}
            setChatRooms={setChatRooms}
            onlineUsersId={onlineUsersId}
            currentUser={currentUser}
            changeChat={handleChatChange}
            currentChat={currentChat}
          />
        </div>

        <div className="w-3/4 flex-grow">
          {currentChat ? (
            <ChatRoom
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
              handleChatRoomChange={handleChatRoomChange}
            />
          ) : (
            <Welcome />
          )}
        </div>
      </div>

      <SearchPopup
        currentUser={currentUser}
        show={modal}
        handleClose={() => setModal(false)}
        openChatRoom={openChatRoom}
      />
      {isCallIncoming && (
        <MyUILayout
          currentRoom = {callData.roomId}
          callerId = {callData.callerId}
          callerName = {callData.callerName}
          calleeId = {currentUser.userId}
          calleeName = {currentUser.fullName}
        />
      )}
    </div>
  );
}
