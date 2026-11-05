"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { brand } from "@/lib/site-content";
import { getAirSceneMode, subscribeAirSceneMode, type AirSceneMode } from "@/lib/air-scene-mode";
import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/sites/cluely-com-efd0578a/shared/drawer";
import "./SiteHeader.css";

const headerItems = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Live copilot", href: "/#interview-support" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Compare", href: "/#compare" },
  { label: "FAQ", href: "/#faq" },
] as const;

function subscribeToScroll(notify: () => void) {
  window.addEventListener("scroll", notify, { passive: true });
  return () => window.removeEventListener("scroll", notify);
}
const getScrolled = () => window.scrollY > 24;
const getServerScrolled = () => false;
const getServerMode = (): AirSceneMode | null => null;

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pendingSection = useRef<string | null>(null);

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false} preventScrollRestoration>
      <DrawerTrigger aria-label="Open navigation menu" className="faangin-header-menu-trigger">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </DrawerTrigger>
      <DrawerContent
        className="faangin-header-menu"
        onCloseAutoFocus={event => {
          const section = pendingSection.current;
          pendingSection.current = null;
          if (!section) return;
          const target = document.getElementById(section);
          if (!target) return;
          // Wait for the drawer to release the body lock before following the anchor.
          event.preventDefault();
          requestAnimationFrame(() => target.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
            block: "start",
          }));
        }}
      >
        <div className="faangin-header-menu-heading">
          <DrawerTitle>Explore faangin</DrawerTitle>
          <button type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)}><X aria-hidden="true" size={22} /></button>
        </div>
        <DrawerDescription className="sr-only">Explore product features, pricing, and compatible desktop downloads.</DrawerDescription>
        <nav aria-label="Mobile navigation">
          {headerItems.map(item => <Link key={item.href} href={item.href} onClick={() => {
            pendingSection.current = item.href.split("#")[1];
            setOpen(false);
          }}>{item.label}<span aria-hidden="true">→</span></Link>)}
        </nav>
        <div className="faangin-header-menu-download"><DownloadButton showRequirements onDownload={() => setOpen(false)} /></div>
      </DrawerContent>
    </Drawer>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getServerScrolled);
  const mode = useSyncExternalStore(subscribeAirSceneMode, getAirSceneMode, getServerMode);

  return (
    <header className="faangin-site-header" data-scrolled={scrolled} data-sky-mode={mode ?? undefined}>
      <div className="faangin-header-inner">
        <div className="faangin-header-left">
          <nav className="faangin-header-nav" aria-label="Main navigation">
            {headerItems.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <MobileMenu key={pathname} />
        </div>
        <Link className="faangin-header-logo" href="/" aria-label={`${brand.name} home`}>
          <BrandLogo tone="cloud" className="faangin-header-wordmark" sizes="(min-width: 1100px) 124px, 104px" preload />
        </Link>
        <div className="faangin-header-actions">
          <Link href="/#demo" className="faangin-header-demo"><span className="faangin-header-demo-full">Explore demo</span><span className="faangin-header-demo-short">Explore</span></Link>
          <DownloadButton className="faangin-header-download" />
        </div>
      </div>
    </header>
  );
}
