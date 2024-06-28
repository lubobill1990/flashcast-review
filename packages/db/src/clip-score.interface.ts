export interface IClipScore {
  [key: string]: any;
  score: number;
  dimensions: {
    type: string;
    score: number;
    reason: string;
  }[];
}
