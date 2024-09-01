import { useState, useEffect } from 'react';
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertTriangle, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../context/SocketContext';

function RoomManager() {
  const navigate = useNavigate();
  const { socket, setRoomName, setUserName } = useSocket();
  const [localRoomName, setLocalRoomName] = useState('');
  const [localUserName, setLocalUserName] = useState('');
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor');
    });
  
    // Limpieza del socket cuando el componente se desmonta
    return () => {
      socket.off('connect');
      socket.off('room_noexiste');
    };
  }, [socket]);

  const createRoom = () => {
    if (!localUserName || !localRoomName) {
      alert('Por favor, ingresa un nombre de usuario y un nombre de sala.');
      return;
    }

    setRoomName(localRoomName);
    setUserName(localUserName);
    localStorage.setItem('roomName', localRoomName);
    localStorage.setItem('userName', localUserName);
    socket.emit('createRoom', localRoomName, localUserName);
      navigate('/waitingLobby');
  };

  const joinRoom = () => {
    if (!localUserName || !localRoomName) {
        alert('Por favor, ingresa un nombre de usuario y un nombre de sala.');
        return;
    }

    setRoomName(localRoomName);
    setUserName(localUserName);
    localStorage.setItem('roomName', localRoomName);
    localStorage.setItem('userName', localUserName);



    // Esperar la confirmación de que la sala existe antes de navegar
    socket.once('room_exists', () => {
      window.location.href = '/waitingLobby';
  });

  socket.once('room_noexiste', () => {
      alert('La sala ingresada no existe');
      socket.disconnect();
  });
};


  return (
    <>
      {flag && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-800 border-gray-700">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
                <Gamepad2 className="mr-2 h-6 w-6" />
                What Do I Got
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={localUserName}
                  onChange={(e) => setLocalUserName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter room name"
                  value={localRoomName}
                  onChange={(e) => setLocalRoomName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={createRoom}
                >
                  Create Room
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={joinRoom}
                >
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default RoomManager;
