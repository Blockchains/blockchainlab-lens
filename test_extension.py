# Loads the REAL unpacked extension in Chromium and checks that, on explorer tx/address URLs, the button + panel
# appear and the embedded Blockchain Lab Tools page renders LIVE on-chain data.
# Explorer pages themselves sit behind Cloudflare bot checks in headless CI, so the explorer HTML is replaced by a
# minimal page via request routing (the URL/hostname — which is all the extension reads — is the real one).
# Also tests the bookmarklet on the same pages.
import sys, tempfile, os, urllib.parse
from playwright.sync_api import sync_playwright
EXT = os.path.abspath("extension"); BM = open("bookmarklet/bookmarklet.txt").read().strip(); res = []
cases = [
  ("https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "USDC"),
  ("https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "USDC"),
  ("https://arbiscan.io/address/0xaf88d065e77c8cC2239327C5EDb3A432268e5831", "USDC"),
]
STUB = "<html><head><title>explorer</title></head><body><h1>Explorer page (stub)</h1></body></html>"
with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(tempfile.mkdtemp(), headless=True, channel="chromium",
        args=[f"--disable-extensions-except={EXT}", f"--load-extension={EXT}", "--no-sandbox"])
    for host in ["etherscan.io", "basescan.org", "arbiscan.io", "polygonscan.com"]:
        ctx.route(f"https://{host}/**", lambda r: r.fulfill(status=200, content_type="text/html", body=STUB))
    pg = ctx.new_page()
    # a real recent tx on Polygon for the tx path
    import json, urllib.request
    def rpc(m, prm): return json.loads(urllib.request.urlopen(urllib.request.Request("https://polygon-bor-rpc.publicnode.com", data=json.dumps({"jsonrpc":"2.0","id":1,"method":m,"params":prm}).encode(), headers={"content-type":"application/json","user-agent":"Mozilla/5.0 blockchainlab-lens-test"})).read())["result"]
    head = int(rpc("eth_blockNumber", []), 16); txh = rpc("eth_getBlockByNumber", [hex(head - 10), False])["transactions"][0]
    cases.append((f"https://polygonscan.com/tx/{txh}", "Status"))
    for url, expect in cases:
        for mode in ["extension", "bookmarklet"]:
            name = f"{mode} {url}"
            try:
                pg.goto(url, wait_until="domcontentloaded")
                if mode == "extension":
                    pg.wait_for_selector("#bl-lens-btn", timeout=15000); pg.click("#bl-lens-btn")
                else:
                    pg.evaluate("document.getElementById('bl-lens-btn')?.remove()")
                    pg.evaluate(urllib.parse.unquote(BM[len("javascript:"):]))
                pg.wait_for_selector("#bl-lens-panel iframe")
                fr = pg.frame_locator("#bl-lens-panel iframe"); fr.locator("#out table").first.wait_for(timeout=45000)
                txt = fr.locator("#out").inner_text(); assert expect in txt and "Error:" not in txt, txt[:300]
                res.append((name, "PASS")); print("PASS", name, "|", txt.replace("\n", " ")[:110])
            except Exception as e:
                res.append((name, "FAIL")); print("FAIL", name, str(e)[:300])
    # popup page
    try:
        sw = ctx.service_workers[0] if ctx.service_workers else ctx.wait_for_event("serviceworker", timeout=10000)
        ext_id = sw.url.split("/")[2]; pg.goto(f"chrome-extension://{ext_id}/popup.html"); assert "Blockchain Lab Lens" in pg.inner_text("body")
        res.append(("popup", "PASS")); print("PASS popup + service worker (context menu) loaded", ext_id)
    except Exception as e: res.append(("popup", "FAIL")); print("FAIL popup", e)
    ctx.close()
print(sum(r[1] == "PASS" for r in res), "/", len(res), "passed")
sys.exit(0 if all(r[1] == "PASS" for r in res) else 1)
