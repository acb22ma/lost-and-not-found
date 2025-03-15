declare module 'qrcode' {
    export function toCanvas(
      canvas: HTMLCanvasElement,
      value: string,
      options?: { width?: number; margin?: number },
      callback?: (error: Error | null) => void
    ): void;
  
    export function toDataURL(
      value: string,
      options?: { width?: number; margin?: number },
      callback?: (error: Error | null, url: string) => void
    ): void;
    
    export function toString(
      value: string,
      options?: { width?: number; margin?: number },
      callback?: (error: Error | null, string: string) => void
    ): void;
  }
  