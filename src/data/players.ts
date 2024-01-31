import { Division } from 'components/constants';

import playerData from './players.json';

interface Player {
  id: number;
  lastName: string;
  firstName: string;
  division: string;
  handicap: number;
}

class Players {
  private static _instance: Players;
  private players;

  private constructor() {
    this.players = playerData.players as Player[];
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getPlayers(division?: Division) {
    let players = this.players;
    if (division !== undefined) {
      players = players.filter((player) => player.division === division);
    }
    return players;
  }

  public getDivision(playerId: number) {
    const division = this.players.find((player) => player.id === playerId)?.division;
    return division !== undefined ? division : 'N/A';
  }

  public getHandicap(playerId: number) {
    const handicap = this.players.find((player) => player.id === playerId)?.handicap;
    return handicap !== undefined ? handicap : 0;
  }

  public getPlayerName(playerId: number) {
    const player = this.players.find((player) => player.id === playerId);
    return player !== undefined ? `${player.firstName} ${player.lastName}` : '';
  }
}

export const players = Players.Instance;
