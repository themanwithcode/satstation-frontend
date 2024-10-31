"use client";

import { actionCreators, encodeSignedDelegate } from "@near-js/transactions";
import Nav from "../components/Nav";
import { SignedDelegateParams } from "../interfaces/near_interfaces";
import { generateSignedDelegate } from "../utils/generateDelegate";
import { useEffect, useState } from "react";
import { getRunes } from "../utils/near";
import { MintModal } from "../components/MintModal";
import { Rune } from "../types/Rune";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RuneCard from "../components/RuneCard";

export default function Launchpad() {
  const [runes, setRunes] = useState<Rune[]>([]);
  const [amount, setAmount] = useState<string>("1");
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [selectedRune, setSelectedRune] = useState<Rune | null>(null);

  const fetchRunes = async () => {
    const _runes = await getRunes();
    setRunes(_runes);
  };

  const onMintRune = async (ticker: string, price: string, _amount: string) => {
    setIsMinting(true);

    const amount = (
      BigInt(_amount) *
      BigInt(price) *
      BigInt(10 ** 18)
    ).toString();

    const actions = [];

    actions.push(
      actionCreators.functionCall(
        "ft_transfer_call",
        {
          amount: amount,
          receiver_id: "runes-contract-3.testnet",
          msg: ticker,
        },
        BigInt("300000000000000"),
        BigInt("1")
      )
    );

    const params: SignedDelegateParams = {
      actions,
      blockHeightTtl: 60,
      receiverId: "wrap.testnet",
    };

    const signedDelegate = await generateSignedDelegate(params);
    const encodedSignedDelegate = JSON.stringify(
      Array.from(encodeSignedDelegate(signedDelegate))
    );

    const response = await fetch(`https://relayer-testnet.paras.id/relay`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: encodedSignedDelegate,
    });

    if (!response.ok) {
      console.error(`Error sign and send delegate : ${response.statusText}`);
    }

    console.log(response);
    console.log(await response.json());

    setSelectedRune(null);
    setAmount("1");

    toast.success("Rune Minted Successfully", {
      position: "top-right",
      theme: "dark",
    });

    setIsMinting(false);
  };

  useEffect(() => {
    fetchRunes();
  }, []);

  return (
    <div>
      <Nav />
      <section className="mt-16 max-w-6xl mx-auto p-4">
        <h4 className="text-4xl font-bold">Mint Runes</h4>

        <div className="grid grid-cols-3 gap-2">
          {runes.map((rune, i) => (
            <RuneCard
              key={i}
              rune={rune}
              onMint={(amount) => {
                setSelectedRune(rune);
                setAmount(amount);
              }}
            />
          ))}
        </div>
      </section>

      <ToastContainer />

      <MintModal
        data={{
          ticker: selectedRune?.ticker,
          price: selectedRune?.price,
          amount: amount,
        }}
        isOpen={selectedRune !== null}
        isMinting={isMinting}
        onFinish={onMintRune}
        setIsOpen={setSelectedRune}
      />
    </div>
  );
}
