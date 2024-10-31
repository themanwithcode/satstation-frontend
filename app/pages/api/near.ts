import { KeyPair } from "@near-js/crypto";

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Generate a new key pair for an implicit account
    const keyPair = KeyPair.fromRandom("ed25519");
    const publicKey = keyPair.getPublicKey().toString();

    return res.status(200).json({
      publicKey,
    });
  } catch (error) {
    console.error("Error generating implicit account:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
