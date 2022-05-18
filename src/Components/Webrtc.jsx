import React, {useEffect, useContext, useState} from 'react';
import {WebrtcContext} from '../Context/WebrtcContext/webrtc-context';
import {Button, Checkbox, Grid, TextField} from '@mui/material'
import { processAnswerRecieved, createOffer,SingeltonPeer, sendOffer, playVideo, sendCanidates} from '../scripts/webrtc-create-offer';
import { styled } from '@mui/material/styles';

function Webrtc(props) {

    const {offer, setOffer, isVideo, setIsVideo, peerConnection, setPeerConnection, userId, setUsedId, iceCanidates, setIceCanidates} = useContext(WebrtcContext)
    const [showOffer,
        setShowOffer] = useState(false);
    const [status, setStatus] = useState('');
    const [answer, setAnswer] = useState('');

    // useEffect(() => {
    //     console.log("peerConnection use effect")
    //     console.log(peerConnection)
    //     peerConnection.ontrack = (event) => {
    //         console.log("Got track event", event);
    //         let video = document.createElement("video");
    //         video.srcObject = event.streams[0];
    //         video.autoplay = true;
    //         video.width = "500";
    //         let label = document.createElement("div");
    //         label.textContent = event.streams[0].id;
    //         document.getElementById("serverVideos").appendChild(label);
    //         document.getElementById("serverVideos").appendChild(video);
    //     };
    // },[peerConnection])

    async function clickOfferHandler(event) {
        event.preventDefault();
        setPeerConnection(SingeltonPeer.getInstance())
        let offerRet = await createOffer(isVideo, status, setStatus, iceCanidates, setIceCanidates)
        let pc = offerRet[0]
        const offerCreated = offerRet[1]
        setOffer(offerCreated)
        const answerBody = await sendOffer(offerCreated)
        setUsedId(answerBody.data.user_id)
        setAnswer(answerBody.data.answer)
        pc = await processAnswerRecieved(answerBody.data.answer, pc)

        setPeerConnection(pc)
    }

    async function clickPlayHandler(event){
        event.preventDefault();
        const user_id = userId
        const playResponseJson = await playVideo(user_id)
        console.log(playResponseJson)
    }

    async function clickSendIceCanidatesHandler(event){
        event.preventDefault();
        const user_id = userId;
        console.log("iceCanidates, user_id")
        console.log(iceCanidates, user_id)
        const canidatesResponse = await sendCanidates(iceCanidates, user_id)
        console.log(canidatesResponse)
        let pc = peerConnection
        if (canidatesResponse.status == "successful"){
            for(let i = 0; i < canidatesResponse.ice_canidates.length; i++){
                pc.addIceCandidate(canidatesResponse.ice_canidates[i]);
            }
        }
        setPeerConnection(pc)
    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
      }));

    return (
        <div style={{
            marginTop: '50px'
        }}>
            <Grid container spacing={2} justify="center" textAlign="center" align="center">
                {/* Row 1 */}
                <Grid item xs={3}/>
                <Grid item xs={3}>
                    <p>Is Video Recieve on?</p>
                </Grid>
                <Grid item xs={3}>
                    <Checkbox
                        onChange={(event) => {
                        setIsVideo(event.target.checked)
                    }}/>
                </Grid>
                <Grid item xs={3}/>
                {/* Row 2 */}
                <Grid item xs={3}/>
                <Grid item xs={3}>
                    <p>Show/Hide offer</p>
                </Grid>
                <Grid item xs={3}>
                    <Checkbox
                        onChange={(event) => {
                        setShowOffer(event.target.checked)
                    }}/>
                </Grid>
                <Grid item xs={3}/>
                {/* Row 3 */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        onClick={async(event) => {
                        await clickOfferHandler(event)
                    }}>Creat Offer</Button>
                </Grid>
                {/* Row 4 */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        onClick={async(event) => {
                        await clickSendIceCanidatesHandler(event)
                    }}>Send Ice Canidates</Button>
                </Grid>
                {/* Row 5 */}
                <Grid item xs={2}/>
                {showOffer
                    ? <Grid item xs={8}>
                            <TextField
                                style={{'width':'100%'}}
                                label="Offer"
                                disabled={true}
                                value={offer.sdp}
                                multiline
                                rows={8}
                                defaultValue="Offer"/>
                        </Grid>
                    : <Grid item xs={8}/>
                }
                <Grid item xs={2}/>
                {/* Row 6 */}
                <Grid item xs={2} />
                    {answer.sdp ?
                        <Grid item xs={8}>
                        <TextField
                        style={{'width':'100%'}}
                        label="Answer"
                        disabled={true}
                        value={answer.sdp}
                        multiline
                        rows={8}
                        defaultValue="Offer"/>
                        </Grid>
                        : <Grid item xs={8} />}
                <Grid item xs={2} />
                {/* Row 7 */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        onClick={async(event) => {
                        await clickPlayHandler(event)
                    }}>Play Video</Button>
                </Grid>
                {/* Row 8 */}
                <Grid item xs={12}>
                    <div id="serverVideos">
                        Video from server
                        <br />
                        <video id="webrtc-video" ></video>
                    </div>
                </Grid>
                {/* Row 8 */}
            </Grid>
        </div>
    );
}

export default Webrtc;