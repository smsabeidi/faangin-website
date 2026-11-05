import type { StaticImageData } from "next/image";

// Namespaced asset roots for the cluely.com `/` clone.
export const PAGE_ASSETS = "/sites/cluely-com-efd0578a/root-8a5edab2";
export const SHARED_ASSETS = "/sites/cluely-com-efd0578a/shared";

const im = (file: string, width: number, height: number): StaticImageData => ({
  src: `${PAGE_ASSETS}/images/${file}`,
  width,
  height,
});

// Same metadata the production site's static imports carry (natural pixel sizes).
export const images = {
  wallpaper: im("wallpaper@2x.png", 1946, 1088),
  shimmer: im("shimmer.png", 54, 153),
  launchpadIcon: im("launchpad-icon.png", 130, 130),
  safariIcon: im("safari-icon.png", 130, 130),
  settingsIcon: im("settings-icon.png", 130, 130),
  zoomIcon: im("zoom-icon.png", 130, 130),
  cluelyIcon: im("cluely-icon.png", 130, 130),
  trashIcon: im("trash-icon.png", 130, 130),
  desktopNotes: im("desktop-notes-2.png", 3966, 2536),
  tabletNotes: im("tablet-notes.png", 3102, 2508),
  mobileNotes: im("mobile-notes.png", 1962, 2529),
  transcriptTab: im("transcript-tab.png", 2010, 2541),
  invisibleTool: im("invisible-tool.png", 852, 812),
  ginaHuels: im("gina-huels.png", 64, 65),
  toddCremin: im("todd-cremin.png", 64, 65),
  hollyGleason: im("holly-gleason.png", 64, 65),
  tomasHansen: im("tomas-hansen.png", 64, 65),
  cluelyLogoSvg: im("cluely.svg", 32, 32),
  eyeSvg: im("eye.svg", 21, 20),
  bgBlue: im("bg-blue.jpg", 820, 520),
  bgPink: im("bg-pink.jpg", 820, 520),
  bgPurpleDark: im("bg-purple-dark.jpg", 820, 520),
  bgPurple: im("bg-purple.jpg", 820, 520),
  fileBrowserCard: im("file-browser-card.png", 671, 525),
  messagingCard: im("messaging-card.png", 798, 517),
  videoConferenceCard: im("video-conference-card.png", 708, 475),
  videoPlayerCard: im("video-player-card.png", 971, 741),
  zoom: im("zoom.png", 453, 453),
  slack: im("slack.png", 422, 453),
  webex: im("webex.png", 465, 435),
  teams: im("teams.png", 465, 435),
  meet: im("meet.png", 453, 453),
  commandBtn: im("command-btn.png", 560, 476),
  commandActive: im("command-active.png", 560, 476),
  returnBtn: im("return-btn.png", 476, 476),
  returnActive: im("return-active.png", 476, 476),
  appleSvg: im("apple.svg", 27, 26),
  windowsSvg: im("windows.svg", 26, 26),
  step1: im("step-1.webp", 720, 480),
  step2: im("step-2.webp", 720, 480),
  step3: im("step-3.webp", 720, 480),
  fancy: im("fancy.png", 352, 352),
  mediaOutlets: im("media-outlets.png", 453, 38),
} as const;

export const shared = {
  wordmark: `${SHARED_ASSETS}/wordmark.svg`,
  wordmarkLight: `${SHARED_ASSETS}/wordmark-light.svg`,
  noiseWhite: `${SHARED_ASSETS}/patterns/noise-white.png`,
  noiseBlack: `${SHARED_ASSETS}/patterns/noise-black.png`,
} as const;

export const videos = {
  heroHevc: `${PAGE_ASSETS}/videos/hero-v2/pro-res-hevc-safari.mp4`,
  heroWebm: `${PAGE_ASSETS}/videos/hero-v2/pro-res-vp9-chrome.webm`,
} as const;

export const animations = {
  meetingCard: `${PAGE_ASSETS}/animations/meeting-card.riv`,
} as const;
