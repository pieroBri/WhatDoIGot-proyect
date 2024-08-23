import Lobby from './components/Lobby';

function App() {
    return (
        <div className="App">
            <h2>Hola probando</h2>
            {/* <button onClick={ () => { socket.connect()}}>Conectar</button> */}
            <Lobby />
        </div>
    );
}

export default App;