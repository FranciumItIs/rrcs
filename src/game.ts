import { GameState, Player, Role } from './types';

export class ChitGame {
  private state: GameState;

  constructor() {
    this.state = {
      players: [
        { id: 1, name: 'Player 1', score: 0 },
        { id: 2, name: 'Player 2', score: 0 },
        { id: 3, name: 'Player 3', score: 0 },
        { id: 4, name: 'Player 4', score: 0 }
      ],
      round: 1,
      phase: 'picking',
      availableChits: ['Raja', 'Rani', 'Chor', 'Sipahi'],
      currentTurn: 0
    };
  }

  public getState(): GameState {
    return this.state;
  }

  public pickChit(playerId: number): Role | undefined {
    const playerIndex = this.state.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1 || this.state.phase !== 'picking') return;

    const randomIndex = Math.floor(Math.random() * this.state.availableChits.length);
    const pickedRole = this.state.availableChits[randomIndex];
    this.state.availableChits.splice(randomIndex, 1);
    this.state.players[playerIndex].currentRole = pickedRole;

    if (this.state.availableChits.length === 0) {
      this.state.phase = 'guessing';
      this.revealRoles(['Raja', 'Sipahi']);
      this.awardInitialPoints();
    }

    return pickedRole;
  }

  private revealRoles(rolesToReveal: Role[]): void {
    this.state.players.forEach(player => {
      if (player.currentRole && rolesToReveal.includes(player.currentRole)) {
        console.log(`${player.name} is the ${player.currentRole}!`);
      }
    });
  }

  private awardInitialPoints(): void {
    const raja = this.state.players.find(p => p.currentRole === 'Raja');
    if (raja) {
      raja.score += 1000;
    }
  }

  public guessChor(sipahiId: number, suspectedChorId: number): boolean {
    const sipahi = this.state.players.find(p => p.id === sipahiId);
    const suspectedPlayer = this.state.players.find(p => p.id === suspectedChorId);

    if (!sipahi || sipahi.currentRole !== 'Sipahi' || !suspectedPlayer || this.state.phase !== 'guessing') {
      return false;
    }

    const isCorrect = suspectedPlayer.currentRole === 'Chor';
    this.state.phase = 'results';
    this.awardFinalPoints(isCorrect);
    return isCorrect;
  }

  private awardFinalPoints(sipahiGuessedCorrectly: boolean): void {
    this.state.players.forEach(player => {
      switch (player.currentRole) {
        case 'Sipahi':
          if (sipahiGuessedCorrectly) player.score += 300;
          break;
        case 'Rani':
          player.score += 500;
          break;
        case 'Chor':
          // Chor gets 0 points
          break;
      }
    });
  }

  public startNewRound(): void {
    this.state.round++;
    this.state.phase = 'picking';
    this.state.availableChits = ['Raja', 'Rani', 'Chor', 'Sipahi'];
    this.state.players.forEach(player => {
      player.currentRole = undefined;
    });
  }
}