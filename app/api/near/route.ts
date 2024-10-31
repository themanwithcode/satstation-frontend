import { getConfig } from "@/config/near";
import { Account,  Connection } from "@near-js/accounts";
import { KeyPair } from "@near-js/crypto";
import { JsonRpcProvider } from "@near-js/providers";
import { InMemorySigner } from "@near-js/signers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
) {
  try {
    const { receiverId } = await req.json()

    const masterKeypairString: any = process.env.MASTER_ACCOUNT_KEYPAIR;
    if (!masterKeypairString) return;

    const masterKeypair = JSON.parse(masterKeypairString);

    const keyPair = KeyPair.fromString(masterKeypair.private_key);
    const { networkId, nodeUrl } = getConfig();
    const provider = new JsonRpcProvider({ url: nodeUrl });
    const signer = await InMemorySigner.fromKeyPair(
      networkId,
      masterKeypair.account_id,
      keyPair
    );
    const connection = new Connection(
      networkId,
      provider,
      signer,
      "jsvm.testnet"
    );
    const account = new Account(connection, masterKeypair.account_id);
    const result = await account.sendMoney(receiverId, BigInt(1))

    return NextResponse.json(result.toString(), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching network:", error);
    NextResponse.json({ error }, { status: 500 });
  }
}
