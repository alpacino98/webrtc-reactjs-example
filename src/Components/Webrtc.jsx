import React, {useEffect, useContext, useState} from 'react';
import {WebrtcContext} from '../Context/WebrtcContext/webrtc-context';
import {Button, Checkbox, Grid, TextField} from '@mui/material'
import { createAnswer, getOffer, createOffer,SingeltonPeer, processAnswer} from '../scripts/webrtc-create-offer';
import { styled } from '@mui/material/styles';

function Webrtc(props) {

    const {offer, setOffer, isVideo, setIsVideo, peerConnection, setPeerConnection, userId, setUsedId} = useContext(WebrtcContext)
    const [showOffer,
        setShowOffer] = useState(false);
    const [status, setStatus] = useState('');
    const [answer, setAnswer] = useState('');

    useEffect(() => {
    },[])

    async function clickAnswerCreate(event){
        event.preventDefault();

        const offerResp = await createAnswer(peerConnection, offer, setOffer, setPeerConnection)
        setOffer(offerResp)
    }

    async function clickHandlerGetOffer(event) {
        event.preventDefault();
        // setPeerConnection(SingeltonPeer.getInstance())
        // let pc, offerCreated
        const offerResp = await getOffer(isVideo, status, setStatus)
        console.log(offerResp.client_id)
        // setPeerConnection(pc)
        setOffer(offerResp)
        // console.log(offerCreated)
        // const answerBody = await processAnswer(offerCreated)
        // setAnswer(answerBody)
    }

    async function clickOfferHandler(event) {
        event.preventDefault();
        setPeerConnection(SingeltonPeer.getInstance())
        let offerRet = await createOffer(isVideo, status, setStatus)
        const pc = offerRet[0]
        const offerCreated = offerRet[1]

        setPeerConnection(pc)
        setOffer(offerCreated)
        const answerBody = await processAnswer(offerCreated)
        console.log(answerBody)
        setAnswer(answerBody)
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
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        onClick={async(event) => {
                        await clickOfferHandler(event)
                    }}>Creat Offer</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        onClick={async(event) => {
                        await clickHandlerGetOffer(event)
                    }}>Get Offer</Button>
                </Grid>
                <Grid item xs={2}/> {showOffer
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
                    : <Grid item xs={2}/>
                }
                <Grid item xs={3}/>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={4}>
                    {/* <Div>{answer}</Div> */}
                </Grid>
                <Grid item xs={4}>
                </Grid>
            </Grid>
        </div>
    );
}

export default Webrtc;