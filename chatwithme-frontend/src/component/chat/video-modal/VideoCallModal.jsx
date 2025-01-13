import React, { useEffect, useRef, useState } from "react";
import "./VideoCallModal.css";
import { getSocket, subscribeToTopic, subscribeVideoCall } from "../../../services/ChatService";

const VideoCallModal = ({
  isOpen,
  onClose,
  onAccept,
  callerName,
  isCaller,
  roomId,
  callerId
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);  
  const peerConnection = useRef(null);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const stompClient = getSocket();

  useEffect(() => {
    if (!isOpen) return;

    subscribeVideoCall(``);

    // Configure STUN/TURN servers
    const config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    };

    // Initialize PeerConnection
    peerConnection.current = new RTCPeerConnection(config);

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        stompClient.send(
          `/app/call/signaling/${roomId}`,
          {},
          JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
            callerId: callerId,
                callerName: callerName
          })
        );
      }
    };

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle local stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) =>
          peerConnection.current.addTrack(track, stream)
        );

        if (isCaller) {
          // Create offer
          peerConnection.current.createOffer()
            .then((offer) => {
              return peerConnection.current.setLocalDescription(offer);
            })
            .then(() => {
              stompClient.send(
                `/app/call/request/${roomId}`,
                {},
                JSON.stringify({
                  type: "offer",
                  signalingMessage: {
                    type: "offer",
                    offer: peerConnection.current.localDescription,
                    answer: null,
                    candidate: null,
                  }, 
                  callerId: callerId,
                callerName: callerName
                })
              );
            });
        }
      })
      .catch((error) => console.error("Error accessing media devices:", error));

      if(isCaller){
        setIsCallStarted(true)
      }

      return () => {
        if (peerConnection.current) {
          peerConnection.current.close();
          peerConnection.current = null;
        }
      };
  }, [isOpen, isCaller, roomId, stompClient]);

  const handleAcceptCall = () => {
    setIsCallStarted(true);
    onAccept();

    stompClient.subscribe(`/user/${roomId}/queue/call/signaling`, (message) => {
      const data = JSON.parse(message.body);

      if (data.type === "offer") {
        peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.signalingMessage));
        peerConnection.current.createAnswer()
          .then((answer) => {
            return peerConnection.current.setLocalDescription(answer);
          })
          .then(() => {
            stompClient.send(
              `/app/call/signaling/${roomId}`,
              {},
              JSON.stringify({
                type: "answer",
                signalingMessage: {
                  type: "answer",
                  answer: peerConnection.current.localDescription,
                  offer: null,
                  candidate: null,
                }, 
                callerId: callerId,
                callerName: callerName
              })
            );
          });
      } else if (data.type === "candidate") {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

  };

  const handleEndCall = () => {
    peerConnection.current.close();
    peerConnection.current = null;
    onClose();
  };

  return (
    <div className={`video-call-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        {isCallStarted ? (
          <>
            <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
            <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            <button className="end-call-btn" onClick={handleEndCall}>End Call</button>
          </>
        ) : (
          <>
            <p>{callerName} is calling...</p>
            <button className="accept-call-btn" onClick={handleAcceptCall}>Accept</button>
            <button className="reject-call-btn" onClick={handleEndCall}>Reject</button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;
