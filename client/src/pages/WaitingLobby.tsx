import { useState, useEffect } from 'react';
import { Check, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useSocket } from '../context/SocketContext';
import { useNavigate } from "react-router-dom";

// Define a type for the player
interface Player {
  name: string;
  isReady: boolean;
  isOwner: true
}

export const WaitingLobby = () => {
  const navigate = useNavigate();
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [player, setPlayer] = useState<Player>();
  const [allReady, setAllReady] = useState(false);
  const [userAlreadyInRoom, setUserAlreadyInRoom] = useState(false); 
  const { socket, roomName, userName, setRoomName, setUserName } = useSocket();

  useEffect(() => {
    const storedRoomName = localStorage.getItem('roomName');
    const storedUserName = localStorage.getItem('userName');
    




    // Manejar la actualización de la sala
    const handleUpdateRoom = (users: Player[]) => {
      const uniqueUsers = Array.from(new Set(users.map((user) => user.name)))
        .map(name => users.find((user) => user.name === name) as Player);

      setPlayersList(users); // Actualiza la lista sin duplicados
      setAllReady(users.every((user) => user.isReady));
      setUserAlreadyInRoom(users.some((user) => user.name === storedUserName)); 
      setPlayer(users.find((user) => user.name === storedUserName) as Player)
    };

    // Manejar la desconexión de un jugador
    const handlePlayerDisconnected = (disconnectedUserName: string) => {
      setPlayersList(prevList => prevList.filter(player => player.name !== disconnectedUserName));
    };

    // Escuchar los eventos del socket
    socket.on('updateRoom', handleUpdateRoom);
    socket.on('playerDisconnected', handlePlayerDisconnected);

    // Limpieza cuando el componente se desmonta
    return () => {
      socket.off('updateRoom', handleUpdateRoom);
      socket.off('playerDisconnected', handlePlayerDisconnected);
    };
}, [socket, setRoomName, setUserName]);

// Dependencia de `userName` para asegurarse de que el componente se renderice después de la actualización
useEffect(() => {
    if (userName) {
        socket.emit('updateRoom', roomName); // Pedir actualización de la sala al servidor
        
      }
}, [userName, roomName, socket]);



  const handleExit = () => {
    socket.disconnect();
    localStorage.removeItem('roomName');
    localStorage.removeItem('userName');
    navigate('/');
  };
  const userReady = () =>{
    socket.emit('ready', roomName, userName);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Waiting Lobby</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {playersList.map((player, index) => (
            <div
              key={index}
              className={`bg-gray-700 p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${
                player.isReady ? 'border-green-500' : 'border-red-500'
              } border-2`}
            >
              <span className="text-white">{player.name}</span>
              {player.isReady ? (
                <Check className="text-green-500" />
              ) : (
                <X className="text-red-500" />
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-white">
            Status: {allReady ? 'Ready!' : 'Waiting...'}
          </div>
          <div className="space-x-2">
            <Button variant="destructive" onClick={handleExit}>
              Exit
            </Button>
            {player?.isOwner ? (
               <Button
               className="bg-green-600 hover:bg-green-700 text-white"
               disabled={!allReady || userAlreadyInRoom} // Deshabilita el botón si el usuario ya está en la sala
             >
               {allReady ? 'Start' : (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Waiting
                 </>
               )}
             </Button>
            ): (
              <Button
               className="bg-green-600 hover:bg-green-700 text-white"
               onClick={()=>{userReady()}}
               disabled={allReady || !userAlreadyInRoom} // Deshabilita el botón si el usuario ya está en la sala
             >
              Listo
             </Button>
            )}
           
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
