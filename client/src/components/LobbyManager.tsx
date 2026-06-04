import React, { useEffect } from 'react'
import { CheckIcon, XIcon, Gamepad2, Loader2 } from 'lucide-react'
import { useRoom, RoomState } from '../context/RoomContext'
import { CustomTooltip } from './ui/ToolTip'

export const WaitingLobby = (): JSX.Element | null => {
  const { state, playersList, setPlayersList, socket, userName, roomName, setState } = useRoom()

  const leaveRoom = () => {
    if (!socket || !roomName || !userName) return
    socket.emit('leaveRoom', roomName, userName)
    socket.disconnect()
    setState(RoomState.ROOM_FORM)
  }

  const toggleReady = () => {
    if (!socket || !roomName || !userName) return
    socket.emit('toggleReady', roomName, userName)
  }

  const isCurrentUserMaster = playersList.some(
    (player) => player.name === userName && player.isMaster
  )

  //UseEffect para debuggear el estado del lobby
  useEffect(() => {
    console.log('WaitingLobby debug:', { userName, isCurrentUserMaster, playersList })
  }, [userName, isCurrentUserMaster, playersList])

  if (state !== RoomState.WAITING_LOBBY) return null

  return (
    <div className="w-full">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center">Waiting Lobby</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {playersList.map((player) => (
            <CustomTooltip key={player.id} text="Jugadores en la sala. Haz clic para indicar que estás listo.">
              <div
                className={`player-card ${player.isReady ? 'player-card-ready' : 'player-card-not-ready'}`}
                onClick={toggleReady}
              >
                <span className="text-white font-medium truncate">{player.name}</span>
                {player.isReady ? (
                  <CheckIcon className="text-green-500 w-5 h-5 ml-2 flex-shrink-0" />
                ) : (
                  <XIcon className="text-red-500 w-5 h-5 ml-2 flex-shrink-0" />
                )}
              </div>
            </CustomTooltip>
          ))}
        </div>
        <div className="flex justify-between items-center gap-2">
          <button className="btn-danger" onClick={leaveRoom}>
            Exit
          </button>
          {isCurrentUserMaster && (
            <button className="btn-success">
              Start Game
            </button>
          )}
        </div>
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
    <div className="w-full">
      <div className="p-6 text-center border-b border-gray-700">
        <div className="flex items-center justify-center mb-2">
          <Gamepad2 className="mr-2 h-6 w-6 text-purple-500" />
          <h1 className="text-2xl font-bold text-white">What Do I Got</h1>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter username"
            value={userName || ''}
            onChange={(e) => setUserName(e.target.value)}
            className="input-dark"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName || ''}
            onChange={(e) => setRoomName(e.target.value)}
            className="input-dark"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={createRoom}
            className="flex-1 btn-primary"
          >
            Create Room
          </button>
          <button
            onClick={joinRoom}
            className="flex-1 btn-success"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomManager
