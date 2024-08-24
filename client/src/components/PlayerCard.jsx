//import './PlayerCard.css';
//import { CheckIcon, XIcon } from "lucide-react"

/* export const WaitingCard = (player) => {
    player.name = 'piero';
    player.isReady = true;
    return (
      <div className='waiting-card'>
        <div
            className="border-2 border-gray-300 rounded-lg p-4 flex justify-between items-center"
          >
            <span className="text-lg font-medium">{player.name}</span>
            {player.isReady ? (
              <CheckIcon className="text-green-500 w-6 h-6" />
            ) : (
              <XIcon className="text-red-500 w-6 h-6" />
            )}
          </div>
      </div>
    );
} */

function PlayerCard({ name, avatar }) {
    return (
        <div className="player-card">
            <img src={avatar} alt={`${name}'s avatar`} className="player-avatar" />
            <h3>{name}</h3>
        </div>
    );
}

export default PlayerCard;