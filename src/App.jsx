import {useState} from 'react'
import './App.css'
import {WebrtcProvider} from './Context/WebrtcContext/webrtc-context'
import Webrtc from './Components/Webrtc'
import ButtonAppBar from './Components/Appbar'

function App() {

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
