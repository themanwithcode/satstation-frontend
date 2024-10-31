import {
  AddressPurposes,
  getAddress,
  signMessage as _xverseSignMessage,
} from "sats-connect";
import { Network } from "../types/Network";
import { XverseNetwork, XverseOnFinishResponse, XverseSignMessageOption } from "../types/Xverse";
import { getAddressFormat } from "./getAddressFormat";

export async function isXverseInstalled() {
  if (typeof window.BitcoinProvider !== "undefined") {
    return true;
  }

  return false;
}

export function fromXOnlyToFullPubkey(xOnly: string) {
  return `03${xOnly}`; // prepend y-coord/tie-breaker to x-only
}

export async function xverseConnect(network: Network) {
  network = network ?? "testnet";

  const result: Array<{
    publicKey: string;
    address: string;
    format: string;
    xKey?: string;
  }> = [];

  if (!isXverseInstalled()) {
    console.error("Xverse is not installed");
  }

  const handleOnFinish = (
    response: XverseOnFinishResponse,
    network: Network
  ) => {
    if (!response || !response.addresses || response.addresses.length !== 2) {
      console.error("Invalid address format");
    }

    response.addresses.forEach((addr) => {
      const format = getAddressFormat(addr.address, network).format;

      let xKey;
      if (format === "taproot") {
        xKey = addr.publicKey;
        addr.publicKey = fromXOnlyToFullPubkey(addr.publicKey);
      }

      result.push({
        publicKey: addr.publicKey,
        address: addr.address,
        format,
        xKey,
      });
    });
  };

  const xverseOption = {
    payload: {
        purposes: ['ordinals', 'payment'] as AddressPurposes[],
        message: "Provide access to 2 address formats",
        network :{
            type: (network.charAt(0).toUpperCase() + network.slice(1)) as XverseNetwork
        },
    },
    onFinish: (response: XverseOnFinishResponse) => handleOnFinish(response, network),
    onCancel: () => { console.error('Failed to connect wallet with Xverse') }
  }

  await getAddress(xverseOption)

  return result
}


export async function xverseSignMessage(
    option: XverseSignMessageOption
): Promise<null | {signature: string}> {
    let result = null
    if (!option.message || !option.network || !option.address) {
        console.error("Invalid arguments provided")
    }

    if (!isXverseInstalled()) {
        console.error('Xverse is not installed')
    }

    const handleFinish = (response: string) => {
        result = {
            signature: response
        }
    }

    const xverseOption = {
        payload: {
            network: {
                type: (option.network.charAt(0).toUpperCase() + option.network.slice(1)) as XverseNetwork
            },
            message: option.message,
            address: option.address,
            broadcast: false,
        },
        onFinish: handleFinish,
        onCancel: () => {
            console.error('Failed to sign messsage with Xverse')
        }
    }

    await _xverseSignMessage(xverseOption)

    return result
}
