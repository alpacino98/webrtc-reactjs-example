import { ConstructionOutlined } from "@mui/icons-material";

export const createOffer = async function (
  isVideo,
  status,
  setStatus,
  iceCanidates,
  setIceCanidates
) {
  let pc = SingeltonPeer.getInstance();

  const offerOptions = {
    offerToReceiveAudio: 0,
    offerToReceiveVideo: 1,
  };

  let negotiating = false;
  pc.onnegotiationneeded = async (e) => {
    try {
      if (negotiating || pc.signalingState != "stable") return;
      negotiating = true;
      /* Your async/await-using code goes here */
    } finally {
      negotiating = false;
    }
  };

  pc.addEventListener(
    "icegatheringstatechange",
    function () {
      var statusHolder = status;
      setStatus(statusHolder + " -> " + pc.iceGatheringState + "\n");
    },
    false
  );

  pc.oniceconnectionstatechange = (e) => console.log(pc.iceConnectionState);

  pc.onicecandidate = (event) => {
    if (event.candidate !== null) {
      console.log(event.candidate);
      let iceHolder = iceCanidates;
      iceHolder.push(event.candidate);
      setIceCanidates([...iceHolder]);
    }
  };

  pc.addEventListener(
    "signalingstatechange",
    function () {
      var statusHolder = status;
      console.log(" -> " + pc.signalingState + "\n");
    },
    false
  );

  pc.addTransceiver("video", { direction: "recvonly" });

  let offer;

  try {
    offer = await pc.createOffer(offerOptions);
    await pc.setLocalDescription(offer);
    await new Promise(function (resolve) {
      if (pc.iceGatheringState === "complete") {
        resolve();
      } else {
        function checkState() {
          if (pc.iceGatheringState === "complete") {
            pc.removeEventListener("icegatheringstatechange", checkState);
            resolve();
          }
        }
        pc.addEventListener("icegatheringstatechange", checkState);
      }
    });
  } catch (e) {
    console.log(`Failed to create offer: ${e}`);
  }

  pc.onicecanidate = (event) => {
    console.log(event.canidate);
  };

  return [pc, offer];
};

export const sendOffer = async function (offer) {
  const offerResponse = await fetch("http://localhost:3001/webrtc/offer", {
    body: JSON.stringify({
      sdp: offer.sdp,
      type: offer.type,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  return offerResponse.json();
};

export const sendCanidates = async function (canidates, user_id) {
  const canidatesResponse = await fetch(
    "http://localhost:3001/webrtc/register-icecanidates",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ice_canidates: canidates,
        user_id: user_id,
      }),
      method: "POST",
    }
  );

  return canidatesResponse.json();
};

export const playVideo = async function (user_id) {
  const playResponse = await fetch("http://localhost:3001/webrtc/play", {
    body: JSON.stringify({
      id: user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  return playResponse.json();
};

export const processAnswerRecieved = async function (answer, peerConnection) {
  const answerDescription = new RTCSessionDescription(answer);
  console.log("answerDescription");
  console.log(answerDescription);
  let videoElement = document.getElementById("webrtc-video");
  let remoteStream = new MediaStream();

  peerConnection.setRemoteDescription(answerDescription);

  peerConnection.ontrack = (event) => {
    console.log("Got track event", event);
    event.streams[0].getTracks().forEach((track) => {
      console.log("Track");
      console.log(track);
      remoteStream.addTrack(track);
    });
  };

  videoElement.srcObject = remoteStream;
  videoElement.autoplay = true;
  videoElement.width = "500";

  return peerConnection;
};

export const SingeltonPeer = (function () {
  var instance;

  function createInstance() {
    var config = {
      sdpSemantics: "unified-plan",
    };
    config.iceServers = [{ urls: ["stun:stun.l.google.com:19302"] }];
    var object = new RTCPeerConnection(config);
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      // return instance;
      return createInstance();
    },
  };
})();
