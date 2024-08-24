import { useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import { CheckIcon, XIcon } from "lucide-react"

const socket = io('http://localhost:4000', {autoConnect: false});


export const WaitingLobby = ({flag}) => {
    const [playersList, setPlayersList]= useState([]);

    socket.on('updateRoom', (users) => {
        setPlayersList(users);
    })
    if(flag){
        return (
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {playersList.map((player) => (
                <div
                  key={player.id}
                  className="border-2 border-gray-300 rounded-lg p-4 flex justify-between items-center"
                >
                  <span className="text-lg font-medium">{player.name}</span>
                  {player.isReady ? (
                    <CheckIcon className="text-green-500 w-6 h-6" />
                  ) : (
                    <XIcon className="text-red-500 w-6 h-6" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                Salir
              </button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                Comenzar
              </button>
            </div>
          </div>
        )
    }

  }

function RoomManager({cambioDeFlag}) {

    useEffect(() => {
        socket.on('connect', () => {
            console.log('conectado creo');
            cambioDeFlag(true);
        });

        socket.on('room_noexiste', () => { //manejo si ingresa una room que no existe
            alert('la room ingresada no existe');
            socket.disconnect();
        })

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
        <div>
            <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={createRoom}>Create Room</button>
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
}

export default RoomManager;