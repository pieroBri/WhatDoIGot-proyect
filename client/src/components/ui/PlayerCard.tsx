import React from "react";

function PlayerCard({
    name,
    avatar,
    isMe,
    socket,
    roomName, //Pasado por context
    isTurnoActivo,
}: {
    name: string;
    avatar: string;
    isMe?: boolean;
    socket?: any;
    roomName: string;
    isTurnoActivo?: boolean;
}): JSX.Element {
    const placeholder = "https://picsum.photos/seed/picsum/200/300";

    const pasarTurno = () => {
        console.log("Pasar turno clicked");
        if (socket) {
            socket.emit("pasarTurno", roomName, name); // roomName y userName deberían ser obtenidos del contexto o props
        }
    };

    if (!isMe) {
        return (
            <div
                className={`w-44 mx-auto rounded-2xl overflow-hidden border ${
                    isTurnoActivo
                        ? "border-green-400 ring-2 ring-green-400 shadow-lg"
                        : "border-gray-700"
                } bg-gray`}
            >
                {/* Image as background taking ~3/4 of the card */}
                <div className="h-40 w-full bg-slate-200">
                    <img
                        src={avatar || placeholder}
                        alt={`${name}'s avatar`}
                        className="h-full w-full object-fill"
                    />
                </div>

                {/* Bottom area with player name */}
                <div className="bg-slate-900 py-3 px-3 text-center">
                    <h3 className="text-sm font-medium text-gray-100 truncate">
                        {name}
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`max-w-sm mx-auto rounded-2xl border ${
                isTurnoActivo
                    ? "border-green-400 ring-2 ring-green-400 shadow-lg"
                    : "border-gray-700"
            } bg-slate-900 p-2 shadow-sm text-center flex flex-col justify-between gap-2`}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="relative flex h-44 w-full items-center justify-center rounded-md overflow-hidden border  bg-slate-700">
                    <img
                        src={avatar || placeholder}
                        alt={`${name}'s avatar`}
                        className="h-full w-full object-fill"
                    />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-gray-100">
                        {name}
                    </h3>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Escribe algo..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-1 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                <div className="flex gap-3">
                    <button
                        disabled={!isTurnoActivo}
                        onClick={isTurnoActivo ? pasarTurno : undefined}
                        className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                            isTurnoActivo
                                ? "bg-indigo-600 hover:bg-indigo-700"
                                : "bg-indigo-900 opacity-60 cursor-not-allowed"
                        }`}
                    >
                        Pasar
                    </button>
                    <button
                        disabled={!isTurnoActivo}
                        className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                            isTurnoActivo
                                ? "border border-slate-200 bg-green-600 hover:bg-green-700"
                                : "border border-slate-200 bg-green-900 opacity-60 cursor-not-allowed"
                        }`}
                    >
                        Responder
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;
