import { useMediaQuery } from '@mantine/hooks';
import JSZip from 'jszip';

import { TournamentDay } from 'components/constants';

export interface NamedDownloadData extends DownloadData {
  fileName: string;
}

export interface DownloadData {
  headers: string[];
  rows: string[][];
}

export const capitalize = (value: string) => `${value[0].toUpperCase()}${value.slice(1)}`;

export const downloadFile = (fileName: string, downloadData: DownloadData) => {
  openSaveFileDialog(fileName, getDownloadBlob(downloadData.headers, downloadData.rows));
};

export const downloadZip = (fileName: string, toDownload: NamedDownloadData[]) => {
  const zip = new JSZip();
  toDownload.map((downloadData) => {
    zip.file(downloadData.fileName, getDownloadBlob(downloadData.headers, downloadData.rows));
  });
  zip.generateAsync({ type: 'blob' }).then((zippedFile) => {
    openSaveFileDialog(fileName, zippedFile);
  });
};

export function getTournamentDay() {
  const currentDate = new Date();
  switch (currentDate.getDay()) {
    case 0:
      return TournamentDay.SUNDAY;
    case 6:
      return TournamentDay.SATURDAY;
    default:
      return TournamentDay.FRIDAY;
  }
}

export const getTournamentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

export const getOut = (holes: Array<number>) => {
  return sum(holes, 0, 9);
};

export const getIn = (holes: Array<number>) => {
  return sum(holes, -9);
};

export const getGross = (holes: Array<number>) => {
  return sum(holes);
};

export const getNet = (holes: Array<number>, handicap: number) => {
  return getGross(holes) - handicap;
};

export const sum = (arrToSum: number[], start?: number, end?: number) => {
  return arrToSum.slice(start, end).reduce((sum, current) => sum + current, 0);
};

export const useDevice = () => {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return { isMobile };
};

const getDownloadBlob = (headers: string[], rows: string[][]) => {
  const downloadFileData = [headers];
  rows.map((row) => downloadFileData.push(row));
  return new Blob([downloadFileData.map((row) => row.join(',')).join('\n')], {
    type: 'text/csv',
  });
};

const openSaveFileDialog = (fileName: string, fileData: Blob) => {
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(fileData);
  downloadLink.download = fileName;
  downloadLink.click();
};
