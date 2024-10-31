declare interface Window {
  unisat: Unisat;
  satsConnect: any;
  ethereum: MetaMask;
}

type ToSignInputs = {
  index: number;
  address?: string;
  publicKey?: string;
  sighashType?: number[];
};
interface SignPsbtOptions {
  autoFinalized: boolean;
  toSignInputs?: ToSignInput[];
}

type Unisat = {
  getNetwork: () => Promise<UnisatNetwork>;
  switchChain: (chain: string) => Promise<void>;
  switchNetwork: (targetNetwork: UnisatNetwork) => Promise<void>;
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  getPublicKey: () => Promise<string>;
  sendBitcoin: (
    address: string,
    satoshis: number,
    options?: {}
  ) => Promise<string>;
  signPsbt: (hex: string, options: SignPsbtOptions) => Promise<string>;
  signMessage: (
    message: string,
    type: MessageSignatureTypes
  ) => Promise<string>;
};
