// Injects an "Explain with Blockchain Lab" panel on block-explorer tx / address pages.
(function () {
  if (window.__blLens) return; window.__blLens = true;
  const t = BLLens.detect(location.href); if (!t || t.kind === "none") return;
  const btn = document.createElement("button");
  btn.id = "bl-lens-btn"; btn.textContent = t.kind === "tx" ? "Explain this tx · Blockchain Lab" : "Explain this address · Blockchain Lab";
  Object.assign(btn.style, { position: "fixed", right: "18px", bottom: "18px", zIndex: 2147483647, background: "#5eead4", color: "#04201c", border: "0", borderRadius: "999px", padding: "10px 16px", font: "600 14px system-ui,sans-serif", boxShadow: "0 4px 18px rgba(0,0,0,.25)", cursor: "pointer" });
  let panel;
  btn.onclick = () => {
    if (panel) { panel.remove(); panel = null; return; }
    panel = document.createElement("div"); panel.id = "bl-lens-panel";
    Object.assign(panel.style, { position: "fixed", right: "18px", bottom: "66px", width: "min(560px,94vw)", height: "78vh", zIndex: 2147483647, background: "#0b0e14", border: "1px solid #1f2633", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,.4)" });
    panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#0d1119;color:#e6e9ef;font:13px system-ui"><span>Blockchain Lab Lens</span><span><a href="${t.url}" target="_blank" rel="noopener" style="color:#5eead4">open in tab ↗</a></span></div><iframe src="${t.url}" style="width:100%;height:calc(100% - 34px);border:0;background:#0b0e14"></iframe>`;
    document.body.appendChild(panel);
  };
  document.body.appendChild(btn);
})();
