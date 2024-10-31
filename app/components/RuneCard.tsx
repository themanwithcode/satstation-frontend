import { useState } from "react";
import { Rune } from "../types/Rune";
import { formatNearAmount } from "@near-js/utils";

interface RuneCardProps {
  rune: Rune;
  onMint: (amount: string) => void;
}

export default function RuneCard({ rune, onMint }: RuneCardProps) {
  const [amount, setAmount] = useState<string>("1");

  console.log(rune);

  return (
    <div className="w-full mt-4 p-4 border border-gray-600 rounded-lg">
      <label className="block font-mono font-bold uppercase text-md mb-4 text-xl">
        {rune.ticker}
      </label>

      <div className="flex flex-col space-y-2">
        <div className="flex">
          <label className="w-1/3 font-mono font-bold uppercase">SUPPLY</label>
          <span className="font-mono">
            {(BigInt(rune.total) / BigInt(10 ** 18)).toString()}
          </span>
        </div>
        <div className="flex">
          <label className="w-1/3 font-mono font-bold uppercase">MINTED</label>
          <span className="font-mono">
            {(BigInt(rune.minted) / BigInt(10 ** 18)).toString()}
          </span>
        </div>
        <div className="flex">
          <label className="w-1/3 font-mono font-bold uppercase">PRICE</label>
          <span className="font-mono">
            {formatNearAmount(
              (BigInt(rune.price) * BigInt(10 ** 18)).toString()
            )}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center font-mono">
        <div className="w-1/2">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-[#241F17] rounded-l-md focus-within:border-[#FFC240] bg-transparent py-2 px-4"
          />
        </div>
        <div className="w-1/2">
          <button
            onClick={() => onMint(amount)}
            className="w-full font-mono bg-[#241F17] text-[#FFC240] px-4 py-2 rounded-r-md border border-[#241F17]"
          >
            MINT
          </button>
        </div>
      </div>
    </div>
  );
}
