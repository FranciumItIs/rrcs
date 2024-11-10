import './style.css';
import { ChitGame } from './game';

const game = new ChitGame();
let currentPickingPlayer = 1;

function updateUI() {
  const state = game.getState();
  const app = document.querySelector<HTMLDivElement>('#app')!;

  app.innerHTML = `
    <div class="game-container">
      <h1>Chit Game - Round ${state.round}</h1>
      <div class="players">
        ${state.players.map(player => `
          <div class="player">
            <h3>${player.name}</h3>
            <p>Score: ${player.score}</p>
            ${state.phase === 'picking' && player.id === currentPickingPlayer ? 
              `<button onclick="window.pickChit(${player.id})">Pick Chit</button>` : ''}
            ${state.phase === 'guessing' && player.currentRole === 'Sipahi' ?
              state.players.map(p => p.id !== player.id ? 
                `<button onclick="window.guessChor(${player.id}, ${p.id})">Guess ${p.name} as Chor</button>` : ''
              ).join('') : ''}
          </div>
        `).join('')}
      </div>
      ${state.phase === 'results' ? 
        `<button onclick="window.startNewRound()">Start New Round</button>` : ''}
    </div>
  `;
}

// Global functions for button clicks
(window as any).pickChit = (playerId: number) => {
  const role = game.pickChit(playerId);
  if (role) {
    alert(`You picked: ${role}`);
    currentPickingPlayer = (currentPickingPlayer % 4) + 1;
    updateUI();
  }
};

(window as any).guessChor = (sipahiId: number, suspectedChorId: number) => {
  const correct = game.guessChor(sipahiId, suspectedChorId);
  alert(correct ? 'Correct guess!' : 'Wrong guess!');
  updateUI();
};

(window as any).startNewRound = () => {
  game.startNewRound();
  currentPickingPlayer = 1;
  updateUI();
};

// Initial render
updateUI();