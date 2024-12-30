import { useState, useEffect, useRef } from "react";

import { getMessagesOfChatRoom, sendMessage, subscribeToTopic } from "../../services/ChatService";

import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({ currentChat, currentUser, socket, handleChatRoomChange }) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [participants, setParticipants] = useState([]);
  const scrollRef = useRef();

  useEffect(()=> {
    subscribeToTopic(`/user/${currentUser.userId}/chat`, (message)=>{
      setMessages((prevMessages) => [...prevMessages, message]);
      handleChatRoomChange(message.roomId, {lastMessage: message, lastModifiedAt: message.createdAt});
    });
  }, [])

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

  const handleFormSubmit = async (message) => {
    sendMessage(`/app/chat/${currentChat.roomId}`, {
      senderId: currentUser.userId,
      // media: media,
      content: message,
    })
    // const res = await sendMessage(messageBody);
    // setMessages([...messages, message]);
    
    const messageToSave = {
      content: message,
      senderName: currentUser.fullName,
      senderId: currentUser.userId,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, messageToSave]);
    handleChatRoomChange(currentChat.roomId, {lastMessage: messageToSave, lastModifiedAt: messageToSave.createdAt});
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
                <Message currentRoom={currentChat} message={message} self={currentUser.userId} />
              </div>
            ))}
          </ul>
        </div>

        <ChatForm handleFormSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}