export const getBTCBalance = async (address: string): Promise<string> => {
  const esploraUrl =
    process.env.NEXT_PUBLIC_BITCOIN_EXPLORER_API ||
    "https://blockstream.info/api";

  try {
    const response = await fetch(`${esploraUrl}/address/${address}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    // Esplora API returns balance in satoshis, convert to BTC
    const balanceInBTC =
      (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) /
      100000000;

    return balanceInBTC.toFixed(4);
  } catch (error) {
    console.error("Error fetching BTC balance:", error);
    throw error;
  }
};
