import RoomManager from './pages/Lobby';
import { WaitingLobby } from './pages/WaitingLobby';
import {useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
    const [flagLobby, setFlagLobby] = useState(false);

    function cambioDeFlag(value:boolean) {
        setFlagLobby(value);
        console.log('valor de la flag es: ', flagLobby);
    }
    return (
        <Router>
            <Routes>
                <Route path='/' element={<RoomManager />}/>
                <Route path='/waitingLobby' element={<WaitingLobby />}/>
            </Routes>
        </Router>
    //     <div className="App">
    //     {/* <button onClick={ () => { socket.connect()}}>Conectar</button> */}
    //     <RoomManager cambioDeFlag={cambioDeFlag}/>
    //     <WaitingLobby flag={flagLobby}/>
    // </div>
    );
}

export default App;