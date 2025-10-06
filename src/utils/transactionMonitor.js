const HIRO_API_BASE =
  import.meta.env.VITE_HIRO_API_BASE_URL || "https://api.testnet.hiro.so";
const HIRO_API_KEY = import.meta.env.VITE_HIRO_API_KEY;

/**
 * Get headers with optional API key
 */
function getHeaders() {
  const headers = {
    Accept: "application/json",
  };

  if (HIRO_API_KEY) {
    headers["x-api-key"] = HIRO_API_KEY;
  }

  return headers;
}

/**
 * Monitor a transaction until it's confirmed or fails
 * @param {string} txId - Transaction ID to monitor
 * @param {function} onUpdate - Callback for status updates
 * @param {number} maxAttempts - Maximum polling attempts (default: 60)
 * @param {number} pollInterval - Milliseconds between polls (default: 5000)
 */
export async function monitorTransaction(
  txId,
  onUpdate,
  maxAttempts = 60,
  pollInterval = 5000,
) {
  let attempts = 0;

  const checkStatus = async () => {
    try {
      const response = await fetch(`${HIRO_API_BASE}/extended/v1/tx/${txId}`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Transaction not yet in mempool
          onUpdate({
            status: "pending",
            message: "Transaction submitted to mempool...",
          });
        } else {
          throw new Error(`API error: ${response.status}`);
        }
        return false;
      }

      const data = await response.json();

      // Check transaction status
      if (data.tx_status === "success") {
        onUpdate({
          status: "confirmed",
          message: "Transaction confirmed!",
          data: data,
          blockHeight: data.block_height,
          blockHash: data.block_hash,
        });
        return true;
      } else if (
        data.tx_status === "abort_by_response" ||
        data.tx_status === "abort_by_post_condition"
      ) {
        onUpdate({
          status: "failed",
          message: "Transaction failed",
          data: data,
        });
        return true;
      } else if (data.tx_status === "pending") {
        onUpdate({
          status: "pending",
          message: "Transaction pending in mempool...",
          data: data,
        });
        return false;
      }

      return false;
    } catch (error) {
      console.error("Error checking transaction status:", error);
      onUpdate({
        status: "error",
        message: "Error checking transaction status",
        error: error.message,
      });
      return false;
    }
  };

  // Start polling
  return new Promise((resolve) => {
    const poll = async () => {
      attempts++;

      const isComplete = await checkStatus();

      if (isComplete) {
        resolve();
        return;
      }

      if (attempts >= maxAttempts) {
        onUpdate({
          status: "timeout",
          message: "Transaction monitoring timeout. Please check explorer.",
        });
        resolve();
        return;
      }

      // Continue polling
      setTimeout(poll, pollInterval);
    };

    poll();
  });
}

/**
 * Get transaction details
 * @param {string} txId - Transaction ID
 * @returns {Promise} Transaction data
 */
export async function getTransaction(txId) {
  try {
    const response = await fetch(`${HIRO_API_BASE}/extended/v1/tx/${txId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
}

/**
 * Get explorer URL for transaction
 * @param {string} txId - Transaction ID
 * @param {string} network - Network (mainnet or testnet)
 * @returns {string} Explorer URL
 */
export function getExplorerUrl(txId, network = "testnet") {
  const baseUrl =
    network === "mainnet"
      ? "https://explorer.hiro.so/txid"
      : "https://explorer.hiro.so/txid";

  return `${baseUrl}/${txId}?chain=${network}`;
}
