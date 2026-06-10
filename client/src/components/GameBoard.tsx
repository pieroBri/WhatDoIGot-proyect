import React from "react";
import PlayerCard from "./ui/PlayerCard";
import { useRoom } from "../context/RoomContext";
import {
    calculatePlayerPosition,
    DEFAULT_LAYOUT_CONFIG,
} from "../utils/gameboardLayout";

function GameBoard(): JSX.Element {
    const { playersList, socket } = useRoom();
    const n = playersList.length;

    // Find current player index to position them at bottom
    const myIndex = playersList.findIndex((p) => p.id === socket?.id);

    // Custom config with bottom start angle (6 o'clock position)
    const layoutConfig = {
        ...DEFAULT_LAYOUT_CONFIG,
        startAngle: Math.PI / 2, // Bottom position
    };

    return (
        <div className="flex items-center justify-center w-[1000px] h-[1200px] bg-slate-900 p-6">
            {/* Circular game board container */}
            <div
                className="relative border border-slate-700 rounded-full"
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
                {playersList.map((player, i) => {
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
                                avatar={player.avatar || ""}
                                isMe={isMe}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GameBoard;
