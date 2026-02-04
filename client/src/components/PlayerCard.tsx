import React from 'react'
// import './PlayerCard.css'

function PlayerCard({ name, avatar }: { name: string; avatar: string }): JSX.Element {
  return (
    <div className="player-card">
      <img src={avatar} alt={`${name}'s avatar`} className="player-avatar" />
      <h3>{name}</h3>
    </div>
  )
}

export default PlayerCard
