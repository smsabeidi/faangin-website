"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils";
import { brand } from "@/lib/site-content";
import { BrandLogo } from "@/components/brand-logo";
import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/sites/cluely-com-efd0578a/shared/drawer";
import { routes } from "@/components/sites/cluely-com-efd0578a/shared/routes";

/* -------------------------------------------------------------------------- */
/*  Config (original module 83974: `c` site config, `u.header` / `u.headerV2`) */
/* -------------------------------------------------------------------------- */

type NavItem = {
  label: string;
  href?: string;
  isNew?: boolean;
};

/** `u.header` (mobile drawer) and `u.headerV2` (desktop links) are identical lists on cluely.com. */
const headerItems: NavItem[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Live copilot", href: "/#interview-support" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Compare", href: "/#compare" },
  { label: "FAQ", href: "/#faq" },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Exact predicate from the original header: true when the whole element is inside the viewport. */
function isFullyInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const y = window.scrollY || document.documentElement.scrollTop;
  return rect.top + y >= y && rect.bottom + y <= y + window.innerHeight;
}

function isActivePath(item: NavItem, path: string): boolean {
  return item.href === path;
}

/* -------------------------------------------------------------------------- */
/*  MenuItem (`L`) / MenuList (`M`)                                            */
/* -------------------------------------------------------------------------- */

function MenuItem({ item, currentPath, onNavigate }: { item: NavItem; currentPath: string; onNavigate: (href: string) => void }) {
  const isActive = isActivePath(item, currentPath);

  return (
    <li>
      <Link
        href={item.href ?? "#"}
        onClick={() => onNavigate(item.href ?? "#")}
        className={cn(
          "flex h-9 flex-1 items-center gap-x-2 text-base leading-snug font-medium tracking-tight hover:text-gray-40",
          isActive ? "text-primary" : "text-foreground",
        )}
      >
        <span>{item.label}</span>
        {item.isNew && (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">New</span>
        )}
      </Link>
    </li>
  );
}

function MenuList({ items, onNavigate }: { items: NavItem[]; onNavigate: (href: string) => void }) {
  const pathname = usePathname();
  if (!pathname) return null;
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <MenuItem key={item.label} item={item} currentPath={pathname} onNavigate={onNavigate} />
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  MobileMenu (`B`) — hamburger trigger + vaul bottom drawer                  */
/* -------------------------------------------------------------------------- */

function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pendingSection = useRef<string | null>(null);
  if (!items || items.length === 0) return null;

  const navigateToSection = (href: string) => {
    pendingSection.current = href.split("#")[1] ?? null;
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false} preventScrollRestoration>
      <DrawerTrigger aria-label="Open menu" className="relative ml-4 flex size-6 text-foreground outline-hidden md:hidden" suppressHydrationWarning>
        <span className="absolute -inset-3 lg:hidden" />
        <svg aria-hidden="true" className="-mr-1.5 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.99902 7.71436H19.999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.99902 16.2856H19.999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">Open menu</span>
      </DrawerTrigger>
      <DrawerContent
        className="flex h-[75dvh] flex-col rounded-t-xl border border-border p-0 lg:hidden"
        onCloseAutoFocus={event => {
          const section = pendingSection.current;
          pendingSection.current = null;
          if (!section) return;
          const target = document.getElementById(section);
          if (!target) return;
          // Scroll after the drawer releases Safari's body lock and focus restoration.
          event.preventDefault();
          requestAnimationFrame(() => target.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
            block: "start",
          }));
        }}
      >
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <div className="relative flex flex-1 flex-col overflow-y-auto px-5 pt-6 pb-12 md:px-8">
          <MenuList items={items} onNavigate={navigateToSection} />
          <div className="absolute inset-x-0 bottom-0 z-20 grid grid-cols-1 gap-6 px-5 pt-2 pb-5 md:px-8 md:pb-8">
            <DownloadButton onDownload={() => setOpen(false)} />
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full bg-linear-to-b from-transparent to-background"
          aria-hidden
        />
      </DrawerContent>
    </Drawer>
  );
}

/* -------------------------------------------------------------------------- */
/*  NavLink (`W`)                                                              */
/* -------------------------------------------------------------------------- */

function NavLink({ label, href, isNew, isOnDarkHero }: { label: string; href: string; isNew?: boolean; isOnDarkHero: boolean }) {
  return (
    <Link
      className={cn(
        "flex items-center justify-center gap-x-1.5 px-3.5 py-2 text-sm font-medium focus:underline",
        isOnDarkHero ? "text-white" : "text-foreground",
      )}
      href={href}
    >
      <span>{label}</span>
      {isNew && (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800">New</span>
      )}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  SiteHeader (`G`)                                                           */
/* -------------------------------------------------------------------------- */

export default function SiteHeader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(pathname !== routes.index);
  const { scrollY } = useScroll();
  const isOnDarkHero = pathname === routes.index || !!pathname?.startsWith("/affiliate/") || !!pathname?.startsWith("/policies/") || ["/coding-interview", "/system-design-interview", "/behavioral-interview"].includes(pathname ?? "");

  // The fixed "Get for Mac" button fades in only while the hero's #download-button is not fully visible.
  useMotionValueEvent(scrollY, "change", () => {
    const el = document.getElementById("download-button");
    setVisible(!el || !isFullyInViewport(el));
  });

  return (
    <header className="absolute z-9999 flex w-full pt-2.5" style={{ top: "var(--header-v2-top, 0px)" }}>
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center justify-between rounded-b-lg pr-5 md:pr-8",
          isOnDarkHero && "text-white",
        )}
      >
        <div className={cn("flex items-center justify-center gap-1 rounded-2xl px-3 py-1 lg:gap-7")}>
          <Link className="inline-flex shrink-0 items-center justify-center rounded lg:mr-7" href={routes.index} aria-label={`${brand.name} home`}>
            <BrandLogo className="w-28 md:w-32" sizes="(min-width: 768px) 128px, 112px" preload />
          </Link>
          <div className="flex hidden items-center md:flex">
            {headerItems.map((item) => (
              <NavLink key={item.label} label={item.label} href={item.href ?? "#"} isNew={item.isNew} isOnDarkHero={isOnDarkHero} />
            ))}
          </div>
        </div>

        <div
          className={cn(
            "fixed right-2.5 hidden h-fit items-center justify-center gap-2 transition-opacity duration-300 md:flex",
            visible ? "opacity-100" : "opacity-0",
          )}
          style={{ top: "calc(var(--header-v2-top, 0px) + 10px)" }}
          inert={!visible}
          aria-hidden={!visible}
        >
          <DownloadButton />
        </div>

        <MobileMenu key={pathname} items={headerItems} />
      </div>
    </header>
  );
}
