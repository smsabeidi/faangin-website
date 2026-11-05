import Image from "next/image";
import { brand } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  sizes: string;
  preload?: boolean;
};

export function BrandLogo({ className, sizes, preload = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/faangin-logo.png"
      alt={brand.name}
      width={1855}
      height={848}
      sizes={sizes}
      preload={preload}
      className={cn("h-auto", className)}
    />
  );
}
