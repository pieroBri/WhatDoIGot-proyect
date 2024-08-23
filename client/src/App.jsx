import React from 'react';
import Lobby from './components/Lobby';



function App() {
    return (
        <div className="App">
            <h2>Hola probando</h2>
            {/* <button onClick={ () => { socket.connect()}}>Conectar</button> */}
            <Lobby />
            {/* Aquí es donde implementarás la lógica del juego */}
        </div>
    );
}

export default App;