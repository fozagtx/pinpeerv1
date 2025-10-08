import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const privateKeyId = searchParams.get("privateKeyId");

    if (!privateKeyId) {
      return NextResponse.json(
        { error: "privateKeyId query parameter is required" },
        { status: 400 },
      );
    }

    const client = new TurnkeyServerSDK({
      apiBaseUrl: process.env.TURNKEY_BASE_URL!,
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
    });

    const privateKeyDetails = await client.apiClient().getPrivateKey({
      organizationId: process.env.TURNKEY_ORGANIZATION_ID!,
      privateKeyId: privateKeyId,
    });

    return NextResponse.json(privateKeyDetails);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
