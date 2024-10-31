import { JsonRpcProvider } from "@near-js/providers";

export const getwNEARBalance = async (accountId: string) => {
  const provider = new JsonRpcProvider({
    url: "https://rpc.testnet.near.org",
  });
  const wNEARContractId = "wrap.testnet"; // Use the appropriate contract ID for wNEAR

  try {
    const rawResult: any = await provider.query({
      request_type: "call_function",
      account_id: wNEARContractId,
      method_name: "ft_balance_of",
      args_base64: Buffer.from(
        JSON.stringify({ account_id: accountId })
      ).toString("base64"),
      finality: "optimistic",
    });

    const balance = JSON.parse(
      Buffer.from(rawResult.result, "base64").toString()
    );
    console.log(balance);
    return balance;
  } catch (error) {
    console.error("Error fetching wNEAR balance:", error);
    return "0";
  }
};

export const getRunes = async () => {
  const provider = new JsonRpcProvider({
    url: "https://rpc.testnet.near.org",
  });
  const wNEARContractId = "runes-contract-3.testnet"; // Use the appropriate contract ID for wNEAR

  try {
    const rawResult: any = await provider.query({
      request_type: "call_function",
      account_id: wNEARContractId,
      method_name: "get_runes",
      args_base64: Buffer.from(
        JSON.stringify({ from_index: "0", limit: "1000" })
      ).toString("base64"),
      finality: "optimistic",
    });

    const runes = JSON.parse(
      Buffer.from(rawResult.result, "base64").toString()
    );
    return runes;
  } catch (error) {
    console.error("Error fetching runes:", error);
    return "0";
  }
};

export const getRunesBalances = async (accountId: string) => {
  const provider = new JsonRpcProvider({
    url: "https://rpc.testnet.near.org",
  });
  const wNEARContractId = "runes-contract-3.testnet"; // Use the appropriate contract ID for wNEAR

  try {
    const rawResult: any = await provider.query({
      request_type: "call_function",
      account_id: wNEARContractId,
      method_name: "get_rune_balances",
      args_base64: Buffer.from(
        JSON.stringify({
          account_id: accountId,
          from_index: "0",
          limit: "1000",
        })
      ).toString("base64"),
      finality: "optimistic",
    });

    const runes = JSON.parse(
      Buffer.from(rawResult.result, "base64").toString()
    );
    return runes;
  } catch (error) {
    console.error("Error fetching runes:", error);
    return "0";
  }
};
