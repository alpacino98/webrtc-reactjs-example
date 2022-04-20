import React, { createContext, useState } from "react";

export const WebrtcContext = createContext();

export function WebrtcProvider(props) {
  // useEffect(() => {     navigator.mediaDevices.getUserMedia({ video: true,
  // audio: true })       .then((currentStream) => {
  // setStream(currentStream);         myVideo.current.srcObject = currentStream;
  //      });   }, []);

  const [isVideo, setIsVideo] = useState(false);
  const [offer, setOffer] = useState("");
  const [answer, setAnswer] = useState("");
  const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection());

  return (
    <WebrtcContext.Provider
      value={{
        offer,
        setOffer,
        answer,
        setAnswer,
        isVideo,
        setIsVideo,
        peerConnection,
        setPeerConnection,
      }}
    >
      {props.children}
    </WebrtcContext.Provider>
  );
}
