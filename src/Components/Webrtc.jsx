import React, {Component, useContext, useState} from 'react';
import {WebrtcContext} from '../Context/WebrtcContext/webrtc-context';
import {Button, Checkbox, Grid, TextField} from '@mui/material'
import {createOffer} from '../scripts/webrtc-create-offer';

function Webrtc(props) {

    const {offer, setOffer, isVideo, setIsVideo} = useContext(WebrtcContext)
    const [showOffer,
        setShowOffer] = useState(false);

    async function clickHandler(event) {
        event.preventDefault();
        await createOffer(isVideo, setOffer)
    }

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
                        await clickHandler(event)
                    }}>Creat Offer</Button>
                </Grid>
                <Grid item xs={3}/> {showOffer
                    ? <Grid item xs={6}>
                            <TextField
                                label="Offer"
                                disabled={true}
                                value={offer}
                                multiline
                                rows={8}
                                defaultValue="Offer"/>
                        </Grid>
                    : <Grid item xs={6}/>
                }
                <Grid item xs={3}/>
            </Grid>
        </div>
    );
}

export default Webrtc;