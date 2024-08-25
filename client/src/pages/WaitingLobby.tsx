import { useState, useEffect } from 'react';
import { Check, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useSocket } from '../context/SocketContext';

// Define a type for the player
interface Player {
  name: string;
  isReady: boolean;
}

export const WaitingLobby = () => {
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [allReady, setAllReady] = useState(false);
  const [userAlreadyInRoom, setUserAlreadyInRoom] = useState(false); 
  const { socket, roomName, userName, setRoomName, setUserName } = useSocket();

  useEffect(() => {
    const storedRoomName = localStorage.getItem('roomName');
    const storedUserName = localStorage.getItem('userName');

    if (storedRoomName && storedUserName) {
      setRoomName(storedRoomName);
      setUserName(storedUserName);


      socket.connect();
      socket.emit('joinRoom', storedRoomName, storedUserName);

    }

    socket.on('updateRoom', (users: Player[]) => {
      // Filtra duplicados y actualiza la lista de jugadores
      const uniqueUsers = Array.from(new Set(users.map((user) => user.name)))
        .map(name => users.find((user) => user.name === name) as Player);

      setPlayersList(uniqueUsers);
      setAllReady(uniqueUsers.every((user) => user.isReady));

      setUserAlreadyInRoom(uniqueUsers.some((user) => user.name === userName));
    });

    return () => {
      socket.off('updateRoom');
    };
  }, [socket, setRoomName, setUserName, userName]);

  const handleExit = () => {
    socket.disconnect();
    localStorage.removeItem('roomName');
    localStorage.removeItem('userName');
  };

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
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
