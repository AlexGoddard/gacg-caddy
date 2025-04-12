import JSZip from 'jszip';

export interface NamedDownloadData extends DownloadData {
  fileName: string;
}

export interface DownloadData {
  headers: string[];
  rows: string[][];
}

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
