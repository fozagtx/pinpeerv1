import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const publicKey = process.env.TURNKEY_SIGNER_PUBLIC_KEY!;

    // Derive Stacks address from public key
    const { getAddressFromPublicKey } = await import("@stacks/transactions");
    const { STACKS_TESTNET } = await import("@stacks/network");
    const address = getAddressFromPublicKey(publicKey, STACKS_TESTNET);

    // Get balance from API
    const balanceRes = await fetch(
      `https://api.testnet.hiro.so/extended/v1/address/${address}/balances`,
    );
    const balanceData = await balanceRes.json();

    const stxBalance = (Number(balanceData.stx.balance) / 1_000_000).toFixed(6);

    return NextResponse.json({
      address,
      balance: stxBalance,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
