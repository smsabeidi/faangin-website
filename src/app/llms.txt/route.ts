import { proLaunchStatus, proPriceSummary } from "@/lib/pro-pricing";
import { absoluteUrl } from "@/lib/seo";

// Optional reading guide. This file is not an indexing or ranking directive.
export function GET() {
  const text = `# faangin

> faangin is an AI interview copilot for coding, system design, and behavioral interview guidance. The website offers a free interactive preview with illustrative responses.

Faangin Pro includes unlimited AI assistance without a personal API key. The launch price is ${proPriceSummary}. ${proLaunchStatus} The website preview does not call an AI provider. Desktop installers are available for Mac with Apple silicon (macOS 14.4 or later) and Windows 10 version 2004 or later / Windows 11 on x64 computers. Downloads are separate from the interactive preview. Preview controls do not demonstrate universal screen-sharing invisibility, live transcription, or interview outcomes.

## Desktop downloads

- [Mac with Apple silicon](${absoluteUrl("/downloads/Faangin-0.4.3-arm64.dmg")}): macOS 14.4 or later, arm64.
- [Windows installer](${absoluteUrl("/downloads/Faangin-0.4.3-Windows-x64-setup.exe")}): Windows 10 version 2004 or later, or Windows 11, x64.
- [SHA-256 checksums](${absoluteUrl("/downloads/SHA256SUMS.txt")}): Checksums for the published version 0.4.3 installers.

## Product and interview guidance

- [faangin overview](${absoluteUrl("/")}): Product overview, interactive preview, Pro pricing, and frequently asked questions.
- [Coding interviews](${absoluteUrl("/coding-interview")}): Correctness, complexity, edge cases, and changing constraints.
- [System design interviews](${absoluteUrl("/system-design-interview")}): Requirements, capacity, trade-offs, and failure recovery.
- [Behavioral interviews](${absoluteUrl("/behavioral-interview")}): Specific examples, individual ownership, and evidence of impact.

## Reference

- [XML sitemap](${absoluteUrl("/sitemap.xml")}): Canonical public pages.
- [Privacy policy draft](${absoluteUrl("/policies/privacy")}): Current preview scope and data handling.
- [Terms draft](${absoluteUrl("/policies/terms")}): Offer and use conditions.
- [Refund policy draft](${absoluteUrl("/policies/refund")}): Proposed subscription refund conditions.

Support: hi@faangin.com
`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
