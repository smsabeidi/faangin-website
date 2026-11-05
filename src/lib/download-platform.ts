export type DownloadPlatform = "mac" | "windows" | "unsupported" | "unknown";

export interface DownloadDevice {
  platform?: string;
  userAgent?: string;
  maxTouchPoints?: number;
  userAgentData?: { platform?: string; mobile?: boolean };
}

/** Detect the operating system without treating an unrecognized device as a Mac. */
export function detectDownloadPlatform(device: DownloadDevice): DownloadPlatform {
  const platform = device.userAgentData?.platform || device.platform || "";
  const userAgent = device.userAgent || "";
  const tabletUsingMacIdentity = /Mac/i.test(platform) && (device.maxTouchPoints || 0) > 1;
  if (device.userAgentData?.mobile || /iPhone|iPad|iPod|Android|Mobile/i.test(userAgent) || /iOS|Android/i.test(platform) || tabletUsingMacIdentity) {
    return "unsupported";
  }
  if (/Windows|Win32|Win64|WinCE/i.test(platform) || /Windows NT/i.test(userAgent)) return "windows";
  if (/Mac/i.test(platform) || /Macintosh|Mac OS X/i.test(userAgent)) return "mac";
  if (/Linux|CrOS|Chrome OS/i.test(platform) || /Linux|CrOS/i.test(userAgent)) return "unsupported";
  return "unknown";
}
