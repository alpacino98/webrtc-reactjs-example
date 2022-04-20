export const createOffer = async function (
  isVideo,
  setOffer,
  status,
  setStatus,
  peerConnection
) {
  const numRequestedAudioTracks = parseInt(1);

  for (let i = 0; i < numRequestedAudioTracks; i++) {
    const acx = new AudioContext();
    const dst = acx.createMediaStreamDestination();

    const track = dst.stream.getTracks()[0];
    peerConnection.addTrack(track, dst.stream);
  }

  const offerOptions = {
    offerToReceiveAudio: 0,
    offerToReceiveVideo: isVideo ? 1 : 0,
    iceRestart: true,
    voiceActivityDetection: false,
  };

  peerConnection.addEventListener(
    "icegatheringstatechange",
    function () {
      var statusHolder = status;
      setStatus(
        statusHolder + " -> " + peerConnection.iceGatheringState + "\n"
      );
    },
    false
  );

  peerConnection.addEventListener(
    "iceconnectionstatechange",
    function () {
      var statusHolder = status;
      setStatus(
        statusHolder + " -> " + peerConnection.iceConnectionState + "\n"
      );
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

  peerConnection.addTransceiver('video', {'direction': 'recvonly'})

  try {
    const offer = await peerConnection.createOffer(offerOptions);
    await peerConnection.setLocalDescription(offer)
    await new Promise(function(resolve) {
            if (peerConnection.iceGatheringState === 'complete') {
                resolve();
            } else {
                function checkState() {
                    if (peerConnection.iceGatheringState === 'complete') {
                        peerConnection.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                }
                peerConnection.addEventListener('icegatheringstatechange', checkState);
            }
        });
    setOffer(offer);
  } catch (e) {
    console.log(`Failed to create offer: ${e}`);
  }
  return peerConnection;
};

export const processAnswer = async function (offer) {
    console.log(offer)
  const offerResponse = await fetch("http://localhost:3001/webrtc/offer", {
    body: JSON.stringify({
      "sdp": offer.sdp,
      "type": offer.type,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  return offerResponse.body;
};

export const SingeltonPeer = (function () {
  var instance;

  function createInstance() {
    var config = {
        sdpSemantics: 'unified-plan'
    };
    config.iceServers = [{urls: ['stun:stun.l.google.com:19302']}];
    var object = new RTCPeerConnection(config);
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
