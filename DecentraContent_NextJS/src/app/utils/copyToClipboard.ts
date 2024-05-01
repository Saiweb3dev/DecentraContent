export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      alert("IPFS hash copied to clipboard!");
    },
    (err) => {
      console.error("Failed to copy IPFS hash: ", err);
    }
  );
};