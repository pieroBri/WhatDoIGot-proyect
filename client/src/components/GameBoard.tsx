import React from 'react'
import PlayerCard from './PlayerCard'
import './GameBoard.css'

type Player = { name: string; avatar: string }

function GameBoard({ players }: { players: Player[] }): JSX.Element {
  return (
    <div className="game-board">
      {players.map((player, index) => (
        <PlayerCard key={index} name={player.name} avatar={player.avatar} />
      ))}
    </div>
  )
}

export default GameBoard
