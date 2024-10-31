import { Network } from "./Network"

export type XverseOnFinishResponse = {
    addresses: Array<{
        address: string,
        publicKey: string,
        purpose: "ordinals" | "payment"
    }>
}

export type XverseSignMessageOption = {
    address: string
    message: string
    network: Network
}

export type XverseNetwork = "Mainnet" | "Testnet"