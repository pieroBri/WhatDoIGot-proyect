import PlayerCard from '../components/PlayerCard';
import './GameBoard.css';

function GameBoard({ players }) {
    return (
        <div className="game-board">
            {players.map((player, index) => (
                <PlayerCard 
                    key={index} 
                    name={player.name} 
                    avatar={player.avatar} 
                />
            ))}
        </div>
    );
}

export default GameBoard;