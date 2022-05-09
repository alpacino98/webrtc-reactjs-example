import {useState} from 'react'
import './App.css'
import {WebrtcProvider} from './Context/WebrtcContext/webrtc-context'
import Webrtc from './Components/Webrtc'
import ButtonAppBar from './Components/Appbar'

function App() {

    console.log(import.meta.env.VITE_APP_NOT_SECRET_CODE ? import.meta.env.VITE_APP_NOT_SECRET_CODE : null)

    return (
        <WebrtcProvider>
            <div className="App">
            <ButtonAppBar />
            <Webrtc />
            </div>
        </WebrtcProvider>
    )
}

export default App
