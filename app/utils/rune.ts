import { RuneEtchingSchema } from "../interfaces/rune";
import { EtchingRuneResponse } from "../types/Rune";

export const etchingRune = async (
  params: RuneEtchingSchema
): Promise<EtchingRuneResponse | null> => {
  const data: RuneEtchingSchema = {
    feeRate: 1,
    runeName: params.runeName,
    maxSupply: params.maxSupply,
    pricePerRune: params.pricePerRune,
    userTapInternalKeyHex: params.userTapInternalKeyHex,
    divisibility: params.divisibility ?? 18,
    symbol: params.symbol ?? "",
  };

  if (params.dataHex) {
    data["dataHex"] = params.dataHex;
  }

  if (params.dataMimeType) {
    data["dataMimeType"] = params.dataMimeType;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_RUNE_API}/rune/etching`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    console.error(`Error fetch etching rune : ${response.statusText}`);
    const error = await response.json();
    throw new Error(error.message);
  }

  return (await response.json()) as EtchingRuneResponse;
};

export const fundCommitAddress = async (address: string, amount: number) => {
  const data = {
    address,
    amount: amount, // satoshi to btc
  };

  try {
    const txId = await window.unisat.sendBitcoin(address, data.amount);

    console.log(txId);
    return txId;
  } catch (error) {
    console.log(error);
    console.error(`Error sending bitcoin : ${error}`);
  }
};
