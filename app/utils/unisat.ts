import { Network } from "../types/Network";
import { UnisatMessageOptions } from "../types/Unisat";
import { getAddressFormat } from "./getAddressFormat";

export function isUnisatInstalled() {
  if (typeof window.unisat !== "undefined") {
    return true;
  }

  return false;
}

export async function unisatConnect(network: Network) {
  if (!isUnisatInstalled) {
    console.error("Unisat is not installed");
  }

  await window.unisat.switchChain("BITCOIN_SIGNET")

  if (!network) {
    console.error("Invalid arguments provided")
  }

  const targetNetwork = "testnet"
  const connectedNetwork = await window.unisat.getNetwork()

  if (connectedNetwork !== targetNetwork) {
    await window.unisat.switchNetwork(targetNetwork)
  }

  const accounts = await window.unisat.requestAccounts()
  const publicKey = await window.unisat.getPublicKey()

  if (!accounts[0]) {
    return []
  }

  const addressFormat = getAddressFormat(accounts[0], network)

  return [
    {
        publicKey: publicKey,
        address: addressFormat.address,
        format: addressFormat.format
    }
  ]
}

export async function unisatSignMessage(options: UnisatMessageOptions) {
    if (!isUnisatInstalled()) {
        console.error("Unisat is not installed")
    }

    const message = options.message
    const type = options.type ?? "ecdsa"

    const signature = await window.unisat.signMessage(message, type)
    if (!signature) {
        console.error("Failed to sign message with Unisat")
    }

    return signature
}