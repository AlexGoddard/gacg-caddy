import holeData from './holes.json';

export interface Hole {
  holeNumber: number;
  par: number;
  handicap: number;
}

class Holes {
  private static _instance: Holes;
  private holes;

  private constructor() {
    this.holes = holeData.holes as Hole[];
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getHoles() {
    return this.holes;
  }

  public getNumbers() {
    return this.holes.map((hole) => hole.holeNumber);
  }

  public getPars() {
    return this.holes.map((hole) => hole.par);
  }

  public getHandicaps() {
    return this.holes.map((hole) => hole.handicap);
  }
}

export const holes = Holes.Instance;
