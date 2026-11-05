"use client";

import Image, { type StaticImageData } from "next/image";
import { m, type Transition, type Variants } from "motion/react";
import { images } from "@/components/sites/cluely-com-efd0578a/shared/assets";

/** Original module 84294 `p` / `h`. */
const iconVariants: Variants = { initial: { opacity: 0, z: 350 }, animate: { opacity: 1, z: 0 } };
const iconTransition: Transition = { type: "spring", stiffness: 400, damping: 120 };

type DockIconName = "launchpad" | "safari" | "settings" | "zoom" | "cluely" | "trash";
type DockItem = { type: "icon"; name: DockIconName } | { type: "separator" };

/** Original module 84294 `u`. */
const DOCK_ITEMS: DockItem[] = [
  { type: "icon", name: "launchpad" },
  { type: "icon", name: "safari" },
  { type: "icon", name: "settings" },
  { type: "icon", name: "zoom" },
  { type: "icon", name: "cluely" },
  { type: "separator" },
  { type: "icon", name: "trash" },
];

/** The original `"/images/pages/home/<name>-icon.png"` files, served from the shared assets module. */
const DOCK_ICONS: Record<DockIconName, StaticImageData> = {
  launchpad: images.launchpadIcon,
  safari: images.safariIcon,
  settings: images.settingsIcon,
  zoom: images.zoomIcon,
  cluely: images.cluelyIcon,
  trash: images.trashIcon,
};

/** Original module 84294 `m`: the macOS-style dock at the bottom of the demo frame (desktop only). */
export default function HeroDock({ delay = 0 }: { delay?: number }) {
  return (
    <div className="absolute right-0 bottom-2 left-0 hidden items-center justify-center lg:flex">
      <m.div
        className="flex items-center gap-0.5 rounded-xl border border-white/10 bg-white/10 px-1 pt-1 pb-1 backdrop-blur-lg perspective-midrange"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1, delayChildren: delay }}
      >
        {DOCK_ITEMS.map((item, index) =>
          item.type === "separator" ? (
            <m.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.1 * index }}
              className="mx-2 h-9 min-w-px rounded-full bg-white/30"
            />
          ) : (
            <m.div key={index} className="size-fit" variants={iconVariants} transition={iconTransition}>
              <Image
                src={DOCK_ICONS[item.name]}
                alt={item.name === "cluely" ? "faangin demo" : item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                width={44}
                height={44}
              />
            </m.div>
          ),
        )}
      </m.div>
    </div>
  );
}
