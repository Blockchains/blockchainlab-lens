// Blockchain Lab Lens bookmarklet (source). Built by Blockchain Lab — https://blockchainlab.com
(function(){var H={"etherscan.io":"ethereum","basescan.org":"base","arbiscan.io":"arbitrum","polygonscan.com":"polygon","optimistic.etherscan.io":"optimism","bscscan.com":"bsc","snowtrace.io":"avalanche"};
var T="https://blockchains.github.io/blockchainlab-tools",h=location.hostname.replace(/^www\./,""),c=H[h]||"ethereum",p=location.pathname,m,u;
if(m=p.match(/\/tx\/(0x[0-9a-fA-F]{64})/))u=T+"/tx/?chain="+c+"&hash="+m[1];
else if(m=p.match(/\/(?:address|token|contract)\/(0x[0-9a-fA-F]{40})/))u=T+"/address/?q="+m[1]+"&chain="+c;
else{var s=String(window.getSelection()||"").trim()||prompt("Blockchain Lab Lens: paste a tx hash, address or ENS name");if(!s)return;
u=/^0x[0-9a-fA-F]{64}$/.test(s)?T+"/tx/?chain="+c+"&hash="+s:T+"/address/?q="+encodeURIComponent(s)+"&chain="+c;}
u+="&utm_source=blockchainlab-lens&utm_medium=bookmarklet";
var o=document.getElementById("bl-lens-panel");if(o){o.remove();return;}
o=document.createElement("div");o.id="bl-lens-panel";o.style.cssText="position:fixed;right:18px;bottom:18px;width:min(560px,94vw);height:80vh;z-index:2147483647;background:#0b0e14;border:1px solid #1f2633;border-radius:12px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.4)";
o.innerHTML='<div style="display:flex;justify-content:space-between;padding:8px 12px;background:#0d1119;color:#e6e9ef;font:13px system-ui"><span>Blockchain Lab Lens</span><span><a href="'+u+'" target="_blank" style="color:#5eead4">open ↗</a> &nbsp; <a href="#" id="bl-lens-x" style="color:#9aa4b2">✕</a></span></div><iframe src="'+u+'" style="width:100%;height:calc(100% - 34px);border:0"></iframe>';
document.body.appendChild(o);document.getElementById("bl-lens-x").onclick=function(e){e.preventDefault();o.remove();};})();
