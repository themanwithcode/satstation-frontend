"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { unisatConnect, unisatSignMessage } from "../utils/unisat";
import Modal from "./Modal";
import { CryptoXor } from "crypto-xor";
import { KeyPair, KeyPairString } from "@near-js/crypto";
import nacl from "tweetnacl";
import { generateSeedPhrase } from "near-seed-phrase";
import { truncateAddress } from "../utils/address";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import { usePathname } from "next/navigation";
import { getBTCBalance } from "../utils/btc";
import { getwNEARBalance } from "../utils/near";
import { formatNearAmount } from "@near-js/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Nav() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<
    { publicKey: string; address: string; format: string }[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState("");

  const [isConnecting, setIsConnecting] = useState(false);

  const [wNEARBalance, setWNEARBalance] = useState<string>("0");
  const [btcBalance, setBTCBalance] = useState<string>("0");

  const pathname = usePathname();

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
    const btcAccountId = getLocalStorage("btcAccountId");
    const btcPubKey = getLocalStorage("btcPubKey");

    if (btcAccountId && btcPubKey) {
      setAddresses([
        { publicKey: btcPubKey, address: btcAccountId, format: "ed25519" },
      ]);
    }
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      setIsModalOpen("");
    }
  }, [addresses]);

  const onConnectUnisat = async () => {
    setIsConnecting(true);
    try {
      const result = await unisatConnect("testnet");
      if (!result[0].address.match(/^[mn]/)) {
        toast.error(
          "Please use a P2PKH address (starting with 'm' or 'n' on testnet)"
        );
        setIsConnecting(false);
        return;
      }
      await onSignMessageUnisat(result);
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const onSignMessageUnisat = async (
    addresses: {
      publicKey: string;
      address: string;
      format: string;
    }[]
  ) => {
    if (addresses.length === 0) return;

    const signedMessage = await unisatSignMessage({
      message: "Testing Unisat message",
    });

    const entropy = Buffer.from(nacl.hash(Buffer.from(signedMessage, "utf8")));
    const { secretKey } = generateSeedPhrase(entropy.subarray(0, 32));
    const keyPair = KeyPair.fromString(secretKey as KeyPairString);
    const publicKeyData = keyPair.getPublicKey().data;
    const implicitAccountId = Buffer.from(publicKeyData).toString("hex");

    const activateAccount = await fetch(`/api/near`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: implicitAccountId }),
    });
    if (!activateAccount.ok) {
      console.error(`Failed activate account`);
      return;
    }

    const encryptedKeyPair = Buffer.from(
      CryptoXor.encrypt(keyPair.toString(), signedMessage),
      "hex"
    ).toString("base64");

    setLocalStorage("runesKeyPair", encryptedKeyPair);
    setLocalStorage("runesAccountId", implicitAccountId);
    setLocalStorage("btcAccountId", addresses[0].address);
    setLocalStorage("btcPubKey", addresses[0].publicKey);

    setAddresses([
      {
        publicKey: addresses[0].publicKey,
        address: addresses[0].address,
        format: "ed25519",
      },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem("runesKeyPair");
    localStorage.removeItem("runesAccountId");
    localStorage.removeItem("btcAccountId");
    localStorage.removeItem("btcPubKey");
    setAddresses([]);

    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto flex items-center justify-between p-4 font-mono">
      <Modal
        isOpen={isModalOpen === "connect"}
        setIsOpen={() => {
          setIsModalOpen("");
        }}
        title="Connect Your Wallet"
      >
        <div className="pb-4 w-80">
          <div className="text-center mb-4">
            <p className="text-gray-400">
              Sign in securely with your Bitcoin wallet to access all features.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={onConnectUnisat}
              disabled={isConnecting}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 disabled:opacity-50 disabled:cursor-not-allowed"
              rel="noopener noreferrer"
            >
              {isConnecting ? "Connecting..." : "Connect Unisat"}
            </button>
          </div>
        </div>
      </Modal>
      <div className="w-2/12 font-bold">
        <Link href="/" className="text-yellow-500">
          SatStation
        </Link>
      </div>
      <div className="space-x-4 font-bold">
        <Link
          href="/launchpad"
          className={pathname === "/launchpad" ? "text-yellow-500" : ""}
        >
          Launchpad
        </Link>
        <Link
          href="/portfolio"
          className={pathname === "/portfolio" ? "text-yellow-500" : ""}
        >
          Portfolio
        </Link>
        <Link
          href="/launch"
          className={pathname === "/launch" ? "text-yellow-500" : ""}
        >
          Launch
        </Link>
      </div>
      <div className="w-2/12 flex justify-end">
        {addresses.length === 0 ? (
          <div
            className="flex items-center justify-between cursor-pointer border border-[#241F17] hover:bg-[#241F17] font-bold rounded-lg p-2"
            onClick={() => setIsModalOpen("connect")}
          >
            Connect
          </div>
        ) : (
          <div className="w-full">
            <div className="relative group">
              <div className="flex items-center justify-between cursor-pointer border border-[#241F17] hover:bg-[#241F17] font-bold rounded-lg p-2">
                <p>{truncateAddress(addresses[0].address, 4, 6)}</p>
                <svg
                  className="w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="overflow-hidden absolute right-0 mt-4 w-96 rounded-md shadow-lg bg-zinc-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                <div
                  className=""
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div className="px-4 pt-2">
                    <Link
                      href="/portfolio"
                      className="text-gray-400 hover:text-white"
                    >
                      <div className="flex items-center justify-between">
                        <p>My Balances</p>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                  <div className="px-4 py-2 space-y-2 text-white">
                    <div className="flex justify-between">
                      <p className="font-mono">Bitcoin</p>
                      <p className="">{btcBalance}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-mono">Wrapped NEAR</p>
                      <p className="">{formatNearAmount(wNEARBalance, 2)}</p>
                    </div>
                  </div>
                  <div className="border-t border-[#241F17]"></div>
                  <button
                    onClick={handleLogout}
                    className="font-bold font-mono block w-full text-left px-4 py-2 text-gray-300 hover:bg-[#241F17]"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
