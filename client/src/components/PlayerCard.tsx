import React from "react";

function PlayerCard({
    name,
    avatar,
}: {
    name: string;
    avatar: string;
}): JSX.Element {
    return (
        <div className="max-w-xs mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center flex flex-col justify-between gap-6">
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <img
                        src={avatar || "https://via.placeholder.com/150"}
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
                    <button className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700">
                        Acción 1
                    </button>
                    <button className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        Acción 2
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;
