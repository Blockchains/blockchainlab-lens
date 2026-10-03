document.getElementById("go").onclick = () => {
  const url = BLLens.fromText(document.getElementById("q").value, document.getElementById("c").value);
  if (!url) { document.getElementById("e").textContent = "Not a tx hash, address, ENS name or calldata."; return; }
  chrome.tabs.create({ url });
};
document.getElementById("q").addEventListener("keydown", (e) => { if (e.key === "Enter") document.getElementById("go").click(); });
