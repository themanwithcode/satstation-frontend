"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Nav from "../components/Nav";
import QRCode from "react-qr-code";
import { truncateAddress } from "../utils/address";
import { getRunesBalances, getwNEARBalance } from "../utils/near";
import { getBTCBalance } from "../utils/btc";
import { WithdrawModal } from "../components/WithdrawModal";
import { formatNearAmount } from "@near-js/utils";
import { getLocalStorage } from "../utils/localStorage";

const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // You can add a notification or state update here to inform the user
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};

export default function Launch() {
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<string>("");
  const [activeRune, setActiveRune] = useState<{
    ticker: string;
    amount: string;
  } | null>(null);

  const [wNEARBalance, setWNEARBalance] = useState<string>("0");
  const [btcBalance, setBTCBalance] = useState<string>("0");
  const [runeBalances, setRuneBalances] = useState<
    {
      ticker: string;
      balance: string;
    }[]
  >([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  useEffect(() => {
    const btcAccount = getLocalStorage("btcAccountId");
    const runesAccount = getLocalStorage("runesAccountId");
    setIsLoggedIn(!!btcAccount && !!runesAccount);
  }, []);

  const handleCopy = (address: string) => {
    if (address) {
      copyToClipboard(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };

  useEffect(() => {
    const fetchRuneBalances = async () => {
      const accountId = getLocalStorage("runesAccountId");
      if (accountId) {
        try {
          const result = await getRunesBalances(accountId);
          console.log(result);
          setRuneBalances(result);
        } catch (error) {
          console.error("Error fetching rune balances:", error);
        }
      }
    };

    fetchRuneBalances();
  }, []);

  console.log(runeBalances);

  if (!isLoggedIn) {
    return (
      <div>
        <Nav />
        <section className="mt-16 max-w-3xl mx-auto p-4">
          <h4 className="text-4xl font-bold">My Portfolio</h4>
          <div className="mt-12 text-center">
            <p className="mb-4">
              Please connect your wallet to view your portfolio
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <WithdrawModal
        data={activeRune}
        isOpen={isModalOpen === "withdrawModal"}
        setIsOpen={() => {
          setIsModalOpen("");
        }}
      />
      <Modal
        isOpen={isModalOpen === "depositBTC"}
        setIsOpen={() => {
          setIsModalOpen("");
        }}
        title="Deposit BTC"
      >
        <div className="flex items-center font-mono border border-[#241F17] rounded-l-md">
          <p className="p-2">
            {truncateAddress(getLocalStorage("btcAccountId"))}
          </p>
          <div>
            <button
              onClick={() =>
                handleCopy(getLocalStorage("btcAccountId") as string)
              }
              className="w-[120px] font-mono bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-r-md "
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="mt-4 pb-4">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={getLocalStorage("btcAccountId") || ""}
            viewBox={`0 0 256 256`}
          />
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpen === "depositwNEAR"}
        setIsOpen={() => {
          setIsModalOpen("");
        }}
        title="Deposit wNEAR"
      >
        <div className="flex items-center font-mono border border-[#241F17] rounded-l-md">
          <p className="p-2">
            {truncateAddress(getLocalStorage("runesAccountId"), 8, 8)}
          </p>
          <div>
            <button
              onClick={() =>
                handleCopy(getLocalStorage("runesAccountId") as string)
              }
              className="w-[120px] font-mono bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-r-md "
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="mt-4 pb-4">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={getLocalStorage("runesAccountId") || ""}
            viewBox={`0 0 256 256`}
          />
        </div>
      </Modal>

      <section className="mt-16 max-w-3xl mx-auto p-4">
        <h4 className="text-4xl font-bold">My Portfolio</h4>
        <div className="mt-12 flex justify-between space-x-4">
          <div className="w-1/2 border border-[#241F17] rounded-lg p-4">
            <p className="text-xl font-bold font-mono">BTC Balance</p>
            <p className="mt-2">{btcBalance} BTC</p>
            <button
              onClick={() => setIsModalOpen("depositBTC")}
              className="mt-4 w-full font-mono bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-md "
            >
              DEPOSIT BTC
            </button>
          </div>
          <div className="w-1/2 border border-[#241F17] rounded-lg p-4">
            <p className="text-xl font-bold font-mono">wNEAR Balance</p>
            <p className="mt-2">{formatNearAmount(wNEARBalance)} wNEAR</p>
            <button
              onClick={() => setIsModalOpen("depositwNEAR")}
              className="mt-4 w-full font-mono bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-md "
            >
              DEPOSIT wNEAR
            </button>
          </div>
        </div>
        {Array.isArray(runeBalances) && runeBalances.length > 0 && (
          <div className="mt-12 rounded-lg overflow-hidden border border-[#241F17]">
            <div className="flex p-4 text-[#FFC240] bg-[#241F17]">
              <div className="w-3/5 font-mono">TICKER</div>
              <div className="w-1/5 font-mono flex justify-end">AMOUNT</div>
              <div className="w-1/5 font-mono flex justify-end">ACTION</div>
            </div>

            {Array.isArray(runeBalances) &&
              runeBalances.map((rune) => (
                <div
                  key={rune.ticker}
                  className="flex p-4 border-b border-dashed border-[#241F17]"
                >
                  <div className="w-3/5 font-mono">{rune.ticker}</div>
                  <div className="w-1/5 font-mono flex justify-end">
                    {(BigInt(rune.balance) / BigInt(10 ** 18)).toString()}
                  </div>
                  <div
                    onClick={() => {
                      setActiveRune({
                        ticker: rune.ticker,
                        amount: rune.balance,
                      });
                      setIsModalOpen("withdrawModal");
                    }}
                    className="w-1/5 font-mono flex justify-end cursor-pointer hover:text-[#FFC240] transition-colors font-bold"
                  >
                    WITHDRAW
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
