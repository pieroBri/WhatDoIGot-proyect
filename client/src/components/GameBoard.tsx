import { useEffect } from "react";
import { Player, useRoom } from "../context/RoomContext";
import {
    calculatePlayerPosition,
    DEFAULT_LAYOUT_CONFIG,
} from "../utils/gameboardLayout";
import PlayerCard from "./ui/PlayerCard";

function GameBoard(): JSX.Element {
    const { playersList, socket, roomName, statusMessage } = useRoom();
    const n = playersList.length;

    // Find current player index to position them at bottom
    const myIndex = playersList.findIndex((p) => p.id === socket?.id);

    // Custom config with bottom start angle (6 o'clock position)
    const layoutConfig = {
        ...DEFAULT_LAYOUT_CONFIG,
        startAngle: Math.PI / 2, // Bottom position
    };

    useEffect(() => {
        console.log("GameBoard debug:", {
            playersList,
            myIndex,
        });
    }, [playersList, myIndex]);

    return (
        <div className="flex items-center justify-center w-[1000px] h-[850px] bg-gray-800 p-6 border border-slate-600 rounded-lg shadow-lg">
            {statusMessage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
                    <div
                        className={`px-4 py-2 rounded shadow-md text-white ${
                            statusMessage.type === "success"
                                ? "bg-green-600"
                                : statusMessage.type === "error"
                                  ? "bg-red-600"
                                  : "bg-blue-600"
                        }`}
                    >
                        {statusMessage.text}
                    </div>
                </div>
            )}
            {/* Circular game board container */}
            <div
                className="relative border border-slate-600 rounded-full"
                style={{
                    width: `${DEFAULT_LAYOUT_CONFIG.containerSize}px`,
                    height: `${DEFAULT_LAYOUT_CONFIG.containerSize}px`,
                }}
            >
                {/* Central table decoration */}
                <div className="absolute w-32 h-32 bg-slate-800 border-4 border-amber-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-2xl">
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">
                        Mesa de Juego
                    </span>
                </div>

                {/* Player cards distributed in circle */}
                {playersList.map((player: Player, i) => {
                    const isMe = socket?.id === player.id;
                    // Rotate player index so current player is always at position 0 (bottom)
                    const rotatedIndex =
                        myIndex !== -1 ? (i - myIndex + n) % n : i;
                    const position = calculatePlayerPosition(
                        rotatedIndex,
                        n,
                        layoutConfig,
                    );

                    return (
                        <div
                            key={player.id}
                            className="absolute"
                            style={{
                                left: `${position.x}px`,
                                top: `${position.y}px`,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <PlayerCard
                                name={player.name}
                                avatar={player.game?.avatar ?? ""}
                                isMe={isMe}
                                isTurnoActivo={Boolean(player.isTurnoActivo)}
                                socket={socket}
                                roomName={roomName}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GameBoard;
