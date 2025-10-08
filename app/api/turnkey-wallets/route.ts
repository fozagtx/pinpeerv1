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

    const wallets = await client.apiClient().getWallets({
      organizationId: process.env.TURNKEY_ORGANIZATION_ID!,
    });

    return NextResponse.json(wallets);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
