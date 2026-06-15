import React from "react";
import RoomManager, { WaitingLobby } from "./components/LobbyManager";
import GameBoard from "./components/GameBoard";
import { RoomProvider, useRoom, RoomState } from "./context/RoomContext";

function AppContent(): JSX.Element {
    const { state, statusMessage } = useRoom();

    return (
        <div className="container-dark">
            {state !== RoomState.IN_GAME && (
                <div className="card-dark">
                    {statusMessage && (
                        <div
                            className={`mb-4 p-4 rounded-md border text-white ${
                                statusMessage.type === "success"
                                    ? "bg-green-600/20 border-green-600 text-green-300"
                                    : statusMessage.type === "error"
                                      ? "bg-red-500/20 border-red-500 text-red-300"
                                      : "bg-blue-500/20 border-blue-500 text-blue-300"
                            }`}
                        >
                            {statusMessage.text}
                        </div>
                    )}

                    {state === RoomState.ROOM_FORM && <RoomManager />}
                    {state === RoomState.WAITING_LOBBY && <WaitingLobby />}
                </div>
            )}
            {state === RoomState.IN_GAME && <GameBoard />}
        </div>
    );
}

function App(): JSX.Element {
    return (
        <RoomProvider>
            <AppContent />
        </RoomProvider>
    );
}

export default App;
