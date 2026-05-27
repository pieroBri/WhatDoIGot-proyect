import React, { useState } from 'react'
import RoomManager, { WaitingLobby } from './components/LobbyManager'

function App(): JSX.Element {
  const [flagLobby, setFlagLobby] = useState<boolean>(false)

  function cambioDeFlag(value: boolean) {
    setFlagLobby(value)
    console.log('valor de la flag es: ', flagLobby)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-700 to-pink-600 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl p-8 bg-white/90 rounded-3xl shadow-xl backdrop-blur-sm">
        <RoomManager cambioDeFlag={cambioDeFlag} />
        <div className="mt-8">
          <WaitingLobby flag={flagLobby} />
        </div>
      </div>
    </div>
  )
}

export default App
