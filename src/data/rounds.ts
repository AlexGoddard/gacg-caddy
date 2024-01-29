import roundData from './rounds.json';

interface Round {
  lastName: string;
  firstName: string;
  day: string;
  grossHoles: number[];
}

class Rounds {
  private static _instance: Rounds;
  private rounds;

  private constructor() {
    this.rounds = roundData.rounds as Round[];
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async saveRound(round: Round) {
    this.rounds.push(round);
    const saveResult = window.ipcRenderer.invoke('post/round', {
      rounds: this.rounds,
    });
    return saveResult;
  }
}

export const rounds = Rounds.Instance;
