import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Crear socket solo una vez (singleton per component mount)
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:4000', { autoConnect: false })
    }

    return () => {
      // Cleanup: desconectar al desmontar
      if (socketRef.current?.connected) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
}
