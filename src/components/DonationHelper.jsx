import { useState, useEffect } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { createStacksSigner } from "../utils/StacksSigner";

export function useTurnkeyDonation(network = "testnet") {
  const { wallets, client } = useTurnkey();
  const [stacksSigner, setStacksSigner] = useState(null);

  useEffect(() => {
    if (client) {
      const signer = createStacksSigner(client, network);
      setStacksSigner(signer);
    }
  }, [client, network]);

  const getStacksAccounts = () => {
    return wallets
      .flatMap((wallet) => wallet.accounts || [])
      .filter((account) => account.addressFormat === "ADDRESS_FORMAT_STACKS");
  };

  const sendSTXWithTurnkey = async ({
    recipientAddress,
    amount,
    memo = "",
    walletAccount,
  }) => {
    if (
      !walletAccount ||
      walletAccount.addressFormat !== "ADDRESS_FORMAT_STACKS"
    ) {
      throw new Error("Invalid Stacks wallet account");
    }

    if (!stacksSigner) {
      throw new Error("StacksSigner not initialized");
    }

    try {
      const senderAddress = walletAccount.address;

      if (!senderAddress) {
        throw new Error("Wallet account missing address");
      }

      const signedTx = await stacksSigner.createSTXTransfer({
        recipient: recipientAddress,
        amount: amount * 1000000,
        memo,
        senderAddress,
        walletAccount,
      });

      const result = await stacksSigner.broadcastTransaction(signedTx);

      return result.txid;
    } catch (error) {
      console.error("Error sending STX with Turnkey:", error);
      throw error;
    }
  };

  const getStacksAddress = async (walletAccount) => {
    if (!stacksSigner) {
      throw new Error("StacksSigner not initialized");
    }
    return await stacksSigner.getStacksAddress(walletAccount);
  };

  const fetchBalance = async (walletAccount) => {
    if (!stacksSigner) {
      throw new Error("StacksSigner not initialized");
    }
    const address = await stacksSigner.getStacksAddress(walletAccount);
    return await stacksSigner.fetchBalance(address);
  };

  const signStacksMessage = async (message, walletAccount) => {
    if (!stacksSigner) {
      throw new Error("StacksSigner not initialized");
    }
    return await stacksSigner.signMessage(message, walletAccount);
  };

  const callContract = async (params) => {
    if (!stacksSigner) {
      throw new Error("StacksSigner not initialized");
    }
    try {
      const signedTx = await stacksSigner.createContractCall(params);
      const result = await stacksSigner.broadcastTransaction(signedTx);
      return result.txid;
    } catch (error) {
      console.error("Error calling contract:", error);
      throw error;
    }
  };

  return {
    getStacksAccounts,
    getStacksAddress,
    hasStacksWallets: getStacksAccounts().length > 0,
    fetchBalance,
    sendSTXWithTurnkey,
    callContract,
    signStacksMessage,
    stacksSigner,
  };
}

export default useTurnkeyDonation;
