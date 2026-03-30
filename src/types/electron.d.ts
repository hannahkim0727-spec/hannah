declare global {
  interface Window {
    desktop?: {
      isElectron: boolean;
      platform: string;
    };
  }
}

export {};
