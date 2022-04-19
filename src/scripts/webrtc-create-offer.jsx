export const createOffer = async function (isVideo, setOffer) {
    const peerConnection = window.peerConnection = new RTCPeerConnection(null);
    const numRequestedAudioTracks = parseInt(1);

    for (let i = 0; i < numRequestedAudioTracks; i++) {
        const acx = new AudioContext();
        const dst = acx.createMediaStreamDestination();

        const track = dst
            .stream
            .getTracks()[0];
        peerConnection.addTrack(track, dst.stream);
    }

    const offerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: (isVideo)
            ? 1
            : 0,
        iceRestart: true,
        voiceActivityDetection: false
    };

    try {
        const offer = await peerConnection.createOffer(offerOptions);
        await peerConnection.setLocalDescription(offer);
        setOffer(offer.sdp);
    } catch (e) {
        console.log(`Failed to create offer: ${e}`);
    }
}

export const setAnswer = async function(){
    
}