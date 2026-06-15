import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useRef,
} from "react";
import { io, Socket } from "socket.io-client";

export enum RoomState {
    ROOM_FORM = "ROOM_FORM",
    WAITING_LOBBY = "WAITING_LOBBY",
    IN_GAME = "IN_GAME",
    ERROR = "ERROR",
    DISCONNECTED = "DISCONNECTED",
}

export type Game = {
    id: string;
    name: string;
    avatar: string;
};

export type Player = {
    id: string;
    name: string;
    isReady?: boolean;
    game?: Game;
    isMaster?: boolean;
    isTurnoActivo?: boolean;
};

export type StatusMessage = {
    type: "success" | "error" | "info";
    text: string;
} | null;

interface RoomContextType {
    state: RoomState;
    roomName: string | null;
    userName: string | null;
    playersList: Player[];
    statusMessage: StatusMessage;
    socket: Socket | null;
    setRoomName: (name: string) => void;
    setUserName: (name: string) => void;
    setPlayersList: (players: Player[]) => void;
    setState: (state: RoomState) => void;
    setStatusMessage: (m: StatusMessage) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<RoomState>(RoomState.ROOM_FORM);
    const [roomName, setRoomName] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [playersList, setPlayersList] = useState<Player[]>([]);
    const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Crear socket una única vez al montar el provider
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:4000", {
                autoConnect: false,
            });
        }

        const socket = socketRef.current;

        const handleConnect = () => {
            console.log("Conectado al servidor");
            setStatusMessage(null);
            setState(RoomState.WAITING_LOBBY);
        };

        const handleRoomNoExiste = () => {
            setStatusMessage({
                type: "error",
                text: "La sala ingresada no existe",
            });
            socket.disconnect();
            setState(RoomState.ROOM_FORM);
        };

        const handleRoomYaExistente = () => {
            setStatusMessage({
                type: "error",
                text: "La sala ingresada ya existe",
            });
            socket.disconnect();
            setState(RoomState.ROOM_FORM);
        };

        const handleUpdateRoom = (users: Player[]) => {
            setPlayersList(users);
        };

        const handleGameStarted = () => {
            setState(RoomState.IN_GAME);
        };

        const handleRespuestaCorrecta = (userName: string) => {
            setStatusMessage({
                type: "success",
                text: `${userName} respondió correctamente`,
            });
            setTimeout(() => setStatusMessage(null), 3000);
        };

        const handleRespuestaIncorrecta = (userName: string) => {
            setStatusMessage({
                type: "error",
                text: `${userName} respondió incorrectamente`,
            });
            setTimeout(() => setStatusMessage(null), 3000);
        };

        if (!socket) return;

        socket.on("connect", handleConnect);
        socket.on("room_noexiste", handleRoomNoExiste);
        socket.on("roomYaExistente", handleRoomYaExistente);
        socket.on("updateRoom", handleUpdateRoom);
        socket.on("startGame", handleGameStarted);
        socket.on("respuesta_correcta", handleRespuestaCorrecta);
        socket.on("respuesta_incorrecta", handleRespuestaIncorrecta);
        socket.on("pasarTurno", handleUpdateRoom); // Reutilizamos el mismo handler para actualizar el estado del turno

        return () => {
            socket.off("connect", handleConnect);
            socket.off("room_noexiste", handleRoomNoExiste);
            socket.off("roomYaExistente", handleRoomYaExistente);
            socket.off("updateRoom", handleUpdateRoom);
            socket.off("startGame", handleGameStarted);
            socket.off("respuesta_correcta", handleRespuestaCorrecta);
            socket.off("respuesta_incorrecta", handleRespuestaIncorrecta);
            if (socketRef.current?.connected) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return (
        <RoomContext.Provider
            value={{
                state,
                roomName,
                userName,
                playersList,
                statusMessage,
                socket: socketRef.current,
                setRoomName,
                setUserName,
                setPlayersList,
                setState,
                setStatusMessage,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) throw new Error("useRoom must be used within RoomProvider");
    return context;
};
