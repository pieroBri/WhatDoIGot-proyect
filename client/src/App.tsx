import React from "react";
import RoomManager, { WaitingLobby } from "./components/LobbyManager";
import GameBoard from "./components/GameBoard";
import { RoomProvider, useRoom, RoomState } from "./context/RoomContext";

function AppContent(): JSX.Element {
    const { state, error } = useRoom();

    return (
        <div className="container-dark">
            <div className="card-dark">
                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-md">
                        {error}
                    </div>
                )}

                {state === RoomState.ROOM_FORM && <RoomManager />}
                {state === RoomState.WAITING_LOBBY && <WaitingLobby />}
                {state === RoomState.IN_GAME && <GameBoard />}
            </div>
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
