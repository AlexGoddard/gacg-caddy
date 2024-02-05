import { app } from 'electron';
import fs from 'fs';
import path from 'node:path';

import { ScoreType, TournamentDay } from '../constants';
import { CalcuttaTeam, Payballs, Round } from '../interface';

const DB_PATH = path.join(app.getPath('userData'), 'gacg.sqlite');

const Database = require('better-sqlite3');
const db = new Database(DB_PATH);

export const getCalcutta = (day: TournamentDay) => {
  const calcuttaTeamsStmt = db.prepare(
    `
    SELECT aPlayerId, aPlayers.fullName AS aFullName, bPlayerId, bPlayers.fullName AS bFullName
    FROM calcuttaTeams
    JOIN players aPlayers ON aPlayerId=aPlayers.id
    JOIN players bPlayers ON bPlayerId=bPlayers.id;
    `,
  );
  const calcuttaTeams: CalcuttaTeam[] = calcuttaTeamsStmt
    .all()
    .map(
      (calcuttaTeam: {
        aPlayerId: number;
        aFullName: string;
        bPlayerId: number;
        bFullName: string;
      }) => {
        const teamData: CalcuttaTeam = {
          a: {
            id: calcuttaTeam.aPlayerId,
            name: calcuttaTeam.aFullName,
          },
          b: {
            id: calcuttaTeam.bPlayerId,
            name: calcuttaTeam.bFullName,
          },
        };
        Object.values(ScoreType).forEach((scoreType) => {
          const aStmt = db.prepare(
            `
        SELECT ${scoreType}
        FROM scoresWithNet
        WHERE day=@day AND playerId=@a
        ORDER BY holeNumber;
        `,
          );
          const bStmt = db.prepare(
            `
        SELECT ${scoreType}
        FROM scoresWithNet
        WHERE day=@day AND playerId=@b
        ORDER BY holeNumber;
        `,
          );
          const teamStmt = db.prepare(
            `
        SELECT MIN(${scoreType}) as ${scoreType} 
        FROM scoresWithNet
        WHERE day=@day AND playerId IN (@a, @b)
        GROUP BY holeNumber
        ORDER BY holeNumber
        `,
          );
          teamData[scoreType] = teamStmt
            .all({
              day: day,
              a: calcuttaTeam.aPlayerId,
              b: calcuttaTeam.bPlayerId,
            })
            .map((data: { gross?: number[]; net?: number[] }) => data[scoreType]);
          teamData.a[scoreType] = aStmt
            .all({ day: day, a: calcuttaTeam.aPlayerId })
            .map((data: { gross?: number[]; net?: number[] }) => data[scoreType]);
          teamData.b[scoreType] = bStmt
            .all({ day: day, b: calcuttaTeam.bPlayerId })
            .map((data: { gross?: number[]; net?: number[] }) => data[scoreType]);
        });
        return teamData;
      },
    );
  return calcuttaTeams;
};

export const getCalcuttaTeams = () => {
  const stmt = db.prepare('SELECT * FROM calcuttaTeams;');

  const calcuttaTeams = [];
  for (const calcuttaTeam of stmt.iterate()) {
    calcuttaTeams.push({ a: calcuttaTeam.aPlayerId, b: calcuttaTeam.bPlayerId });
  }
  return calcuttaTeams;
};

export const getDeuces = (day: TournamentDay) => {
  const stmt = db.prepare(
    `
    SELECT fullName as player, holeNumber
    FROM players
    JOIN scores ON players.id = scores.playerId
    WHERE day=? AND gross<=2
    ORDER BY holeNumber;
    `,
  );
  return stmt.all(day);
};

export const getHoles = () => {
  const stmt = db.prepare('SELECT * FROM holes;');

  const holes = [];
  for (const hole of stmt.iterate()) {
    holes.push(hole);
  }
  return holes;
};

export const getPayballs = (day: TournamentDay) => {
  const payballs: Payballs[] = [];
  Object.values(ScoreType).forEach((scoreType) => {
    const stmt = db.prepare(
      `
      WITH minPerHole AS
        (SELECT holeNumber, MIN(${scoreType}) AS minScore
         FROM players
         JOIN scoresWithNet ON players.id = scoresWithNet.playerId
         WHERE DAY=@day
         GROUP BY holeNumber)
      SELECT players.fullName, scoresWithNet.holeNumber, ${scoreType} as score
      FROM scoresWithNet
      JOIN minPerHole ON scoresWithNet.holeNumber = minPerHole.holeNumber
      JOIN players ON scoresWithNet.playerId = players.id
      WHERE ${scoreType} = minPerHole.minScore AND scoresWithNet.day=@day
      GROUP BY scoresWithNet.holeNumber
      HAVING COUNT(*) = 1
      ORDER BY scoresWithNet.holeNumber;
        `,
    );
    payballs.push({
      scoreType: scoreType,
      payballs: stmt
        .all({ day: day, scoreType: scoreType })
        .map((payball: { fullName: string; holeNumber: number; score: number }) => {
          return {
            player: payball.fullName,
            holeNumber: payball.holeNumber,
            score: payball.score,
          };
        }),
    });
  });
  return payballs;
};

export const getPlayers = () => {
  const stmt = db.prepare('SELECT * FROM players;');

  const players = [];
  for (const player of stmt.iterate()) {
    players.push(player);
  }
  return players;
};

export const getRounds = () => {
  const stmt = db.prepare('SELECT * FROM scores;');

  const rounds = [];
  for (const score of stmt.iterate()) {
    const existingRoundIndex = rounds.findIndex(
      (existingRound) =>
        existingRound.playerId === score.playerId && existingRound.day === score.day,
    );
    if (existingRoundIndex !== -1) {
      rounds[existingRoundIndex].grossHoles[score.holeNumber - 1] = score.gross;
    } else {
      const initialGrossHoles = new Array(18).fill(0);
      initialGrossHoles[score.holeNumber - 1] = score.gross;
      rounds.push({ playerId: score.playerId, day: score.day, grossHoles: initialGrossHoles });
    }
  }
  return rounds;
};

export const saveRound = (round: Round) => {
  try {
    const scores = round.grossHoles.map((holeScore, index) => {
      return { playerId: round.playerId, day: round.day, holeNumber: index + 1, gross: holeScore };
    });
    const insertScore = db.prepare(
      'INSERT INTO scores (playerId, day, holeNumber, gross) VALUES (@playerId, @day, @holeNumber, @gross);',
    );
    const insertManyScores = db.transaction((scores: []) => {
      for (const score of scores) insertScore.run(score);
    });
    insertManyScores(scores);
    return true;
  } catch {
    return false;
  }
};

export const populateDatabase = () => {
  // holes
  db.exec('CREATE TABLE holes (holeNumber INTEGER PRIMARY KEY,par INTEGER,handicap INTEGER);');
  const holeData = JSON.parse(
    fs.readFileSync(path.join(app.getPath('userData'), 'holes.json'), 'utf-8'),
  );
  const insertHole = db.prepare(
    'INSERT INTO holes (holeNumber, par, handicap) VALUES (@holeNumber, @par, @handicap);',
  );
  const insertManyHoles = db.transaction((holes: []) => {
    for (const hole of holes) insertHole.run(hole);
  });
  insertManyHoles(holeData.holes);

  // players
  db.exec(
    'CREATE TABLE players (id INTEGER PRIMARY KEY AUTOINCREMENT,lastName TEXT,firstName TEXT,division TEXT,handicap INTEGER);',
  );
  const playerData = JSON.parse(
    fs.readFileSync(path.join(app.getPath('userData'), 'players.json'), 'utf-8'),
  );
  const insertPlayer = db.prepare(
    'INSERT INTO players (lastName, firstName, division, handicap) VALUES (@lastName, @firstName, @division, @handicap);',
  );
  const insertManyPlayers = db.transaction((players: []) => {
    for (const player of players) insertPlayer.run(player);
  });
  insertManyPlayers(playerData.players);

  // rounds
  db.exec(
    'CREATE TABLE scores (playerId INTEGER, day TEXT, holeNumber INTEGER, gross INTEGER, FOREIGN KEY(holeNumber) REFERENCES holes(holeNumber), FOREIGN KEY(playerId) REFERENCES players(id),PRIMARY KEY (playerId, day, holeNumber)) ;',
  );
  const roundData = JSON.parse(
    fs.readFileSync(path.join(app.getPath('userData'), 'rounds.json'), 'utf-8'),
  );
  const scores = roundData.rounds.flatMap(
    (round: { playerId: number; day: string; grossHoles: number[] }) =>
      round.grossHoles.map((gross, index) => {
        return { playerId: round.playerId, day: round.day, holeNumber: index + 1, gross: gross };
      }),
  );
  const insertScore = db.prepare(
    'INSERT INTO scores (playerId, day, holeNumber, gross) VALUES (@playerId, @day, @holeNumber, @gross);',
  );
  const insertManyScores = db.transaction((scores: []) => {
    for (const score of scores) insertScore.run(score);
  });
  insertManyScores(scores);

  // calcutta partners
  db.exec(
    'CREATE TABLE calcuttaTeams (aPlayerId INTEGER UNIQUE, bPlayerId INTEGER UNIQUE, FOREIGN KEY(aPlayerId) REFERENCES players(id), FOREIGN KEY(bPlayerId) REFERENCES players(id), PRIMARY KEY (aPlayerId, bPlayerId));',
  );
  const calcuttaTeamsData = JSON.parse(
    fs.readFileSync(path.join(app.getPath('userData'), 'calcutta-teams.json'), 'utf-8'),
  );
  const insertCalcuttaTeam = db.prepare(
    'INSERT INTO calcuttaTeams (aPlayerId, bPlayerId) VALUES (@a, @b);',
  );
  const insertManyCalcuttaTeams = db.transaction((calcuttaTeams: []) => {
    for (const calcuttaTeam of calcuttaTeams) insertCalcuttaTeam.run(calcuttaTeam);
  });
  insertManyCalcuttaTeams(calcuttaTeamsData.calcuttaTeams);
};
