// export const createAnswer = async function (peerConnection, offer) {
//   peerConnection.addEventListener(
//     "icegatheringstatechange",
//     function () {
//       var statusHolder = status;
//       setStatus(
//         statusHolder + " -> " + peerConnection.iceGatheringState + "\n"
//       );
//     },
//     false
//   );

//   peerConnection.oniceconnectionstatechange = (e) =>
//     log(peerConnection.iceConnectionState);
//   peerConnection.onicecandidate = (event) => {
//     // console.log(event)
//     if (event.candidate !== null) {
//       console.log(event)
//     }
//   };

//   peerConnection.addEventListener(
//     "iceconnectionstatechange",
//     function () {
//       var statusHolder = status;
//       setStatus(
//         statusHolder + " -> " + peerConnection.iceConnectionState + "\n"
//       );
//     },
//     false
//   );

//   peerConnection.addEventListener(
//     "signalingstatechange",
//     function () {
//       var statusHolder = status;
//       setStatus(statusHolder + " -> " + peerConnection.signalingState + "\n");
//     },
//     false
//   );

//   peerConnection.addTransceiver("video", { direction: "recvonly" });
//   peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

//   answer = peerConnection.createAnswer();

//   return answer;
// };

// export const getOffer = async function (status, setStatus) {
//   const offerResponse = await fetch("http://localhost:3001/webrtc/get-offer", {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: "GET",
//   });
//   return offerResponse.json();
// };
