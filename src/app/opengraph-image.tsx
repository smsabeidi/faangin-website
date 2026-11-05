import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "faangin AI copilot for interviews, meetings, and sales calls. Available for Mac and Windows.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const wordmark = await readFile(join(process.cwd(), "public/brand/faangin-logo.png"));
  const wordmarkSource = `data:image/png;base64,${wordmark.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 76px", background: "linear-gradient(145deg, #355588 0%, #739bca 58%, #dde2ee 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex" }}>
          {/* ImageResponse uses its own image renderer. */}
          <img src={wordmarkSource} width={300} height={137} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Your AI copilot.</div>
          <div style={{ display: "flex", fontSize: 30 }}>Interviews · Meetings · Sales calls</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22 }}>
          <span>Download for Mac and Windows</span>
          <span>www.faangin.com</span>
        </div>
      </div>
    ),
    size,
  );
}
