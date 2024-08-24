import RoomManager, { WaitingLobby } from './components/LobbyManager';
import {useState} from 'react'
//import { WaitingCard } from "./components/PlayerCard";

function App() {
    const [flagLobby, setFlagLobby] = useState(false);

    function cambioDeFlag(value) {
        setFlagLobby(value);
        console.log('valor de la flag es: ', flagLobby);
    }

    
    return (
        <div className="App">
            {/* <button onClick={ () => { socket.connect()}}>Conectar</button> */}
            <RoomManager cambioDeFlag={cambioDeFlag}/>
            <WaitingLobby flag={flagLobby}/>
        </div>
    );
}

export default App;