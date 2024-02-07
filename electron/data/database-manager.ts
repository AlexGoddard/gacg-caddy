import { app } from 'electron';
import fs from 'fs';
import path from 'node:path';

import { ScoreType, TournamentDay } from '../constants';
import { CalcuttaTeam, CalcuttaTeamHoles, Payballs, Round } from '../interface';

const DB_PATH = path.join(app.getPath('userData'), 'gacg.sqlite');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Database = require('better-sqlite3');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

export const getCalcutta = (day: TournamentDay): CalcuttaTeam[] => {
  const calcuttaTeamsQuery = db.prepare(
    `
    SELECT aPlayerId, bPlayerId, aPlayers.fullName AS aFullName, bPlayers.fullName AS bFullName
    FROM calcuttaTeams
      JOIN players aPlayers ON aPlayerId=aPlayers.id
      JOIN players bPlayers ON bPlayerId=bPlayers.id;`,
  );
  const grossCalcuttaQuery = db.prepare(calcuttaQueryString(ScoreType.GROSS));
  const netCalcuttaQuery = db.prepare(calcuttaQueryString(ScoreType.NET));
  return calcuttaTeamsQuery
    .all()
    .map(
      (calcuttaTeam: {
        aPlayerId: number;
        bPlayerId: number;
        aFullName: string;
        bFullName: string;
      }) => {
        const queryParams = {
          day: day,
          aPlayerId: calcuttaTeam.aPlayerId,
          bPlayerId: calcuttaTeam.bPlayerId,
        };
        return {
          a: {
            id: calcuttaTeam.aPlayerId,
            name: calcuttaTeam.aFullName,
          },
          b: {
            id: calcuttaTeam.bPlayerId,
            name: calcuttaTeam.bFullName,
          },
          gross: grossCalcuttaQuery.get(queryParams).score,
          net: netCalcuttaQuery.get(queryParams).score,
        };
      },
    );
};

export const getCalcuttaSample = () => {
  const calcuttaTeamsQuery = db.prepare('SELECT aPlayerId, bPlayerId FROM calcuttaTeams');
  const playerDataQuery = db.prepare(`
        WITH
        fridayScores
          AS (SELECT playerId, SUM(gross) as fridayGross, SUM(net) as fridayNet
              FROM scoresWithNet
              WHERE day='friday' AND playerId=@playerId),
        saturdayScores
          AS (SELECT SUM(gross) as saturdayGross, SUM(net) as saturdayNet
              FROM scoresWithNet
              WHERE day='saturday' AND playerId=@playerId)
        SELECT fullName, handicap, fridayGross, fridayNet, saturdayGross, saturdayNet
        FROM fridayScores, saturdayScores
          JOIN players ON fridayScores.playerId = players.id;
      `);
  const teamDataQuery = db.prepare(`
        WITH
        fridaySum
          AS (WITH fridayScores
                AS (SELECT MIN(gross) as fridayGross, MIN(net) as fridayNet
                    FROM scoresWithNet
                    WHERE day='friday' AND playerId IN (@aPlayerId, @bPlayerId)
                    GROUP BY holeNumber)
              SELECT SUM(fridayGross) as fridayGross, SUM(fridayNet) as fridayNet
              FROM fridayScores),
        saturdaySum
          AS (WITH saturdayScores
                AS (SELECT MIN(gross) as saturdayGross, MIN(net) as saturdayNet
                    FROM scoresWithNet
                    WHERE day='saturday' AND playerId IN (@aPlayerId, @bPlayerId)
                    GROUP BY holeNumber)
              SELECT SUM(saturdayGross) as saturdayGross, SUM(saturdayNet) as saturdayNet
              FROM saturdayScores)
        SELECT *
        FROM fridaySum, saturdaySum;
      `);
  return calcuttaTeamsQuery.all().map((calcuttaTeam: { aPlayerId: number; bPlayerId: number }) => {
    const aPlayerData = playerDataQuery.get({ playerId: calcuttaTeam.aPlayerId });
    const bPlayerData = playerDataQuery.get({ playerId: calcuttaTeam.bPlayerId });
    const teamData = teamDataQuery.get({
      aPlayerId: calcuttaTeam.aPlayerId,
      bPlayerId: calcuttaTeam.bPlayerId,
    });
    return [
      // A Player
      aPlayerData.fullName,
      aPlayerData.handicap,
      aPlayerData.fridayGross,
      aPlayerData.fridayNet,
      aPlayerData.saturdayGross,
      aPlayerData.saturdayNet,
      // B Player
      bPlayerData.fullName,
      bPlayerData.handicap,
      bPlayerData.fridayGross,
      bPlayerData.fridayNet,
      bPlayerData.saturdayGross,
      bPlayerData.saturdayNet,
      // Team
      teamData.fridayGross,
      teamData.fridayNet,
      teamData.saturdayGross,
      teamData.saturdayNet,
    ];
  });
};

export const getCalcuttaTeamHoles = (
  day: TournamentDay,
  scoreType: ScoreType,
  aPlayerId: number,
  bPlayerId: number,
): CalcuttaTeamHoles => {
  const playerHolesQuery = db.prepare(playerHolesQueryString(scoreType));
  const teamHolesQuery = db.prepare(calcuttaTeamHolesQueryString(scoreType));
  return {
    a: playerHolesQuery
      .all({ day: day, playerId: aPlayerId })
      .map((hole: { score: number }) => hole.score),
    b: playerHolesQuery
      .all({ day: day, playerId: bPlayerId })
      .map((hole: { score: number }) => hole.score),
    team: teamHolesQuery
      .all({ day: day, aPlayerId: aPlayerId, bPlayerId: bPlayerId })
      .map((hole: { score: number }) => hole.score),
  };
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
  return stmt.all();
};

export const getRounds = (day: TournamentDay) => {
  const stmt = db.prepare(`
    SELECT players.id, fullName, SUM(gross) as gross, SUM(net) as net
    FROM scoresWithNet
      JOIN players ON scoresWithNet.playerId = players.id
    ${day !== TournamentDay.ALL ? 'WHERE day=@day' : ''}
    GROUP BY scoresWithNet.playerId;
  `);
  return stmt
    .all({ day: day })
    .map((round: { id: number; fullName: string; gross: number; net: number }) => {
      return {
        player: {
          id: round.id,
          name: round.fullName,
        },
        gross: round.gross,
        net: round.net,
      };
    });
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

export const getScores = (day: TournamentDay, scoreType: ScoreType, playerId: number) => {
  const scoresQuery = db.prepare(`
    SELECT ${scoreType} as score
    FROM scoresWithNet
    WHERE day=@day AND playerId=@playerId
    ORDER BY holeNumber;
  `);
  const daysToFetch =
    day === TournamentDay.ALL
      ? [TournamentDay.FRIDAY, TournamentDay.SATURDAY, TournamentDay.SUNDAY]
      : [day];
  return daysToFetch.map((dayToFetch) => {
    const scores = scoresQuery
      .all({ day: dayToFetch, playerId: playerId })
      .map((hole: { score: number }) => hole.score);
    if (scores.length !== 0) {
      return {
        day: dayToFetch,
        scores: scores,
      };
    }
  });
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
    'CREATE TABLE players (id INTEGER PRIMARY KEY AUTOINCREMENT,lastName TEXT,firstName TEXT,fullName TEXT GENERATED ALWAYS AS (firstName || " " || lastName),division TEXT,handicap INTEGER);',
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

function calcuttaQueryString(scoreType: ScoreType) {
  return `
    WITH calcuttaHoleScores
      AS (SELECT MIN(${scoreType}) as score
          FROM scoresWithNet
          WHERE day=@day AND playerId IN (@aPlayerId, @bPlayerId)
          GROUP BY holeNumber)
    SELECT SUM(score) as score
    FROM calcuttaHoleScores;
  `;
}

function calcuttaTeamHolesQueryString(scoreType: ScoreType) {
  return `
    SELECT MIN(${scoreType}) as score
    FROM scoresWithNet
    WHERE day=@day AND playerId IN (@aPlayerId, @bPlayerId)
    GROUP BY holeNumber
    ORDER BY holeNumber
  `;
}

function playerHolesQueryString(scoreType: ScoreType) {
  return `
    SELECT ${scoreType} as score
    FROM scoresWithNet
    WHERE day=@day AND playerId=@playerId
    ORDER BY holeNumber;
  `;
}
