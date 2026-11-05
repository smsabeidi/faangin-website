"use client";

import { useId, useSyncExternalStore } from "react";
import { ChevronDown, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { desktopDownloads } from "@/lib/downloads";
import { detectDownloadPlatform, type DownloadDevice, type DownloadPlatform } from "@/lib/download-platform";
import { AppleIcon, WindowsIcon } from "./icons";
import "./download-button.css";

const subscribe = () => () => {};
const serverPlatform = (): DownloadPlatform => "unknown";
const browserPlatform = (): DownloadPlatform => detectDownloadPlatform(navigator as Navigator & DownloadDevice);

function DownloadLink({ platform, prominent = false, requirementsId, onDownload }: { platform: "mac" | "windows"; prominent?: boolean; requirementsId?: string; onDownload?: () => void }) {
  const download = desktopDownloads[platform];
  const Icon = platform === "mac" ? AppleIcon : WindowsIcon;
  return <a
    className={cn("faangin-download-button", prominent && "faangin-download-prominent")}
    data-desktop-download={platform}
    href={download.href}
    download={download.filename}
    onClick={onDownload}
    title={download.requirements}
    aria-describedby={requirementsId}
  >
    <Icon aria-hidden="true" className="faangin-download-icon" />
    <span>{download.label}</span>
  </a>;
}

/** Downloads begin only after an explicit click on a compatible desktop installer. */
export function DownloadButton({ className, showRequirements = false, variant = "compact", onDownload }: {
  className?: string;
  showRequirements?: boolean;
  variant?: "compact" | "prominent";
  onDownload?: () => void;
}) {
  const id = useId();
  const platform = useSyncExternalStore(subscribe, browserPlatform, serverPlatform);
  const prominent = variant === "prominent";
  if (platform === "unsupported") return <span className={cn("faangin-download-availability", className)}>
    <Monitor aria-hidden="true" className="faangin-download-icon" />
    <span>Available for Mac &amp; Windows</span>
  </span>;

  if (platform === "unknown") return <details className={cn("faangin-download-chooser", className)}>
    <summary className={cn("faangin-download-button", prominent && "faangin-download-prominent")}>
      <Monitor aria-hidden="true" className="faangin-download-icon" />
      <span>Get Faangin</span>
      <ChevronDown aria-hidden="true" className="faangin-download-chevron" />
    </summary>
    <div className="faangin-download-options">
      {(["mac", "windows"] as const).map(target => <div key={target}>
        <DownloadLink platform={target} requirementsId={`${id}-${target}`} onDownload={onDownload} />
        <p id={`${id}-${target}`}>{desktopDownloads[target].requirements}</p>
      </div>)}
    </div>
  </details>;

  return <div className={cn("faangin-download", className)}>
    <DownloadLink platform={platform} prominent={prominent} requirementsId={showRequirements ? `${id}-requirements` : undefined} onDownload={onDownload} />
    {showRequirements && <p id={`${id}-requirements`} className="faangin-download-requirements">{desktopDownloads[platform].requirements}</p>}
  </div>;
}
