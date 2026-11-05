export const desktopDownloads = {
  mac: {
    label: "Get for Mac",
    filename: "Faangin-0.4.3-arm64.dmg",
    href: "/downloads/Faangin-0.4.3-arm64.dmg",
    requirements: "Apple Silicon · macOS 14.4 or later",
  },
  windows: {
    label: "Get for Windows",
    filename: "Faangin-0.4.3-Windows-x64-setup.exe",
    href: "/downloads/Faangin-0.4.3-Windows-x64-setup.exe",
    requirements: "64-bit Windows 10 (2004+) or Windows 11",
  },
} as const;

export const downloadChecksumsHref = "/downloads/SHA256SUMS.txt";
