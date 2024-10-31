import { useEffect, useState } from "react";
import { getLocalStorage } from "../utils/localStorage";
import { Psbt } from "bitcoinjs-lib";
import { regtest } from "bitcoinjs-lib/src/networks";
import Link from "next/link";

export const WithdrawModal = ({
  data,
  isOpen,
  setIsOpen,
}: {
  data: {
    ticker: string;
    amount: string;
  } | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTxId(null);
    }
  }, [isOpen]);

  const onWithdrawRune = async (ticker: string) => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RUNE_API}/rune/withdraw`,
      {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runeName: ticker,
          nearAccountAddress: getLocalStorage("runesAccountId"),
          withdrawAddress: getLocalStorage("btcAccountId"),
          paymentAddress: getLocalStorage("btcAccountId"),
        }),
      }
    );

    if (!response.ok) {
      console.error(`Error sign and send delegate : ${response.statusText}`);
    }

    const withdrawPsbt = await response.json();

    const signedPsbtHex = await window.unisat.signPsbt(withdrawPsbt.psbtHex, {
      autoFinalized: false,
      toSignInputs: withdrawPsbt?.signIndexes.map((signIndex: number) => {
        return {
          index: signIndex,
          address: getLocalStorage("btcAccountId"),
        };
      }),
    });

    const psbt = Psbt.fromHex(signedPsbtHex, { network: regtest });
    psbt.finalizeAllInputs();
    const transactionHex = psbt.extractTransaction().toHex();

    // broadcast tx
    const broadcastTxFetch = await fetch(`http://217.15.165.196:3002/tx`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: transactionHex,
    });
    if (!broadcastTxFetch.ok) {
      console.error(`Error broadcast tx : ${broadcastTxFetch.statusText}`);
    }

    const broadcastResponse = await broadcastTxFetch.text();
    console.log(broadcastResponse);
    setTxId(broadcastResponse);

    setIsLoading(false);
  };

  return (
    <div
      onClick={() => {
        setIsOpen(false);
        setTxId(null);
      }}
      className={`fixed inset-0 ${isOpen ? "z-50" : "delay-500 -z-10"}`}
    >
      <div
        className={`absolute inset-0 overflow-auto pb-16 bg-gray-950 bg-opacity-80 p-6 transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex h-full items-center justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto bg-black bg-opacity-70 border border-gray-600 text-white overflow-hidden"
          >
            {txId ? (
              <>
                <div className="p-4">
                  <p className="font-mono text-title text-xl font-bold tracking-tighter">
                    Withdrawal Successful
                  </p>
                </div>
                <div className="px-4 mb-4">
                  <p className="font-mono text-md mb-2">Transaction ID:</p>
                  <p className="font-mono text-sm break-all bg-gray-900 p-2 rounded">
                    {txId}
                  </p>
                  <div className="mt-4 text-center">
                    <Link
                      target="_blank"
                      className="font-mono text-sm opacity-75 hover:opacity-100"
                      href={`https://mempool.space/signet/tx/${txId}`}
                    >
                      View in Explorer
                      <svg
                        className="inline-block ml-2 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Link>
                  </div>
                  <button
                    className="mt-6 w-full font-mono bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-lg"
                    onClick={() => {
                      setTxId(null);
                      setIsOpen(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 flex items-center justify-between gap-x-20">
                  <div>
                    <p className="font-mono text-title text-xl font-bold tracking-tighter">
                      Withdraw Confirmation
                    </p>
                  </div>
                  <div
                    className="w-4 cursor-pointer hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 66 66"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="opacity-70"
                    >
                      <path
                        d="M8.99987 0.000111535C8.23224 0.000111535 7.46377 0.292518 6.87877 0.879018L0.878774 6.87902C-0.294227 8.05202 -0.294227 9.95121 0.878774 11.1212L22.7577 33.0001L0.878774 54.879C-0.294227 56.052 -0.294227 57.9512 0.878774 59.1212L6.87877 65.1212C8.05177 66.2942 9.95096 66.2942 11.121 65.1212L32.9999 43.2423L54.8788 65.1212C56.0488 66.2942 57.951 66.2942 59.121 65.1212L65.121 59.1212C66.294 57.9482 66.294 56.049 65.121 54.879L43.2421 33.0001L65.121 11.1212C66.294 9.95121 66.294 8.04902 65.121 6.87902L59.121 0.879018C57.948 -0.293982 56.0488 -0.293982 54.8788 0.879018L32.9999 22.7579L11.121 0.879018C10.5345 0.292518 9.76749 0.000111535 8.99987 0.000111535Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <div className="px-4 w-full">
                  <label className="block font-mono text-md mb-4 mt-2 text-center">
                    You are about to withdraw:
                  </label>
                  <div className="space-y-2">
                    <div className="w-full flex items-start">
                      <div className="w-1/3 block font-mono font-bold uppercase">
                        ADDRESS
                      </div>
                      <div className="w-2/3 mt-1 font-bold text-right break-all font-mono">
                        {getLocalStorage("btcAccountId")}
                      </div>
                    </div>
                    <div className="w-full flex items-center">
                      <div className="w-1/3 block font-mono font-bold uppercase">
                        RUNE TICKER
                      </div>
                      <div className="w-2/3 mt-1 font-bold text-right">
                        {data?.ticker}
                      </div>
                    </div>
                    <div className="w-full flex items-center">
                      <div className="w-1/3 block font-mono font-bold uppercase">
                        RUNE AMOUNT
                      </div>
                      <div className="w-2/3 mt-1 font-bold text-right">
                        {data?.amount &&
                          (BigInt(data.amount!) / BigInt(10 ** 18)).toString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 mb-4">
                  <button
                    className="mt-4 w-full font-mono bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-lg"
                    onClick={() => onWithdrawRune(data?.ticker ?? "")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FFC240] mr-2"></div>
                        Withdrawing...
                      </div>
                    ) : (
                      "Withdraw"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
