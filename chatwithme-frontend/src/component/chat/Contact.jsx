import { useState, useEffect } from "react";

import { getUser } from "../../services/ChatService";
import UserLayout from "../layouts/UserLayout";

export default function Contact({ chatRoom, onlineUsersId, currentUser }) {
  const [contact, setContact] = useState("");

  useEffect(() => {
    console.log(chatRoom);
    if (chatRoom.group) {
      setContact(chatRoom.name);
    } else {
      const contactId = chatRoom.members?.find(
        (member) => member !== currentUser.userId
      );

      const fetchData = async () => {
        const res = await getUser(contactId);
        setContact(res.fullName);
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
