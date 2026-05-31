import React from 'react'
import RoomManager, { WaitingLobby } from './components/LobbyManager'
import { RoomProvider, useRoom, RoomState } from './context/RoomContext'

function AppContent(): JSX.Element {
  const { state, error } = useRoom()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-violet-500 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl p-8 bg-slate-300 rounded-3xl shadow-xl backdrop-blur-sm">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {state === RoomState.ROOM_FORM && <RoomManager />}
        {state === RoomState.WAITING_LOBBY && <WaitingLobby />}
      </div>
    </div>
  )
}

function App(): JSX.Element {
  return (
    <RoomProvider>
      <AppContent />
    </RoomProvider>
  )
}

export default App
