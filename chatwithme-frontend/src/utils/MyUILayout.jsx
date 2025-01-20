import React, { useEffect, useState } from "react";
import {
  CallingState,
  ParticipantView,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { getIoStreamToken } from "../services/localStorageService";
import { useUser } from "../context/UserContext";

export const MyUILayout = ({
  currentRoom,
}) => {
  const { currentUser } = useUser();
  const [client, setClient] = useState(null);
  const [myCall, setMyCall] = useState(null);

  // Initialize StreamVideoClient and call instance
  useEffect(() => {
    const apiKey = import.meta.env.VITE_IO_STREAM_KEY;
    const token = getIoStreamToken();

    const user = {
      id: currentUser.userId,
      name: currentUser.fullName,
      image: currentUser.photoUrl || "/assets/images/logo.png",
    };

    const streamClient = new StreamVideoClient({ apiKey, user, token });
    const callInstance = streamClient.call("default", currentRoom);

    callInstance.join({ create: true });

    setClient(streamClient);
    setMyCall(callInstance);

    return () => {
      callInstance.leave();
      streamClient.disconnectUser();
    };
  }, [currentRoom, currentUser]);

  if (!client || !myCall) {
    return <div>Loading...</div>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={myCall}>
        <StreamTheme style={{ position: "relative" }}>
          <MyParticipants />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export const MyParticipants = () => {
  const {
    useCallCallingState,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return <div>Joining the call...</div>;
  }

  return (
    <>
      <MyParticipantList participants={remoteParticipants} />
      <MyFloatingLocalParticipant participant={localParticipant} />
    </>
  );
};

export const MyParticipantList = ({ participants }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        width: "100vw",
      }}
    >
      {participants.map((participant) => (
        <div
          key={participant.sessionId}
          style={{
            width: "100%",
            aspectRatio: "3 / 2",
          }}
        >
          <ParticipantView participant={participant} />
        </div>
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = ({ participant }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "15px",
        left: "15px",
        width: "240px",
        height: "135px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px 3px",
        borderRadius: "12px",
      }}
    >
      {participant && <ParticipantView participant={participant} />}
    </div>
  );
};
