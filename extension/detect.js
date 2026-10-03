// Shared URL → target detection. Built by Blockchain Lab — https://blockchainlab.com
(function (root) {
  const HOSTS = { "etherscan.io": "ethereum", "basescan.org": "base", "arbiscan.io": "arbitrum", "polygonscan.com": "polygon", "optimistic.etherscan.io": "optimism", "bscscan.com": "bsc", "snowtrace.io": "avalanche", "base.blockscout.com": "base", "eth.blockscout.com": "ethereum", "arbitrum.blockscout.com": "arbitrum", "polygon.blockscout.com": "polygon", "optimism.blockscout.com": "optimism" };
  const TOOLS = "https://blockchains.github.io/blockchainlab-tools";
  function detect(href) {
    const u = new URL(href); const host = u.hostname.replace(/^www\./, "");
    const chain = HOSTS[host]; if (!chain) return null;
    let m = u.pathname.match(/\/tx\/(0x[0-9a-fA-F]{64})/); if (m) return { chain, kind: "tx", value: m[1], url: `${TOOLS}/tx/?chain=${chain}&hash=${m[1]}&utm_source=blockchainlab-lens` };
    m = u.pathname.match(/\/(?:address|token|contract)\/(0x[0-9a-fA-F]{40})/); if (m) return { chain, kind: "address", value: m[1], url: `${TOOLS}/address/?q=${m[1]}&chain=${chain}&utm_source=blockchainlab-lens` };
    return { chain, kind: "none" };
  }
  function fromText(text, chain = "ethereum") {
    const t = text.trim();
    if (/^0x[0-9a-fA-F]{64}$/.test(t)) return `${TOOLS}/tx/?chain=${chain}&hash=${t}&utm_source=blockchainlab-lens`;
    if (/^0x[0-9a-fA-F]{40}$/.test(t) || /^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/i.test(t)) return `${TOOLS}/address/?q=${t}&chain=${chain}&utm_source=blockchainlab-lens`;
    if (/^0x[0-9a-fA-F]{8,}$/.test(t)) return `${TOOLS}/abi/?data=${t}&utm_source=blockchainlab-lens`;
    return null;
  }
  root.BLLens = { detect, fromText, HOSTS, TOOLS };
  if (typeof module !== "undefined") module.exports = root.BLLens;
})(typeof globalThis !== "undefined" ? globalThis : this);
