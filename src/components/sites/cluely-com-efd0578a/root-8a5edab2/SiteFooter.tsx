import { ArrowUp, Code2, MessagesSquare, Mic, Network } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import FooterMeadow from "./footer/FooterMeadow";
import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import "./SiteFooter.css";

const links = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Live copilot", href: "/#interview-support" },
  { label: "Your workspace", href: "/#undetectability" },
  { label: "Meeting notes", href: "/#interview-notes" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Compare", href: "/#compare" },
  { label: "FAQ", href: "/#faq" },
  { label: "Coding interviews", href: "/coding-interview" },
  { label: "System design interviews", href: "/system-design-interview" },
  { label: "Behavioral interviews", href: "/behavioral-interview" },
  { label: "Try the demo", href: "/#demo" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/policies/privacy#legal-top" },
  { label: "Terms of Service", href: "/policies/terms#legal-top" },
  { label: "Refund Policy", href: "/policies/refund#legal-top" },
];

const shortcuts = [
  { label: "Live interview support", href: "/#interview-support", icon: Mic },
  { label: "Coding interviews", href: "/coding-interview", icon: Code2 },
  { label: "Behavioral interviews", href: "/behavioral-interview", icon: MessagesSquare },
  { label: "System design interviews", href: "/system-design-interview", icon: Network },
  { label: "Back to top", href: "#top", icon: ArrowUp },
];

export default function SiteFooter({ backToTopHref = "#top" }: { backToTopHref?: string }) {
  return (
    <footer id="footer" data-footer-scene className="air-footer-footer">
      <div className="air-footer-scene">
        {backToTopHref === "#top" ? (
          <a href="#top" aria-label="faangin home" className="air-footer-wordmark">
            <BrandLogo sizes="(max-width: 767px) 78vw, 68vw" />
          </a>
        ) : (
          <Link href="/#top" aria-label="faangin home" className="air-footer-wordmark">
            <BrandLogo sizes="(max-width: 767px) 78vw, 68vw" />
          </Link>
        )}
        <FooterMeadow />
      </div>
      <div className="air-footer-links">
        <div className="air-footer-link-groups">
          <nav aria-label="Footer" className="air-footer-navigation">
            {links.map(({ label, href }) => <Link key={label} href={href}>{label}</Link>)}
          </nav>
          <nav aria-label="Legal" className="air-footer-legal">
            {legalLinks.map(({ label, href }) => <Link key={label} href={href}>{label}</Link>)}
          </nav>
        </div>
        <div className="air-footer-details">
          <DownloadButton />
          <nav aria-label="Interview shortcuts" className="air-footer-shortcuts">
            {shortcuts.map(({ label, href, icon: Icon }) => href === "#top" ? (
              <a key={label} href={backToTopHref} aria-label={label} title={label}>
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </a>
            ) : (
              <Link key={label} href={href} aria-label={label} title={label}>
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <p>faangin ©2026 All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
