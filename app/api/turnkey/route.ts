import { NextRequest, NextResponse } from "next/server";
import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";

type TBody = {
  message: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as TBody;

  try {
    const client = new TurnkeyServerSDK({
      apiBaseUrl: process.env.TURNKEY_BASE_URL!,
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
    });

    const stacksPublicKey = process.env.TURNKEY_SIGNER_PUBLIC_KEY!;

    const response = await client.apiClient().signRawPayload({
      signWith: stacksPublicKey,
      payload: body.message,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_SHA256",
    });

    return NextResponse.json(response);
  } catch (e) {
    console.error(e);

    return NextResponse.json({ error: "failed to sign" }, { status: 500 });
  }
}
