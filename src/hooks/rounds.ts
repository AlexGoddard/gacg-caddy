import { useQuery } from '@tanstack/react-query';

import { ScoreType, TournamentDay } from 'components/constants';
import { getTournamentYear, sum } from 'components/util';
import { usePlayers } from 'hooks/players';
import { get, post } from 'util/network';

export interface CalcuttaTeam {
  a: CalcuttaPlayerData;
  b: CalcuttaPlayerData;
  gross: number[];
  net: number[];
}

export interface Deuce {
  player: string;
  holeNumber: number;
}

export interface Payball {
  player: string;
  holeNumber: number;
  score: number;
}

export interface Payballs {
  scoreType: ScoreType;
  payballs: Payball[];
}

export interface Round {
  playerId: number;
  day: string;
  grossHoles: number[];
}

interface CalcuttaPlayerData {
  id: number;
  name: string;
  gross: number[];
  net: number[];
}

export const saveRound = (newRound: Round): Promise<boolean> =>
  post('/rounds', { round: newRound }).then((response) => response);

export const useCalcutta = (day: TournamentDay) =>
  useQuery({ queryKey: ['calcutta', day], queryFn: () => fetchCalcutta(day) });

export const useDownloadCalcutta = (isSample: boolean) => {
  const fridayCalcutta = useCalcutta(TournamentDay.FRIDAY);
  const saturdayCalcutta = useCalcutta(TournamentDay.SATURDAY);
  const sundayCalcutta = useCalcutta(TournamentDay.SUNDAY);
  const { isSuccess, data } = usePlayers();
  const download = (isSample: boolean) => {
    const players = isSuccess ? data : [];
    const calcuttaFileData = [];
    if (isSample && fridayCalcutta.isSuccess && saturdayCalcutta.isSuccess) {
      const SAMPLE_HEADERS = [
        'A Player',
        'Handicap',
        'Friday Gross',
        'Friday Net',
        'Saturday Gross',
        'Saturday Net',
        'B Player',
        'Handicap',
        'Friday Gross',
        'Friday Net',
        'Saturday Gross',
        'Saturday Net',
        'Team Friday Gross',
        'Team Friday Net',
        'Team Saturday Gross',
        'Team Saturday Net',
      ];
      calcuttaFileData.push(SAMPLE_HEADERS);
      fridayCalcutta.data.map((fridayCalcuttaTeam) => {
        const matchingSaturdayTeam = saturdayCalcutta.data.find(
          (saturdayCalcuttaTeam) => fridayCalcuttaTeam.a.id === saturdayCalcuttaTeam.a.id,
        );
        const aPlayer = players.find((player) => player.id === fridayCalcuttaTeam.a.id);
        const bPlayer = players.find((player) => player.id === fridayCalcuttaTeam.a.id);
        // Don't include teams without scores on Friday and Saturday
        if (!matchingSaturdayTeam || !aPlayer || !bPlayer) return;
        calcuttaFileData.push([
          // A Player
          aPlayer.fullName,
          aPlayer.handicap,
          sum(fridayCalcuttaTeam.a.gross),
          sum(fridayCalcuttaTeam.a.net),
          sum(matchingSaturdayTeam.a.gross),
          sum(matchingSaturdayTeam.a.net),
          // B Player
          bPlayer.fullName,
          bPlayer.handicap,
          sum(fridayCalcuttaTeam.b.gross),
          sum(fridayCalcuttaTeam.b.net),
          sum(matchingSaturdayTeam.b.gross),
          sum(matchingSaturdayTeam.b.net),
          // Team
          sum(fridayCalcuttaTeam.gross),
          sum(fridayCalcuttaTeam.net),
          sum(matchingSaturdayTeam.gross),
          sum(matchingSaturdayTeam.net),
        ]);
      });
    } else {
      const HEADERS = [
        'A Player',
        'Handicap',
        'Gross',
        'Net',
        'B Player',
        'Handicap',
        'Gross',
        'Net',
        'Team Gross',
        'Team Net',
      ];
      if (sundayCalcutta.isSuccess) {
        calcuttaFileData.push(HEADERS);
        sundayCalcutta.data.map((calcuttaTeam) => {
          const aPlayer = players.find((player) => player.id === calcuttaTeam.a.id);
          const bPlayer = players.find((player) => player.id === calcuttaTeam.a.id);
          if (aPlayer && bPlayer) {
            calcuttaFileData.push([
              // A Player
              aPlayer.fullName,
              aPlayer.handicap,
              sum(calcuttaTeam.a.gross),
              sum(calcuttaTeam.a.net),
              // B Player
              bPlayer.fullName,
              bPlayer.handicap,
              sum(calcuttaTeam.b.gross),
              sum(calcuttaTeam.b.net),
              // Team
              sum(calcuttaTeam.gross),
              sum(calcuttaTeam.net),
            ]);
          }
        });
      }
    }
    const calcuttaFile = new Blob([calcuttaFileData.map((row) => row.join(',')).join('\n')], {
      type: 'text/csv',
    });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(calcuttaFile);
    element.download = `calcutta-${isSample ? 'sample-' : ''}${getTournamentYear()}.csv`;
    element.click();
  };

  return {
    download: () => download(isSample),
  };
};

export const useDeuces = (day: TournamentDay) =>
  useQuery({ queryKey: ['deuces', day], queryFn: () => fetchDeuces(day) });

export const usePayballs = (day: TournamentDay) =>
  useQuery({ queryKey: ['payballs', day], queryFn: () => fetchPayballs(day) });

function fetchCalcutta(day: TournamentDay): Promise<CalcuttaTeam[]> {
  return get('/calcutta', { day: day }).then((calcutta) => calcutta);
}

function fetchDeuces(day: TournamentDay): Promise<Deuce[]> {
  return get('/deuces', { day: day }).then((deuces) => deuces);
}

function fetchPayballs(day: TournamentDay): Promise<Payballs[]> {
  return get('/payballs', { day: day }).then((payballs) => payballs);
}
