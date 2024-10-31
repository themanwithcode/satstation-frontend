"use client";

import Image from "next/image";
import Link from "next/link";
import Nav from "./components/Nav";

export default function LandingPage() {
  return (
    <div className="">
      <Nav />

      <div className="flex flex-col items-center min-h-screen pb-12 font-mono text-[#EDEDED]">
        <main className="mt-20 text-center space-y-10 max-w-4xl">
          <h2 className="text-5xl font-bold leading-tight text-center mb-10">
            Create and Mint Bitcoin Rune with Near Protocol
          </h2>
          <Link
            href={"/launch"}
            className="px-8 py-3 my-4 font-mono bg-[#FFC240] text-black rounded-full font-bold text-lg hover:bg-[#E0B935] transition-all"
          >
            Launch Rune
          </Link>
        </main>

        <section id="about" className="mt-32 max-w-5xl text-center space-y-8">
          <h3 className="text-4xl font-bold">What is Rune Launchpad?</h3>
          <p className="text-gray-300">
            Rune Launchpad is a platform for minting custom runes, an innovative
            token standard on the Bitcoin network. Users can launch their own
            Bitcoin-native assets with ease, customizing supply, divisibility,
            and more.
          </p>
        </section>

        <section
          id="features"
          className="mt-20 max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-12"
        >
          <div className="flex flex-col items-center text-center">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="white"
                stroke-width="3"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="30"
                stroke="#FFC240"
                stroke-width="3"
                fill="none"
              />
              <line
                x1="50"
                y1="5"
                x2="50"
                y2="95"
                stroke="white"
                stroke-width="3"
              />
              <line
                x1="5"
                y1="50"
                x2="95"
                y2="50"
                stroke="white"
                stroke-width="3"
              />
              <path d="M50 20 L60 30 L50 40 L40 30 Z" fill="#FFC240" />
            </svg>

            <h4 className="text-xl font-bold mt-4">Decentralized</h4>
            <p className="text-gray-300">
              Immutable and trustless minting on the Bitcoin network.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="50,10 60,40 40,40 50,60 30,90 70,90 50,60"
                fill="#FFC240"
              />
              <line
                x1="10"
                y1="10"
                x2="90"
                y2="90"
                stroke="white"
                stroke-width="3"
              />
              <line
                x1="90"
                y1="10"
                x2="10"
                y2="90"
                stroke="white"
                stroke-width="3"
              />
            </svg>

            <h4 className="text-xl font-bold mt-4">Customizable</h4>
            <p className="text-gray-300">
              Create runes with custom supply, divisibility, and metadata.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                stroke="white"
                stroke-width="3"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="15"
                stroke="#FFC240"
                stroke-width="3"
                fill="none"
              />
              <line
                x1="50"
                y1="5"
                x2="50"
                y2="95"
                stroke="white"
                stroke-width="3"
              />
              <line
                x1="5"
                y1="50"
                x2="95"
                y2="50"
                stroke="white"
                stroke-width="3"
              />
            </svg>

            <h4 className="text-xl font-bold mt-4">Secure</h4>
            <p className="text-gray-300">
              Built on the secure, time-tested Bitcoin blockchain.
            </p>
          </div>
        </section>

        <footer id="faq" className="mt-20 max-w-4xl text-center space-y-10">
          <h3 className="text-4xl font-bold">FAQ</h3>
          <div className="space-y-6">
            <div className="text-left">
              <h4 className="font-bold text-xl">What is a rune?</h4>
              <p className="text-gray-300">
                A rune is a custom digital asset minted on the Bitcoin network,
                akin to tokens on other blockchains.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-xl">
                How can I create my own rune?
              </h4>
              <p className="text-gray-300">
                Use our simple interface to set the parameters for your rune,
                then mint it directly on the Bitcoin network.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
