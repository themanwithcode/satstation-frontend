"use client";

import { useState } from "react";
import Modal from "../components/Modal";
import Nav from "../components/Nav";
import { etchingRune, fundCommitAddress } from "../utils/rune";
import { EtchingRuneResponse } from "../types/Rune";
import { getLocalStorage } from "../utils/localStorage";
import { toast } from "react-toastify";
import { parseNearAmount } from "@near-js/utils";
import { RuneEtchingSchema } from "../interfaces/rune";

export default function Launch() {
  const [isModalOpen, setIsModalOpen] = useState<string>("");
  const [runeTicker, setRuneTicker] = useState<string>("");
  const [runeSymbol, setRuneSymbol] = useState<string>("");
  const [maxSupply, setMaxSupply] = useState<string>("");
  const [pricePerRune, setPricePerRune] = useState<string>("");
  const [etchingData, setEtchingData] = useState<EtchingRuneResponse | null>(
    null
  );

  const onEtchingRune = async () => {
    const btcPubKey = getLocalStorage("btcPubKey");

    const publicKey = btcPubKey;

    if (pricePerRune === "") return;

    const pricePerRuneInYoctoNear =
      parseNearAmount(pricePerRune) ?? BigInt(pricePerRune) * BigInt(10 ** 24);

    try {
      const etchingData: RuneEtchingSchema = {
        feeRate: 1,
        runeName: runeTicker,
        maxSupply: (BigInt(maxSupply) * BigInt(10 ** 18)).toString(),
        pricePerRune: (
          BigInt(pricePerRuneInYoctoNear) / BigInt(10 ** 18)
        ).toString(),
        userTapInternalKeyHex: publicKey!,
        divisibility: Number(18),
        symbol: runeSymbol,
        dataHex: Buffer.from("RUNES").toString("hex"),
        dataMimeType: "text/plain",
      };

      const etching = await etchingRune(etchingData);

      if (!etching) {
        console.log();
        // Handle error notif
        return;
      }

      setEtchingData(etching);

      setIsModalOpen("confirm");
    } catch (err) {
      toast.error((err as Error).message, {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  const onConfirm = async () => {
    if (!etchingData) {
      return;
    }

    const { commitAddress, minFundValue } = etchingData;
    await fundCommitAddress(commitAddress, minFundValue);

    setIsModalOpen("");
    setRuneTicker("");
    setRuneSymbol("");
    setMaxSupply("");
    setPricePerRune("");
    setEtchingData(null);
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen === "confirm"}
        setIsOpen={() => {
          setIsModalOpen("");
        }}
        title="Confirm Launch"
      >
        <div className="pb-4 w-80">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-mono">Gas Fee:</span>
              <span className="">{etchingData?.minFundValue} SATS</span>
            </div>
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between font-bold">
                <span className="font-mono">Total:</span>
                <span className="">{etchingData?.minFundValue} SATS</span>
              </div>
            </div>
          </div>
          <button
            className="w-full font-mono mt-6 bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-md hover:bg-[#362E22] transition-colors"
            onClick={() => onConfirm()}
          >
            CONFIRM
          </button>
        </div>
      </Modal>

      <Nav />
      <section className="mt-16 max-w-2xl mx-auto p-4">
        <h4 className="text-4xl font-bold">Launch Runes</h4>
        <p>Deploy and customize your Rune launch!</p>
        <div>
          <div className="flex space-x-4">
            <div className="w-1/2 mt-4">
              <label className="block font-mono font-bold uppercase text-sm">
                RUNE TICKER
              </label>
              <input
                type="text"
                className="w-full mt-2 p-2 bg-[black] border border-gray-600"
                onChange={(e) => setRuneTicker(e.target.value)}
                value={runeTicker}
              />
            </div>
            <div className="w-1/2 mt-4">
              <label className="block font-mono font-bold uppercase text-sm">
                RUNE SYMBOL
              </label>
              <input
                type="text"
                className="w-full mt-2 p-2 bg-[black] border border-gray-600"
                onChange={(e) => setRuneSymbol(e.target.value)}
                value={runeSymbol}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2 mt-4">
              <label className="block font-mono font-bold uppercase text-sm">
                MAX SUPPLY
              </label>
              <input
                type="text"
                className="w-full mt-2 p-2 bg-[black] border border-gray-600"
                onChange={(e) => setMaxSupply(e.target.value)}
                value={maxSupply}
              />
            </div>
            <div className="w-1/2 mt-4">
              <label className="block font-mono font-bold uppercase text-sm">
                PRICE PER RUNE (IN NEAR)
              </label>
              <input
                type="text"
                className="w-full mt-2 p-2 bg-[black] border border-gray-600"
                onChange={(e) => setPricePerRune(e.target.value)}
                value={pricePerRune}
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            onEtchingRune();
          }}
          disabled={
            !runeTicker ||
            !runeSymbol ||
            !maxSupply ||
            !pricePerRune ||
            runeTicker === "" ||
            runeSymbol === "" ||
            maxSupply === "" ||
            pricePerRune === ""
          }
          className="w-full font-mono mt-12 bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          LAUNCH RUNE
        </button>
      </section>
    </div>
  );
}
