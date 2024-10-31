export interface RuneEtchingSchema {
  feeRate: number;
  runeName: string;
  maxSupply: string;
  pricePerRune: string;
  userTapInternalKeyHex: string;
  divisibility?: number;
  symbol?: string;
  dataHex?: string;
  dataMimeType?: string;
}
