import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <>
      <Box
        sx={{
          position: "fixed", // Fix position to overlay other elements
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <CircularProgress style={{ color: "red" }}></CircularProgress>
        <Typography style={{ color: "red", fontSize: "30px" }}>Đang tải...</Typography>
      </Box>
    </>
  );
};

export default Loading;
