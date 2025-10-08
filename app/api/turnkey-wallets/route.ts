import { NextRequest, NextResponse } from "next/server";
import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";

export async function GET(req: NextRequest) {
  try {
    const client = new TurnkeyServerSDK({
      apiBaseUrl: process.env.TURNKEY_BASE_URL!,
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
    });

    const walletsResponse = await client.apiClient().getWallets({
      organizationId: process.env.TURNKEY_ORGANIZATION_ID!,
    });

    // Fetch accounts for each wallet
    const walletsWithAccounts = await Promise.all(
      walletsResponse.wallets.map(async (wallet) => {
        try {
          const accountsResponse = await client.apiClient().getWalletAccounts({
            organizationId: process.env.TURNKEY_ORGANIZATION_ID!,
            walletId: wallet.walletId,
          });
          return {
            ...wallet,
            accounts: accountsResponse.accounts,
          };
        } catch (error) {
          console.error(
            `Failed to fetch accounts for wallet ${wallet.walletId}:`,
            error,
          );
          return {
            ...wallet,
            accounts: [],
          };
        }
      }),
    );

    return NextResponse.json({ wallets: walletsWithAccounts });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
