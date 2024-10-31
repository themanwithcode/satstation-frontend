import { Action } from "@near-js/transactions";

export interface SignedDelegateParams {
  actions: Action[];
  blockHeightTtl: number;
  receiverId: string;
}
