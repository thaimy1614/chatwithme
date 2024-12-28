import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getCurrentRoom } from "../services/localStorageService";
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";

const PAGE_SIZE = 5;

const ChatRoomList = ({rooms, setRooms, currentRoom, setCurrentRoom, page, setPage}) => {
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchRooms = async (currentPage) => {
    try {
      const response = await axios.get(
        `/room/my-rooms?page=${currentPage}&size=${PAGE_SIZE}`
      );
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
    <Box
      width="30%"
      bgcolor="#1e1e2e"
      color="white"
      overflow="auto"
      sx={{
        height: 500, // Chiều cao cố định
        overflowY: "auto", // Cho phép cuộn nếu danh sách dài
        borderRadius: 2,
        boxShadow: 3,
        padding: 2, // Thêm padding để không gian rộng rãi hơn
      }}
    >
      {rooms.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Không có đứa nào để hiển thị, tìm kiếm bên trên :v.
        </Typography>
      ) : (
        <List>
          {rooms.map((room) => (
            <ListItem
              key={room.roomId}
              button
              selected={currentRoom === room.roomId}
              onClick={() => setCurrentRoom(room.roomId)}
              sx={{
                backgroundColor: currentRoom === room.roomId ? "primary.main" : "transparent",
                color: currentRoom === room.roomId ? "white" : "black",
                marginBottom: 1,
                borderRadius: 1,
                padding: 1.5, // Tăng padding để phần tử nhìn thoải mái hơn
                '&:hover': {
                  backgroundColor: "primary.light", // Hiệu ứng hover
                },
              }}
            >
              <ListItemAvatar>
                <Avatar src="/assets/images/logo.png" />
              </ListItemAvatar>
              <ListItemText
                primary={room.name}
                sx={{ fontWeight: "bold", color: currentRoom === room.roomId ? "white" : "black" }}
              />
              <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
            </ListItem>
          ))}
        </List>
      )}
      {hasMore && (
        <div ref={loader} className="text-center my-2">
          Từ từ, đang tải thêm...
        </div>
      )}
    </Box>
  );
  
};

export default ChatRoomList;
