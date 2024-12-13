import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const PAGE_SIZE = 10;

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  // Fetch danh sách phòng chat
  const fetchRooms = async (currentPage) => {
    try {
      const response = await axios.get(`/api/rooms?page=${currentPage}&size=${PAGE_SIZE}`);
      if (response.data.content.length > 0) {
        setRooms((prevRooms) => [...prevRooms, ...response.data.content]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms(page);
  }, [page]);

  // IntersectionObserver để theo dõi khi người dùng scroll đến loader
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore]);

  return (
    <div>
      <h2>Danh Sách Phòng Chat</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.roomId}>
            {room.name} - {new Date(room.lastMessageTime).toLocaleString()}
          </li>
        ))}
      </ul>
      {hasMore && <div ref={loader} style={{ height: "20px", margin: "10px", textAlign: "center" }}>Đang tải...</div>}
    </div>
  );
};

export default ChatRoomList;
