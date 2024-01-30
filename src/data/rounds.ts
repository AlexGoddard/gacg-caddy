import { Division, ScoreType } from 'components/constants';
import { holes } from './holes';
import { players } from './players';
import roundData from './rounds.json';

interface Round {
  playerId: number;
  day: string;
  grossHoles: number[];
}

interface Payball {
  player: string;
  hole: number;
  score: number;
}

interface Payballs {
  scoreType: ScoreType;
  division: Division;
  payballs: Payball[];
}

interface Deuce {
  player: string;
  hole: number;
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

  public getAllPayballs(day: string) {
    const payballs: Payballs[] = [];
    Object.values(ScoreType).forEach((scoreType) => {
      Object.values(Division).forEach((division) => {
        payballs.push({
          scoreType: scoreType,
          division: division,
          payballs: this.getPayballs(day, scoreType, division),
        });
      });
    });
    return payballs;
  }

  public getAllDeuces(day: string) {
    const deuces: Deuce[] = [];
    const dayRounds = this.rounds.filter((round) => round.day === day);
    if (dayRounds.length === 0) return [];
    dayRounds.map((round) => {
      round.grossHoles.map((score, holeIndex) => {
        if (score <= 2) {
          deuces.push({ player: players.getPlayerName(round.playerId), hole: holeIndex + 1 });
        }
      });
    });
    return deuces;
  }

  private getPayballs(day: string, scoreType: ScoreType, division: Division) {
    const payballs: Payball[] = [];
    let dayRounds = this.rounds.filter((round) => {
      const playerDivision = players.getDivision(round.playerId);
      return round.day === day && playerDivision === division;
    });
    if (dayRounds.length === 0) return [];

    if (scoreType === ScoreType.NET) {
      dayRounds = dayRounds.map((grossRound) => this.convertToNetRound(grossRound));
    }

    const lowestScores = holes
      .getNumbers()
      .map((holeNumber) => this.getLowestScoreOnHole(holeNumber, dayRounds));
    // For each hole, find all rounds that have a matching low score
    const matches = lowestScores.map((lowestScore, holeIndex) => {
      return {
        hole: holeIndex + 1,
        matchingRounds: dayRounds.filter((round) => round.grossHoles[holeIndex] === lowestScore),
      };
    });
    matches.map((matching) => {
      // Only count as a payball if no other rounds had the same score
      if (matching.matchingRounds.length === 1) {
        payballs.push({
          player: players.getPlayerName(matching.matchingRounds[0].playerId),
          hole: matching.hole,
          score: matching.matchingRounds[0].grossHoles[matching.hole - 1],
        });
      }
    });
    return payballs;
  }

  private convertToNetRound(round: Round) {
    const playerHandicap = players.getHandicap(round.playerId);
    const holeHandicaps = holes.getHandicaps();
    const netHoles = round.grossHoles.map((grossScore, index) => {
      const holeHandicap = holeHandicaps[index];
      let remainingHandicap = playerHandicap;
      let shots = 0;
      while (remainingHandicap >= holeHandicap) {
        shots += 1;
        remainingHandicap -= 18;
      }
      return grossScore - shots;
    });
    return {
      playerId: round.playerId,
      day: round.day,
      grossHoles: netHoles,
    };
  }

  private getLowestScoreOnHole(holeNumber: number, rounds: Round[]) {
    const holeIndex = holeNumber - 1;
    return rounds.reduce((prev, current) =>
      prev && prev.grossHoles[holeIndex] < current.grossHoles[holeIndex] ? prev : current,
    ).grossHoles[holeIndex];
  }
}

export const rounds = Rounds.Instance;
