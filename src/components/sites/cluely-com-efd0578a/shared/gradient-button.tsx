"use client";

import Image from "next/image";
import Link from "next/link";
import { isValidElement, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { cn } from "@/lib/utils";

export type GradientVariant = "blue-gradient" | "black-gradient" | "purple-gradient";

export type GradientButtonProps = {
  label: ReactNode;
  href?: string;
  className?: string;
  download?: boolean | string;
  variant: GradientVariant;
  isBlock?: boolean;
  /** React element, or an image src string rendered as a 26×26 next/image */
  icon?: ReactNode | string;
  rightIcon?: ReactNode;
  withAnimation?: boolean;
  asButton?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const BASE =
  "lg:h-11 px-3 md:w-[178px] w-fit h-10 rounded-[6px] relative font-semibold text-white inline-flex items-center justify-center lg:w-[199px] text-base leading-none";

function IconSlot({ icon, className }: { icon?: ReactNode | string; className: string }) {
  if (isValidElement(icon)) return icon;
  if (typeof icon === "string") return <Image className={className} src={icon} alt="" width={26} height={26} />;
  return null;
}

const Glow = () => (
  <>
    <span className="absolute -top-[52px] right-1 size-20 rounded-[100%] bg-[#7DF0F8] opacity-40 mix-blend-lighten blur-[30px]" />
    <span className="absolute top-[0px] right-1 h-[28px] w-20 rounded-[100%] bg-[#7DF0F8] opacity-40 mix-blend-lighten blur-[30px]" />
    <span className="absolute -bottom-[42px] -left-[19px] size-20 rounded-[100%] bg-[#7DF0F8] opacity-40 mix-blend-lighten blur-[30px]" />
  </>
);

/**
 * cluely.com's shared gradient button (blue = CTA "Get for Mac", purple = header/hero, black = unused here).
 * Markup and class strings mirror the production component 1:1.
 */
export function GradientButton({
  label,
  href,
  className,
  download,
  variant,
  isBlock = false,
  icon,
  rightIcon,
  withAnimation = false,
  asButton = false,
  onClick,
  disabled = false,
  type = "button",
}: GradientButtonProps) {
  const isExternal = href?.toString().startsWith("http") ?? false;
  const handleClick = () => onClick?.();

  const blue = (
    <>
      {withAnimation ? (
        <LazyMotion features={domAnimation}>
          <m.span
            className="inner-button-gradient-animation-wrapper absolute -top-px -left-px h-full w-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeIn" }}
            aria-hidden
          >
            <span className="inner-button-gradient-animation-background" />
            <span className="inner-button-gradient-animation-noise" />
          </m.span>
          <m.span
            className="inner-button-gradient-wrapper absolute -top-px -left-px h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeIn" }}
            aria-hidden
          >
            <span className="inner-button-gradient-background" />
            <span className="inner-button-gradient-noise" />
            <span className="inner-button-hover-gradient absolute inset-0 h-full w-full overflow-hidden" />
          </m.span>
        </LazyMotion>
      ) : (
        <span className="inner-button-gradient-wrapper absolute -top-px -left-px h-full w-full" aria-hidden>
          <span className="inner-button-gradient-background" />
          <span className="inner-button-gradient-noise" />
          <span className="inner-button-hover-gradient absolute inset-0 h-full w-full overflow-hidden" />
        </span>
      )}
      <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden>
        <span className="blurred-border absolute -top-px -left-px z-20 h-full w-full" />
      </span>
      {withAnimation ? (
        <LazyMotion features={domAnimation}>
          <m.span
            className="absolute -inset-px h-full w-full overflow-hidden rounded-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "linear" }}
            aria-hidden
          >
            <Glow />
          </m.span>
        </LazyMotion>
      ) : (
        <span className="absolute -inset-px h-full w-full overflow-hidden rounded-[6px]" aria-hidden>
          <Glow />
        </span>
      )}
      <span className="relative z-10 flex items-center gap-1.5 text-14 leading-none -tracking-[0.02em] lg:text-base">
        <IconSlot icon={icon} className="size-5 -translate-y-0.5 lg:size-[26px]" />
        {label}
        {rightIcon}
      </span>
    </>
  );

  const black = (
    <>
      <span className="inner-black-button-gradient absolute -top-[1px] -left-[1px] h-full w-full" aria-hidden>
        <span className="inner-black-button-hover-gradient absolute inset-0 h-full w-full overflow-hidden" />
      </span>
      <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden>
        <span className="blurred-border-black absolute -top-[1px] -left-[1px] z-20 h-full w-full" />
      </span>
      <span className="relative z-10 flex items-center gap-1.5 text-14 leading-none -tracking-[0.04em] lg:text-base">
        <IconSlot icon={icon} className="size-5 lg:size-[26px]" />
        {label}
        {rightIcon}
      </span>
    </>
  );

  const purple = (
    <>
      <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden>
        <span className="blurred-border absolute -top-px -left-px z-20 h-full w-full !rounded-[10px]" />
      </span>
      <span className="relative z-10 flex items-center gap-1.5 text-13 font-medium -tracking-[0.13px]">
        <IconSlot icon={icon} className="size-5 -translate-y-0.5 lg:size-[26px]" />
        {label}
        {rightIcon}
      </span>
    </>
  );

  const inner = { "blue-gradient": blue, "black-gradient": black, "purple-gradient": purple }[variant];
  const variantClass = cn(
    variant === "black-gradient" && "black-gradient-button",
    variant === "blue-gradient" && "blue-gradient-button",
    variant === "purple-gradient" && "purple-gradient-button",
  );

  if (asButton) {
    return (
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className={cn(BASE, variantClass, "disabled:cursor-not-allowed disabled:opacity-50", className)}
      >
        {inner}
      </button>
    );
  }
  if (isExternal) {
    return (
      <a
        href={href?.toString()}
        target="_blank"
        rel="noopener noreferrer"
        download={download}
        onClick={handleClick}
        className={cn(BASE, variantClass, className)}
      >
        {inner}
      </a>
    );
  }
  if (isBlock) {
    return <span className={cn(BASE, "focus:outline-none", variantClass, className)}>{inner}</span>;
  }
  return (
    <Link href={href ?? "#"} className={cn(BASE, variantClass, className)} download={download} onClick={handleClick}>
      {inner}
    </Link>
  );
}

/* ---------- plain purple pill (header fixed CTA, hero link, drawer trigger) ---------- */

const PURPLE_BASE =
  "rounded-[10px] flex items-center gap-[6px] w-fit text-white font-medium text-[16px] tracking-[-0.13px] p-[10px_20px] relative";

function PurpleInner({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden>
        <span className="blurred-border absolute -top-px -left-px z-20 h-full w-full" />
      </span>
      {children}
    </>
  );
}

export function PurpleButton({ children, className, type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn("purple-gradient-button", PURPLE_BASE, className)} {...rest}>
      <PurpleInner>{children}</PurpleInner>
    </button>
  );
}

export function PurpleLink({ children, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn("purple-gradient-button", PURPLE_BASE, className)} {...rest}>
      <PurpleInner>{children}</PurpleInner>
    </a>
  );
}
