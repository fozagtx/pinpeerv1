import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";
import {
  broadcastTransaction,
  createMessageSignature,
  makeUnsignedSTXTokenTransfer,
  sigHashPreSign,
  SingleSigSpendingCondition,
  TransactionSigner,
  type StacksTransactionWire,
} from "@stacks/transactions";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

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

  let transaction = await makeUnsignedSTXTokenTransfer({
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
  let preSignSigHash = sigHashPreSign(
    signer.sigHash,
    transaction.auth.authType,
    transaction.auth.spendingCondition.fee,
    transaction.auth.spendingCondition.nonce,
  );

  return preSignSigHash;
};

const signStacksTx = async () => {
  try {
    const stacksPublicKey = process.env.TURNKEY_SIGNER_PUBLIC_KEY!;

    let { stacksTransaction, stacksTxSigner } = await constructStacksTx(
      stacksPublicKey!,
    );
    let preSignSigHash = generatePreSignSigHash(
      stacksTransaction,
      stacksTxSigner,
    );

    const payload = `0x${preSignSigHash}`;

    const signature = await client?.apiClient().signRawPayload({
      payload,
      signWith: stacksPublicKey,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_NO_OP",
    });

    const nextSig = `${signature!.v}${signature!.r.padStart(64, "0")}${signature!.s.padStart(64, "0")}`;

    let spendingCondition = stacksTransaction.auth
      .spendingCondition as SingleSigSpendingCondition;
    spendingCondition.signature = createMessageSignature(nextSig);

    return stacksTransaction;
  } catch (err) {
    console.error("Signing failed:", err);
    return undefined;
  }
};

const handleBroadcastTx = async () => {
  let tx = await signStacksTx();

  let result = await broadcastTransaction({
    transaction: tx!,
    network: "testnet",
  });

  console.log("Broadcast Result:", result);
};

(async () => {
  await handleBroadcastTx();
})();
