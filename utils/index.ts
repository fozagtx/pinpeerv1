import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";
import {
  broadcastTransaction,
  createMessageSignature,
  makeUnsignedSTXTokenTransfer,
  sigHashPreSign,
  TransactionSigner,
  type StacksTransactionWire,
} from "@stacks/transactions";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = new TurnkeyServerSDK({
  apiBaseUrl: process.env.TURNKEY_BASE_URL!,
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
  defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
});

const constructStacksTx = async (pubKey: string) => {
  const recipient = process.env.STACKS_RECIPIENT_ADDRESS!;
  const nonce = 0n;
  const fee = 180n;

  console.log("🔨 Constructing Stacks transaction...");
  console.log("   Recipient:", recipient);
  console.log("   Amount: 1 STX (1,000,000 microSTX)");
  console.log("   Public Key:", pubKey);

  const transaction = await makeUnsignedSTXTokenTransfer({
    recipient,
    amount: 1_000_000n,
    publicKey: pubKey,
    nonce,
    fee,
    network: "testnet",
  });

  const signer = new TransactionSigner(transaction);
  return { stacksTransaction: transaction, stacksTxSigner: signer };
};

const generatePreSignSigHash = (
  transaction: StacksTransactionWire,
  signer: TransactionSigner,
) => {
  const preSignSigHash = sigHashPreSign(
    signer.sigHash,
    transaction.auth.authType,
    transaction.auth.spendingCondition.fee,
    transaction.auth.spendingCondition.nonce,
  );

  console.log("📝 Generated preSignSigHash:", preSignSigHash);
  return preSignSigHash;
};

const signStacksTx = async () => {
  try {
    const stacksPublicKey = process.env.TURNKEY_SIGNER_PUBLIC_KEY!;
    const walletAccountAddress = process.env.TURNKEY_WALLET_ACCOUNT_ADDRESS!;

    console.log("\n=== Signing Stacks Transaction with Turnkey ===\n");

    const { stacksTransaction, stacksTxSigner } = await constructStacksTx(
      stacksPublicKey!,
    );

    const preSignSigHash = generatePreSignSigHash(
      stacksTransaction,
      stacksTxSigner,
    );

    console.log("\n🔐 Signing with Turnkey...");
    console.log("   Using wallet/private key:", walletAccountAddress);

    const signature = await client?.apiClient().signRawPayload({
      payload: preSignSigHash,
      signWith: walletAccountAddress,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_NO_OP",
    });

    console.log("✅ Signature received from Turnkey!");
    console.log("   r:", signature!.r);
    console.log("   s:", signature!.s);
    console.log("   v:", signature!.v);

    const nextSig = `${signature!.v}${signature!.r.padStart(64, "0")}${signature!.s.padStart(64, "0")}`;

    // Type assertion to access spendingCondition
    const spendingCondition = stacksTransaction.auth.spendingCondition as any;
    spendingCondition.signature = createMessageSignature(nextSig);

    console.log("\n✅ Transaction signed successfully!");
    return stacksTransaction;
  } catch (err) {
    console.error("\n❌ Signing failed:", err);
    return undefined;
  }
};

const handleBroadcastTx = async () => {
  console.log("\n🚀 Starting Stacks Transaction Broadcast Test\n");

  const tx = await signStacksTx();

  if (!tx) {
    console.error("❌ Failed to sign transaction. Cannot broadcast.");
    return;
  }

  console.log("\n📡 Broadcasting transaction to Stacks testnet...");

  try {
    const result = await broadcastTransaction({
      transaction: tx,
      network: "testnet",
    });

    console.log("\n🎉 SUCCESS! Transaction broadcast!");
    console.log("   Transaction ID:", result.txid);
    console.log(
      "   View on explorer: https://explorer.hiro.so/txid/" +
        result.txid +
        "?chain=testnet",
    );
  } catch (error) {
    console.error("\n❌ Broadcast failed:", error);
  }
};

(async () => {
  await handleBroadcastTx();
})();
