import { useState, useEffect } from "react";

import { getUser } from "../../services/ChatService";
import UserLayout from "../layouts/UserLayout";

export default function Contact({ chatRoom, onlineUsersId, currentUser }) {
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
        lastMessage: chatRoom.lastMessage?chatRoom.lastMessage:null,
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
          lastMessage: chatRoom.lastMessage?chatRoom.lastMessage:null,
          lastModifiedAt: chatRoom.lastModifiedAt,
        });
      };

      fetchData();
    }
  }, [chatRoom, currentUser]);

  return (
    <UserLayout
      user={contact}
      // onlineUsersId={onlineUsersId}
    />
  );
}
