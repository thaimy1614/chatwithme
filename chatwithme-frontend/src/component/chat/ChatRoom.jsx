import { useState, useEffect, useRef, useCallback } from "react";

import {
  getMessagesOfChatRoom,
  searchMessage,
  sendMessage,
  subscribeToTopic,
} from "../../services/ChatService";
import { debounce } from "lodash";
import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";
import RoomHeader from "./RoomHeader";
import { convertDateTimeZone } from "../../utils/DateTimeZone";

export default function ChatRoom({
  currentChat,
  currentUser,
  socket,
  handleChatRoomChange,
}) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const searchInputRef = useRef(null);
  // const messagesEndRef = useRef(null);
  const scrollRef = useRef();

  useEffect(() => {
    let subscription;

    const setupSubscription = async () => {
      subscription = await subscribeToTopic(
        `/user/${currentUser.userId}/chat`,
        (message) => {
          if (currentChat?.roomId === message.roomId) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
          handleChatRoomChange(message.roomId, {
            lastMessage: message,
            lastModifiedAt: message.createdAt,
          });
        }
      );
    };
    setSearchQuery("");
    setSearchResults([]);
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
      tempId: Math.random().toString(36).substring(2),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      await sendMessage(`/app/chat/${currentChat.roomId}`, {
        senderId: currentUser.userId,
        content: messageContent,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempMessage.tempId
            ? { ...tempMessage, tempId: null }
            : msg
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

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(e.target.value);
    debounceSearch(query);
  };

  const debounceSearch = useCallback(
    debounce(async (query) => {
      if (query === "") {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchMessage(currentChat.roomId, query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 1000),
    [currentChat.roomId]
  );

  const handleSearchClick = (messageId) => {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      const originalBackgroundColor = element.style.backgroundColor;
      element.style.transition = "background-color 2s ease";
      element.style.backgroundColor = "yellow";
      setTimeout(() => {
        element.style.backgroundColor = originalBackgroundColor;
      }, 2000);
    }
  };

  return (
    <div
      className={`flex h-full ${
        showSearchBar ? "lg:grid lg:grid-cols-[3fr_1fr]" : ""
      }`}
    >
      <div className="flex flex-col w-full bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="p-3 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <RoomHeader
            setShowSearchBar={setShowSearchBar}
            chatRoom={currentChat}
            currentUser={currentUser}
            showSearchBar={showSearchBar}
          />
        </div>
        <div className="relative w-full flex-grow h-[30rem] overflow-y-auto p-6 bg-white dark:bg-gray-900">
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

        {/* Form gửi tin nhắn */}
        <ChatForm handleFormSubmit={handleFormSubmit} />
      </div>

      {/* Khu vực tìm kiếm */}
      {showSearchBar && (
        <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap flex flex-col w-full bg-gray-100 dark:bg-gray-800">
          {/* Thanh tìm kiếm */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Tìm kiếm tin nhắn..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {isSearching && (
              <p className="text-sm text-gray-500">Đang tìm...</p>
            )}
          </div>

          {/* Kết quả tìm kiếm */}
          <div className="h-[30rem] flex-grow overflow-y-auto p-2">
            {searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((result) => (
                  <li
                    key={result.id}
                    className="p-2 border rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => handleSearchClick(result.id)}
                  >
                    <p className="dark:text-blue-500">
                      <strong className="dark:text-blue-400">
                        {result.senderName}:
                      </strong>{" "}
                      <span className="block overflow-hidden text-ellipsis whitespace-nowrap line-clamp-2">
                        {result.content}
                      </span>
                    </p>
                    <small className="text-sm text-gray-500 dark:text-white">
                      {convertDateTimeZone(result.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                      {convertDateTimeZone(result.createdAt).toLocaleTimeString(
                        "vi-VN"
                      )}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-white">
                Không có kết quả nào
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
