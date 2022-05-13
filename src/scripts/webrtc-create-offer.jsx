export const createAnswer = async function(peerConnection, offer){
  peerConnection.addEventListener(
    "icegatheringstatechange",
    function () {
      var statusHolder = status;
      setStatus(statusHolder + " -> " + peerConnection.iceGatheringState + "\n");
    },
    false
  );

  peerConnection.oniceconnectionstatechange = (e) => log(peerConnection.iceConnectionState);
  peerConnection.onicecandidate = (event) => {
    // console.log(event)
    if (event.candidate === null) {
    }
  };

  peerConnection.addEventListener(
    "iceconnectionstatechange",
    function () {
      var statusHolder = status;
      setStatus(statusHolder + " -> " + peerConnection.iceConnectionState + "\n");
    },
    false
  );

  peerConnection.addEventListener(
    "signalingstatechange",
    function () {
      var statusHolder = status;
      setStatus(statusHolder + " -> " + peerConnection.signalingState + "\n");
    },
    false
  );

  peerConnection.addTransceiver("video", { direction: "recvonly" });
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  answer = peerConnection.createAnswer()

  return answer

}

export const getOffer = async function(status, setStatus) {
  const offerResponse = await fetch("http://localhost:3001/webrtc/get-offer", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return offerResponse.json();
}

export const createOffer = async function (isVideo, status, setStatus) {
  let pc = SingeltonPeer.getInstance();

  const offerOptions = {
    offerToReceiveAudio: 0,
    offerToReceiveVideo: isVideo ? 1 : 0,
  };

  // let negotiating = false;
  // pc.onnegotiationneeded = async e => {
  //   try {
  //     if (negotiating || pc.signalingState != "stable") return;
  //     negotiating = true;
  //     /* Your async/await-using code goes here */
  //   } finally {
  //     negotiating = false;
  //   }
  // }

  pc.addEventListener(
    "icegatheringstatechange",
    function () {
      var statusHolder = status;
      setStatus(statusHolder + " -> " + pc.iceGatheringState + "\n");
    },
    false
  );

  pc.oniceconnectionstatechange = (e) => log(pc.iceConnectionState);
  pc.onicecandidate = (event) => {
    // console.log(event)
    if (event.candidate === null) {
      pc.addIceCandidate(event.candidate)
    }
  };

  pc.addEventListener(
    "iceconnectionstatechange",
    function () {
      var statusHolder = status;
      setStatus(statusHolder + " -> " + pc.iceConnectionState + "\n");
    },
    false
  );

  pc.addEventListener(
    "signalingstatechange",
    function () {
      var statusHolder = status;
      setStatus(statusHolder + " -> " + pc.signalingState + "\n");
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

  return [pc, offer]
};

export const processAnswer = async function (offer) {
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

export const setAnswerRecieved = async function(answer, peerConnection) {
  const answerDescription = new RTCSessionDescription(answer)
  peerConnection.setRemoteDescription(answerDescription)

  peerConnection.ontrack = (event) => {
    console.log("Got track event", event);
    let video = document.createElement("video");
    video.srcObject = event.streams[0];
    video.autoplay = true;
    video.width = "500";
    let label = document.createElement("div");
    label.textContent = event.streams[0].id;
    document.getElementById("serverVideos").appendChild(label);
    document.getElementById("serverVideos").appendChild(video);
  };
}

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
