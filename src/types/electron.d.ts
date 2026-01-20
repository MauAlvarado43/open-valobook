export interface IElectronAPI {
  platform: string;
  quitApp: () => void;
  saveFileDialog: (
    data: string,
    isImage?: boolean,
    format?: 'png' | 'pdf' | 'ovb'
  ) => Promise<string | null>;
  openFileDialog: () => Promise<{ path: string; content: string } | null>;
  saveToLibrary: (name: string, data: string) => Promise<boolean>;
  listLibrary: () => Promise<import('./strategy').LibraryStrategy[]>;
  deleteFromLibrary: (name: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
