
export const signMessage = async (message: string) => {
  const response = await fetch("/api/turnkey", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  return await response.json();
};
