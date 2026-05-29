import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export enum RoomState {
  ROOM_FORM = 'ROOM_FORM',
  WAITING_LOBBY = 'WAITING_LOBBY',
  IN_GAME = 'IN_GAME',
  ERROR = 'ERROR',
  DISCONNECTED = 'DISCONNECTED',
}

type Player = { id: string; name: string; isReady?: boolean; avatar?: string }

interface RoomContextType {
  state: RoomState
  roomName: string | null
  userName: string | null
  playersList: Player[]
  error: string | null
  socket: Socket | null
  setRoomName: (name: string) => void
  setUserName: (name: string) => void
  setPlayersList: (players: Player[]) => void
  setState: (state: RoomState) => void
  setError: (error: string | null) => void
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<RoomState>(RoomState.ROOM_FORM)
  const [roomName, setRoomName] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [playersList, setPlayersList] = useState<Player[]>([])
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Crear socket una única vez al montar el provider
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:4000', { autoConnect: false })
    }

    return () => {
      // Cleanup: desconectar solo al desmontar el provider
      if (socketRef.current?.connected) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return (
    <RoomContext.Provider
      value={{
        state,
        roomName,
        userName,
        playersList,
        error,
        socket: socketRef.current,
        setRoomName,
        setUserName,
        setPlayersList,
        setState,
        setError,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export const useRoom = () => {
  const context = useContext(RoomContext)
  if (!context) throw new Error('useRoom must be used within RoomProvider')
  return context
}
