import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    const publicKey = process.env.TURNKEY_SIGNER_PUBLIC_KEY!;

    // Derive Stacks address from public key
    const { getAddressFromPublicKey } = await import("@stacks/transactions");
    const { STACKS_TESTNET } = await import("@stacks/network");
    const address = getAddressFromPublicKey(publicKey, STACKS_TESTNET);

    // Request from faucet API (using query parameters)
    const faucetRes = await fetch(
      `https://api.testnet.hiro.so/extended/v1/faucets/stx?address=${address}&stacking=false`,
      {
        method: "POST",
      },
    );

    if (!faucetRes.ok) {
      const errorText = await faucetRes.text();
      console.error("Faucet error:", errorText);

      if (faucetRes.status === 429) {
        throw new Error(
          "Rate limited! You can only claim once per 5 minutes. Try again later.",
        );
      }

      throw new Error(`Faucet request failed: ${faucetRes.status}`);
    }

    const responseText = await faucetRes.text();
    let faucetData;

    try {
      faucetData = JSON.parse(responseText);
    } catch (_e) {
      // If response is not JSON, it might be a success message
      if (responseText.includes("txid") || responseText.includes("success")) {
        return NextResponse.json({
          success: true,
          message: "STX claimed! Wait ~30 seconds for confirmation",
        });
      }
      throw new Error("Invalid faucet response");
    }

    return NextResponse.json({
      success: true,
      txid: faucetData.txId || faucetData.txid,
      message: "STX claimed! Wait ~30 seconds for confirmation",
    });
  } catch (e) {
    console.error("Faucet error:", e);
    return NextResponse.json(
      {
        error: "Failed to claim from faucet",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
