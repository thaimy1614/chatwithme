import { useState, useEffect, useRef } from "react";

import {
  getMessagesOfChatRoom,
  sendMessage,
  subscribeToTopic,
} from "../../services/ChatService";

import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({
  currentChat,
  currentUser,
  socket,
  handleChatRoomChange,
}) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [participants, setParticipants] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    let subscription; // Đặt subscription trong scope bên ngoài

  const setupSubscription = async () => {
    subscription = await subscribeToTopic(`/user/${currentUser.userId}/chat`, (message) => {
      console.log("current room: " + currentChat.roomId);
      console.log("mess room: " + message.roomId);
      if (currentChat?.roomId === message.roomId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      handleChatRoomChange(message.roomId, {
        lastMessage: message,
        lastModifiedAt: message.createdAt,
      });
    });
  };

  setupSubscription();
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [currentChat.roomId, currentUser.userId]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMessagesOfChatRoom(currentChat.roomId);
      setMessages(res);
    };

    fetchData();
  }, [currentChat.roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    incomingMessage && setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage]);

  const handleFormSubmit = async (messageContent) => {
    const tempMessage = {
      content: messageContent,
      senderName: currentUser.fullName,
      senderId: currentUser.userId,
      createdAt: new Date().toISOString().substring(0, 19),
      tempId: Math.random().toString(36).substring(2), // ID tạm thời
    };
  
    setMessages((prev) => [...prev, tempMessage]);
  
    try {
      await sendMessage(`/app/chat/${currentChat.roomId}`, {
        senderId: currentUser.userId,
        content: messageContent,
      });
  
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempMessage.tempId ? { ...tempMessage, tempId: null } : msg
        )
      );
  
      handleChatRoomChange(currentChat.roomId, {
        lastMessage: tempMessage,
        lastModifiedAt: tempMessage.createdAt,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, isSending: false, error: true } : msg
        )
      );
    }
  };
  

  return (
    <div className="lg:col-span-2 lg:block">
      <div className="w-full">
        <div className="p-3 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <Contact chatRoom={currentChat} currentUser={currentUser} />
        </div>

        <div className="relative w-full p-6 overflow-y-auto h-[30rem] bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <ul className="space-y-2">
            {messages.map((message, index) => (
              <div key={index} ref={scrollRef}>
                <Message
                  currentRoom={currentChat}
                  message={{
                    ...message,
                    isSending: !!message.tempId,
                  }}
                  self={currentUser.userId}
                />
              </div>
            ))}
          </ul>
        </div>

        <ChatForm handleFormSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
