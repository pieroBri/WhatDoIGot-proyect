import React, { useState } from 'react'
import RoomManager, { WaitingLobby } from './components/LobbyManager'

function App(): JSX.Element {
  const [flagLobby, setFlagLobby] = useState<boolean>(false)

  function cambioDeFlag(value: boolean) {
    setFlagLobby(value)
    console.log('valor de la flag es: ', flagLobby)
  }

  return (
    <div className="App">
      <RoomManager cambioDeFlag={cambioDeFlag} />
      <WaitingLobby flag={flagLobby} />
    </div>
  )
}

export default App
