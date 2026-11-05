import { readFile } from "node:fs/promises";

const origin = "https://www.faangin.com";
const keyFilename = "4a9d83ed806eb250f408ff39ba392281.txt";
const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== "--dry-run")) {
  console.error("Usage: npm run seo:indexnow -- [--dry-run]");
  process.exit(1);
}

async function request(url, init = {}) {
  const response = await fetch(url, { ...init, redirect: "error", signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`);
  return response;
}

function decodeXml(text) {
  return text.replace(/&(?:amp|lt|gt|quot|apos);/g, value => ({
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
  })[value]);
}

try {
  const key = (await readFile(new URL(`../public/${keyFilename}`, import.meta.url), "utf8")).trim();
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) throw new Error("The local IndexNow key file is invalid");
  const keyLocation = `${origin}/${keyFilename}`;
  const publishedKey = (await (await request(keyLocation)).text()).trim();
  if (publishedKey !== key) throw new Error("The published IndexNow key does not match the local key file");

  const sitemap = await (await request(`${origin}/sitemap.xml`)).text();
  const locations = [...sitemap.matchAll(/<loc\b[^>]*>([^<]+)<\/loc>/g)].map(match => decodeXml(match[1].trim()));
  const urlList = [...new Set(locations)];
  if (!urlList.length || urlList.length > 10_000) throw new Error("The sitemap must contain between 1 and 10,000 URLs");
  for (const value of urlList) {
    const url = new URL(value);
    if (url.origin !== origin || url.username || url.password || url.hash) throw new Error("The sitemap contains a URL outside the canonical site");
  }
  const body = { host: new URL(origin).host, key, keyLocation, urlList };
  if (args[0] === "--dry-run") {
    console.log(`Verified the published key and ${urlList.length} canonical sitemap URLs. No IndexNow submission was made.`);
  } else {
    const response = await request("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    if (response.status === 200) console.log(`IndexNow accepted ${urlList.length} URLs successfully (HTTP 200).`);
    else if (response.status === 202) console.log(`IndexNow accepted ${urlList.length} URLs with key verification pending (HTTP 202).`);
    else throw new Error(`Unexpected IndexNow response HTTP ${response.status}`);
  }
} catch (error) {
  console.error(`IndexNow submission failed. ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
