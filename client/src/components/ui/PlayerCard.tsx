import React from "react";

function PlayerCard({
    name,
    avatar,
    isMe,
}: {
    name: string;
    avatar: string;
    isMe?: boolean;
}): JSX.Element {
    const placeholder = "https://picsum.photos/seed/picsum/200/300";

    if (!isMe) {
        return (
            <div className="max-w-xs mx-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-center flex flex-col items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <img
                        src={avatar || placeholder}
                        alt={`${name}'s avatar`}
                        className="h-full w-full object-cover"
                    />
                </div>
                <h3 className="text-base font-semibold text-slate-900 truncate">
                    {name}
                </h3>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center flex flex-col justify-between gap-6">
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <img
                        src={avatar || placeholder}
                        alt={`${name}'s avatar`}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        {name}
                    </h3>
                    <p className="text-sm text-slate-500">Jugador</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Escribe algo..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                <div className="flex gap-3">
                    <button className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700">
                        Pasar
                    </button>
                    <button className="flex-1 rounded-xl border border-slate-200 bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700">
                        Responder
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;
