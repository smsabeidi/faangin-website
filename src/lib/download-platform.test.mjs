import assert from "node:assert/strict";
import test from "node:test";
import { detectDownloadPlatform } from "./download-platform.ts";

test("desktop detection offers only the corresponding installer", () => {
  for (const device of [
    { platform: "MacIntel", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
    { userAgentData: { platform: "macOS", mobile: false } },
    { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
  ]) assert.equal(detectDownloadPlatform(device), "mac");
  for (const device of [
    { platform: "Win32" },
    { platform: "Win64" },
    { userAgentData: { platform: "Windows", mobile: false } },
    { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  ]) assert.equal(detectDownloadPlatform(device), "windows");
});

test("phones, tablets, Linux and ChromeOS never receive a guessed Mac installer", () => {
  for (const device of [
    { platform: "iPhone", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" },
    { platform: "MacIntel", maxTouchPoints: 5, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)" },
    { userAgentData: { platform: "iOS", mobile: false } },
    { userAgentData: { platform: "Android", mobile: false } },
    { platform: "Linux armv8l", userAgent: "Mozilla/5.0 (Linux; Android 15; Mobile)" },
    { platform: "Linux x86_64", userAgent: "Mozilla/5.0 (X11; Linux x86_64)" },
    { userAgent: "Mozilla/5.0 (X11; CrOS x86_64 16093.0.0)" },
    { userAgentData: { platform: "Windows", mobile: true } },
  ]) assert.equal(detectDownloadPlatform(device), "unsupported");
});

test("missing or unrecognized platform data requires an explicit choice", () => {
  assert.equal(detectDownloadPlatform({}), "unknown");
  assert.equal(detectDownloadPlatform({ platform: "FreeBSD", userAgent: "A privacy browser" }), "unknown");
});
