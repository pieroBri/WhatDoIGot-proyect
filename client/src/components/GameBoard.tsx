import React from 'react'
import PlayerCard from './PlayerCard'
import { useRoom } from '../context/RoomContext'

function GameBoard(): JSX.Element {
  const { playersList } = useRoom()

  return (
    <div className="game-board grid grid-cols-2 sm:grid-cols-3 gap-4 p-6">
      {playersList.map((player) => (
        <PlayerCard key={player.id} name={player.name} avatar={player.avatar || ''} />
      ))}
    </div>
  )
}

export default GameBoard
