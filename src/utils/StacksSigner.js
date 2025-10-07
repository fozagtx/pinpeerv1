import {
  makeUnsignedSTXTokenTransfer,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  publicKeyFromSignatureVrs,
  createMessageSignature,
  TransactionSigner,
  sigHashPreSign,
} from "@stacks/transactions";
import {
  STACKS_TESTNET,
  STACKS_MAINNET,
  TransactionVersion,
} from "@stacks/network";

export class StacksSigner {
  constructor(turnkeyClient, network = "testnet") {
    this.turnkey = turnkeyClient;
    this.network = network === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;
    this.networkVersion =
      network === "mainnet"
        ? TransactionVersion.Mainnet
        : TransactionVersion.Testnet;
  }

  async getStacksAddress(walletAccount) {
    if (
      walletAccount.address &&
      walletAccount.addressFormat === "ADDRESS_FORMAT_STACKS"
    ) {
      return walletAccount.address;
    }
    throw new Error(
      "Stacks address derivation not yet implemented for this wallet type",
    );
  }

  async signTransaction(unsignedTx, walletAccount) {
    const signer = new TransactionSigner(unsignedTx);

    const preSignSigHash = sigHashPreSign(
      signer.sigHash,
      unsignedTx.auth.authType,
      unsignedTx.auth.spendingCondition.fee,
      unsignedTx.auth.spendingCondition.nonce,
    );

    const signedPayload = await this.turnkey.signRawPayload({
      signWith: walletAccount.address,
      payload: preSignSigHash,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_NO_OP",
    });

    const { r, s, v } = signedPayload;
    const nextSig = `${v}${r.padStart(64, "0")}${s.padStart(64, "0")}`;

    unsignedTx.auth.spendingCondition.signature =
      createMessageSignature(nextSig);

    return unsignedTx;
  }

  async createSTXTransfer({
    recipient,
    amount,
    memo = "",
    senderAddress,
    walletAccount,
    nonce,
    fee,
  }) {
    if (nonce === undefined) {
      nonce = await this.fetchNonce(senderAddress);
    }

    if (fee === undefined) {
      fee = 200;
    }

    const publicKey = walletAccount.publicKey || walletAccount.address;

    const txOptions = {
      recipient,
      amount,
      publicKey,
      network: this.network,
      memo,
      nonce,
      fee,
      anchorMode: AnchorMode.Any,
    };

    const unsignedTx = await makeUnsignedSTXTokenTransfer(txOptions);
    const signedTx = await this.signTransaction(unsignedTx, walletAccount);

    return signedTx;
  }

  async createContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    walletAccount,
    postConditions = [],
    nonce,
    fee,
  }) {
    const senderAddress = await this.getStacksAddress(walletAccount);

    if (nonce === undefined) {
      nonce = await this.fetchNonce(senderAddress);
    }

    if (fee === undefined) {
      fee = 500;
    }

    const txOptions = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderKey: "placeholder",
      network: this.network,
      postConditions,
      postConditionMode: PostConditionMode.Deny,
      nonce,
      fee,
      anchorMode: AnchorMode.Any,
    };

    const unsignedTx = await makeContractCall(txOptions);
    const signedTx = await this.signTransaction(unsignedTx, walletAccount);

    return signedTx;
  }

  async broadcastTransaction(signedTx) {
    const result = await broadcastTransaction(signedTx, this.network);
    if (result.error) {
      throw new Error(
        `Transaction broadcast failed: ${result.error} - ${result.reason}`,
      );
    }
    return {
      txid: result.txid || result,
      success: true,
    };
  }

  async fetchNonce(address) {
    const url = `${this.network.coreApiUrl}/v2/accounts/${address}?proof=0`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.nonce || 0;
    } catch (error) {
      console.error("Error fetching nonce:", error);
      return 0;
    }
  }

  async fetchBalance(address) {
    const url = `${this.network.coreApiUrl}/extended/v1/address/${address}/balances`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {
        stx: {
          balance: data.stx.balance,
          locked: data.stx.locked,
          total: parseInt(data.stx.balance) + parseInt(data.stx.locked),
        },
        fungibleTokens: data.fungible_tokens || {},
        nonFungibleTokens: data.non_fungible_tokens || {},
      };
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  }

  async signMessage(message, walletAccount) {
    const signature = await this.turnkey.signMessage({
      walletAccount,
      message,
    });
    return {
      signature,
      publicKey: walletAccount.publicKey,
      address: await this.getStacksAddress(walletAccount),
    };
  }

  verifyMessage(message, signature, publicKey) {
    try {
      const recoveredPubKey = publicKeyFromSignatureVrs(
        message,
        createMessageSignature(signature),
      );
      return recoveredPubKey === publicKey;
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  }
}

export function createStacksSigner(turnkeyClient, network = "testnet") {
  return new StacksSigner(turnkeyClient, network);
}

export default StacksSigner;
