import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Definir los tipos de los valores en el contexto
interface SocketContextType {
  socket: Socket;
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

// Crear el contexto con el tipo definido
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket] = useState(() => io('http://localhost:4000', { autoConnect: false }));
  
  const [roomName, setRoomName] = useState(() => localStorage.getItem('roomName') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');

  // Efecto para manejar la conexión automática
  useEffect(() => {
    if (roomName && userName) {
      socket.connect();
      socket.emit('joinRoom', roomName, userName);
    }

    // Desconectar socket al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [roomName, userName, socket]);

  // Persistencia en localStorage cuando roomName o userName cambian
  useEffect(() => {
    localStorage.setItem('roomName', roomName);
  }, [roomName]);

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  return (
    <SocketContext.Provider value={{ socket, roomName, setRoomName, userName, setUserName }}>
      {children}
    </SocketContext.Provider>
  );
};
