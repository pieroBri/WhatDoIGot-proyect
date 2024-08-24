import { useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Gamepad2 } from "lucide-react"

const socket = io('http://localhost:4000', {autoConnect: false});

function Lobby() {

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('updateRoom', (users) => {
            // Actualiza la lista de usuarios en la interfaz
            console.log('Usuarios en la sala:', users);
            // Aquí podrías actualizar el estado de React para mostrar los usuarios en la UI
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');

    const createRoom = () => {
        socket.connect();
        socket.emit('createRoom', roomName, userName);
    };

    const joinRoom = () => {
        socket.connect();
        socket.emit('joinRoom', roomName, userName);
    };

    return (
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
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
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
        // <div>
        //     <input
        //         type="text"
        //         placeholder="Room Name"
        //         value={roomName}
        //         onChange={(e) => setRoomName(e.target.value)}
        //     />
        //     <input
        //         type="text"
        //         placeholder="Your Name"
        //         value={userName}
        //         onChange={(e) => setUserName(e.target.value)}
        //     />
        //     <button onClick={createRoom}>Create Room</button>
        //     <button onClick={joinRoom}>Join Room</button>
        // </div>
    );
}

export default Lobby;