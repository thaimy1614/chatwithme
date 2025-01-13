import React from "react";

export const createPeerConnection = (onIceCandidate) => {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            onIceCandidate(event.candidate);
        }
    };

    return peerConnection;
};
