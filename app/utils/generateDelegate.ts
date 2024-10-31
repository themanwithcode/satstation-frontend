import { getConfig } from "@/config/near";
import { JsonRpcProvider } from "@near-js/providers";
import { InMemorySigner } from "@near-js/signers";
import { unisatSignMessage } from "./unisat";
import { CryptoXor } from "crypto-xor";
import { KeyPair, KeyPairString } from "@near-js/crypto";
import { Account, Connection } from "@near-js/accounts";
import { SignedDelegateParams } from "../interfaces/near_interfaces";
import { buildDelegateAction, signDelegateAction } from "@near-js/transactions";
import { getLocalStorage } from "./localStorage";

export const generateSignedDelegate = async (params: SignedDelegateParams) => {
  const runesKeyPair = getLocalStorage('runesKeyPair')
  if (!runesKeyPair) {
    throw new Error(`No KeyPair`);
  }

  const signedMessage = await unisatSignMessage({
    message: "Testing Unisat message",
  });

  const encryptedKeyPair = Buffer.from(runesKeyPair, "base64").toString("hex");
  const decryptedKeyPair = CryptoXor.decrypt(encryptedKeyPair, signedMessage);
  const keyPair = KeyPair.fromString(decryptedKeyPair as KeyPairString);

  const accountId = getLocalStorage("runesAccountId") ?? ""

  const { networkId, nodeUrl } = getConfig();
  const provider = new JsonRpcProvider({ url: nodeUrl });
  const signer = await InMemorySigner.fromKeyPair(
    networkId,
    accountId?.toString(),
    keyPair
  );

  const connection = new Connection(
    networkId,
    provider,
    signer,
    "jsvm.testnet"
  );
  const nearAccount = new Account(connection, accountId);
  const signedDelegate = await nearAccount.signedDelegate(params)
  return signedDelegate

  const { header } = await provider.block({ finality: "final" });
  const delegateAction = buildDelegateAction({
    actions: params.actions,
    maxBlockHeight: BigInt(header.height) + BigInt(params.blockHeightTtl),
    nonce: BigInt("103066617000686"),
    publicKey: keyPair.getPublicKey(),
    receiverId: params.receiverId,
    senderId: accountId?.toString(),
  });
  const { signedDelegateAction } = await signDelegateAction({
    delegateAction,
    signer: {
      sign: async (message) => {
        const { signature } = await connection.signer.signMessage(
          message,
          delegateAction.senderId,
          connection.networkId
        );

        return signature;
      },
    },
  });

  return signedDelegateAction;
};
