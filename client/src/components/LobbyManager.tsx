import React, { useEffect } from 'react'
import { CheckIcon, XIcon } from 'lucide-react'
import { useRoom, RoomState } from '../context/RoomContext'

export const WaitingLobby = (): JSX.Element | null => {
  const { state, playersList, setPlayersList, socket, userName, roomName, setState } = useRoom()

  const leaveRoom = () => {
    if (!socket || !roomName || !userName) return
    socket.emit('leaveRoom', roomName, userName)
    socket.disconnect()
    setState(RoomState.ROOM_FORM)
  }

  if (state !== RoomState.WAITING_LOBBY) return null

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {playersList.map((player) => (
          <div
            key={player.id}
            className="border-2 border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white/70"
          >
            <span className="text-lg font-medium text-gray-800">{player.name}</span>
            {player.isReady ? (
              <CheckIcon className="text-green-500 w-6 h-6" />
            ) : (
              <XIcon className="text-red-500 w-6 h-6" />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" onClick={leaveRoom}>
          Salir
        </button>
        <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
          Comenzar
        </button>
      </div>
    </div>
  )
}

function RoomManager(): JSX.Element {
  const { roomName, userName, setRoomName, setUserName, setState, setError, socket } = useRoom()

  const createRoom = () => {
    if (!socket || !roomName || !userName) return
    socket.connect()
    socket.emit('createRoom', roomName, userName)
  }

  const joinRoom = () => {
    if (!socket || !roomName || !userName) return
    socket.connect()
    socket.emit('joinRoom', roomName, userName)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName || ''}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80"
        />
        <input
          type="text"
          placeholder="Your Name"
          value={userName || ''}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80"
        />
        <div className="flex gap-4">
          <button
            onClick={createRoom}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Room
          </button>
          <button
            onClick={joinRoom}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomManager
