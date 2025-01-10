import { useState, useEffect } from "react";

import { getUser } from "../../services/ChatService";
import { useUser } from "../../context/UserContext";
import { convertDateTimeZone } from "../../utils/DateTimeZone";
import { SearchCircleIcon } from "@heroicons/react/solid";

function UserHeader({ room, onlineUsersId, setShowSearchBar, showSearchBar }) {
  const { currentUser } = useUser();
  return (
    <div className="relative flex items-center w-full">
      <img
        className="w-10 h-10 rounded-full flex-shrink-0"
        src={room && room.photoURL ? room.photoURL : "/assets/images/logo.png"}
        alt="Avatar"
      />
      <div className="ml-2 flex-1">
        {/* Tên người dùng */}
        <span className="block text-gray-500 dark:text-gray-400 truncate">
          {room.fullName}
        </span>
      </div>
      <SearchCircleIcon
        className="h-8 w-8 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setShowSearchBar(!showSearchBar);
        }}
      >
      </SearchCircleIcon>
      {/* {onlineUsersId?.includes(user?.userId) ? (
          <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-500 dark:bg-green-400 border-2 border-white rounded-full"></span>
        ) : (
          <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-gray-400 border-2 border-white rounded-full"></span>
        )} */}
    </div>
  );
}

export default function RoomHeader({
  chatRoom,
  onlineUsersId,
  currentUser,
  setShowSearchBar,
  showSearchBar,
}) {
  const [contact, setContact] = useState({
    lastMessage: {
      content: "",
      senderName: "",
      roomId: "",
    },
    fullName: "",
    photoURL: "",
  });

  useEffect(() => {
    if (chatRoom.group) {
      setContact({
        group: true,
        fullName: chatRoom.name,
        photoURL: "/assets/images/logo.png",
        lastMessage: chatRoom.lastMessage ? chatRoom.lastMessage : null,
        lastModifiedAt: chatRoom.lastModifiedAt,
      });
    } else {
      const contactId = chatRoom.members?.find(
        (member) => member !== currentUser.userId
      );

      const fetchData = async () => {
        const res = await getUser(contactId);
        setContact({
          group: false,
          fullName: res.fullName,
          photoURL: res.photoURL,
          lastMessage: chatRoom.lastMessage ? chatRoom.lastMessage : null,
          lastModifiedAt: chatRoom.lastModifiedAt,
        });
      };

      fetchData();
    }
  }, [chatRoom, currentUser]);

  return (
    <UserHeader
      room={contact}
      setShowSearchBar={setShowSearchBar}
      showSearchBar={showSearchBar}
      // onlineUsersId={onlineUsersId}
    />
  );
}
