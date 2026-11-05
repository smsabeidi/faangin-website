import Image from "next/image";
import { brand } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  sizes: string;
  preload?: boolean;
  tone?: "chrome" | "cloud";
};

export function BrandLogo({ className, sizes, preload = false, tone = "chrome" }: BrandLogoProps) {
  return (
    <Image
      src="/brand/faangin-logo.png"
      alt={brand.name}
      width={1855}
      height={848}
      sizes={sizes}
      preload={preload}
      className={cn("h-auto", className)}
      style={tone === "cloud" ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
