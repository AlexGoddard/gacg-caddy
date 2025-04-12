export interface IAPI {
  invoke: (path: string, args: object) => Promise;
}

declare global {
  interface Window {
    api: IAPI;
  }
}
