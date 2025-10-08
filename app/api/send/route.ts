import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";
import { NextRequest, NextResponse } from "next/server";
import {
  makeUnsignedSTXTokenTransfer,
  broadcastTransaction,
  createMessageSignature,
  TransactionSigner,
  sigHashPreSign,
  getAddressFromPublicKey,
} from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";

type TBody = {
  recipient: string;
  amount: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as TBody;

  try {
    console.log("\n=== SEND TRANSACTION REQUEST ===");
    console.log("Recipient:", body.recipient);
    console.log("Amount (STX):", body.amount);

    const client = new TurnkeyServerSDK({
      apiBaseUrl: process.env.TURNKEY_BASE_URL!,
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
    });

    const publicKey = process.env.TURNKEY_SIGNER_PUBLIC_KEY!;
    const walletAccountAddress = process.env.TURNKEY_WALLET_ACCOUNT_ADDRESS!;

    // Get nonce
    const senderAddress = getAddressFromPublicKey(publicKey, STACKS_TESTNET);
    console.log("Sender address:", senderAddress);

    const accountRes = await fetch(
      `https://api.testnet.hiro.so/v2/accounts/${senderAddress}?proof=0`,
    );
    const accountData = await accountRes.json();
    console.log("Balance (microSTX):", accountData.balance);
    console.log("Current nonce:", accountData.nonce);

    const nonce = BigInt(accountData.nonce);

    // Create transaction
    const amountMicroStx = BigInt(
      Math.floor(parseFloat(body.amount) * 1_000_000),
    );
    console.log("Amount to send (microSTX):", amountMicroStx.toString());
    console.log("Fee (microSTX): 180");

    const transaction = await makeUnsignedSTXTokenTransfer({
      recipient: body.recipient,
      amount: amountMicroStx,
      publicKey,
      nonce,
      fee: 180n,
      network: "testnet",
    });

    // Sign with Turnkey
    console.log("Creating transaction signer...");
    const signer = new TransactionSigner(transaction);
    const preSignSigHash = sigHashPreSign(
      signer.sigHash,
      transaction.auth.authType,
      transaction.auth.spendingCondition.fee,
      transaction.auth.spendingCondition.nonce,
    );
    console.log("SigHash to sign:", preSignSigHash);

    console.log("Requesting Turnkey signature...");
    const signature = await client.apiClient().signRawPayload({
      payload: preSignSigHash,
      signWith: walletAccountAddress,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_NO_OP",
    });
    console.log("Signature received:", {
      v: signature.v,
      r: signature.r.substring(0, 10) + "...",
      s: signature.s.substring(0, 10) + "...",
    });

    const nextSig = `${signature.v}${signature.r.padStart(64, "0")}${signature.s.padStart(64, "0")}`;
    const spendingCondition = transaction.auth.spendingCondition as {
      signature: ReturnType<typeof createMessageSignature>;
    };
    spendingCondition.signature = createMessageSignature(nextSig);

    console.log("Broadcasting transaction...");
    const result = await broadcastTransaction({
      transaction,
      network: "testnet",
    });
    console.log("Transaction broadcast successful:", result.txid);

    return NextResponse.json({ txid: result.txid });
  } catch (e) {
    console.error("\n=== SEND ERROR ===");
    console.error("Error type:", e?.constructor?.name);
    console.error("Error message:", e instanceof Error ? e.message : String(e));
    console.error("Full error:", e);
    if (e instanceof Error && e.stack) {
      console.error("Stack trace:", e.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to send transaction",
        details: e instanceof Error ? e.message : String(e),
        type: e?.constructor?.name,
      },
      { status: 500 },
    );
  }
}
