import { formatNearAmount } from "@near-js/utils";
import { useEffect, useState } from "react";
import { getLocalStorage } from "../utils/localStorage";
import { getwNEARBalance } from "../utils/near";
import { getBTCBalance } from "../utils/btc";

type MintData = {
  ticker: string | undefined;
  price: string | undefined;
  amount: string | undefined;
};

export const MintModal = ({
  data,
  isOpen,
  isMinting,
  onFinish,
  setIsOpen,
}: {
  data: MintData;
  isOpen: boolean;
  isMinting: boolean;
  onFinish: (ticker: string, price: string, amount: string) => void;
  setIsOpen: (isOpen: any) => void;
}) => {
  const [wNEARBalance, setWNEARBalance] = useState<string>("0");
  const [btcBalance, setBTCBalance] = useState<string>("0");

  useEffect(() => {
    const fetchWNEARBalance = async () => {
      const accountId = getLocalStorage("runesAccountId");
      if (accountId) {
        const balance = await getwNEARBalance(accountId);
        setWNEARBalance(balance);
      }
    };

    const fetchBTCBalance = async () => {
      const btcAddress = getLocalStorage("btcAccountId");
      if (btcAddress) {
        try {
          const balance = await getBTCBalance(btcAddress);
          setBTCBalance(balance);
        } catch (error) {
          console.error("Error fetching BTC balance:", error);
        }
      }
    };

    fetchBTCBalance();

    fetchWNEARBalance();
  }, []);

  const checkUserCanBuy = () => {
    return (
      data.price &&
      data.amount &&
      BigInt(wNEARBalance) >=
        BigInt(data.amount!) * BigInt(data.price!) * BigInt(10 ** 18)
    );
  };

  return (
    <div
      onClick={() => setIsOpen(null)}
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
            className="max-w-md w-full mx-auto bg-black border border-gray-600 text-white overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between gap-x-20">
              <div>
                <p className="font-mono text-title text-xl font-bold tracking-tighter">
                  Mint Confirmation
                </p>
              </div>
              <div
                className="w-4 cursor-pointer hover:text-primary"
                onClick={() => setIsOpen(null)}
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
                You are about to buy:
              </label>
              <div>
                <div className="w-full flex items-center">
                  <div className="w-1/3 block font-mono font-bold uppercase">
                    RUNE TICKER
                  </div>
                  <div className="w-2/3 mt-1 font-bold text-right">
                    {data.ticker}
                  </div>
                </div>
                <div className="w-full flex items-center">
                  <div className="w-1/3 block font-mono font-bold uppercase">
                    RUNE AMOUNT
                  </div>
                  <div className="w-2/3 mt-1 font-bold text-right">
                    {data.amount}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full flex items-center">
                  <div className="w-1/3 block font-mono font-bold uppercase">
                    MY BALANCE
                  </div>
                  <div className="w-2/3 mt-1 font-bold text-right">
                    {wNEARBalance && (
                      <div className="font-mono">
                        {formatNearAmount(wNEARBalance)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full flex items-center">
                  <div className="w-1/3 block font-mono font-bold uppercase">
                    TOTAL PRICE
                  </div>
                  <div className="w-2/3 mt-1 font-bold text-right">
                    {data.price && data.amount && (
                      <div className="font-mono">
                        {formatNearAmount(
                          (
                            BigInt(data.amount!) *
                            BigInt(data.price!) *
                            BigInt(10 ** 18)
                          ).toString()
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center px-4 text-center mt-6 mb-4">
              <button
                onClick={() => {
                  onFinish(data.ticker!, data.price!, data.amount!);
                }}
                className={`w-full font-mono hover:bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-r-md border border-[#241F17] disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isMinting || !checkUserCanBuy()}
              >
                {isMinting ? (
                  <div className="loader flex items-center justify-center">
                    <svg
                      version="1.1"
                      id="loader"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="24px"
                      height="24px"
                      viewBox="0 0 50 50"
                    >
                      <path
                        fill="#fff"
                        d="M43.935,25.145c0-10.318-8.363-18.68-18.68-18.68c-10.318,0-18.68,8.363-18.68,18.68h4.068
    c0-8.073,6.539-14.612,14.612-14.612s14.612,6.539,14.612,14.612H43.935z"
                      >
                        <animateTransform
                          attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                          from="0 25 25"
                          to="360 25 25"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </div>
                ) : checkUserCanBuy() ? (
                  "MINT"
                ) : (
                  "INSUFFICIENT FUND"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
