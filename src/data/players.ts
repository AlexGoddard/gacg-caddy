import playerData from './players.json';

interface Player {
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

  public getNames(division?: string) {
    let names = this.players;
    if (division !== undefined) {
      names = names.filter((player) => player.division === division);
    }
    return names.map((player) => `${player.firstName} ${player.lastName}`);
  }

  public getDivision(name: string): string {
    const division = this.players.find(
      (player) => `${player.firstName} ${player.lastName}` === name,
    )?.division;
    return division !== undefined ? division : 'N/A';
  }

  public getHandicap(name: string): number {
    const handicap = this.players.find(
      (player) => `${player.firstName} ${player.lastName}` === name,
    )?.handicap;
    return handicap !== undefined ? handicap : 0;
  }

  public getFirstName(name: string): string {
    return name.split(' ')[0].trim();
  }

  public getLastName(name: string): string {
    return name.split(' ')[1].trim();
  }
}

export const players = Players.Instance;
