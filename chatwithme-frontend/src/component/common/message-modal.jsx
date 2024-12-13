// eslint-disable 
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grow,
} from "@mui/material";

const MessageModal = ({ message, open, handleClose, messageType }) => {
  const isSuccess = messageType;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Grow}
      transitionDuration={500}
      sx={{
        zIndex: 2000,
        "& .MuiDialog-paper": {
          borderRadius: "16px", // Rounded corners
          padding: "16px",
          backgroundColor: isSuccess ? "#e0ffe0" : "#ffe0e0", // Soft green for success, soft red for fail
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)", // Elegant shadow
          transition: "all 0.3s ease-in-out", // Smooth transition for the modal
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Custom backdrop color
          transition: "opacity 0.5s ease-in-out", // Smooth backdrop transition
        },
      }}
    >
      <DialogTitle
        sx={{
          color: isSuccess ? "green" : "red",
          fontWeight: "bold",
          fontSize: "1.5rem",
          textAlign: "center",
        }}
      >
        {isSuccess ? "Thành công!" : "Thất bại!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: isSuccess ? "green" : "red",
            fontSize: "1.2rem",
            textAlign: "center",
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: isSuccess ? "green" : "red",
            "&:hover": {
              backgroundColor: isSuccess ? "darkgreen" : "darkred",
            },
            borderRadius: "8px",
            padding: "10px 20px",
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageModal;
