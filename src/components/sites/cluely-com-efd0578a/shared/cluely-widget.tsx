"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  ChevronDown,
  Ellipsis,
  Eye,
  EyeOff,
  House,
  Maximize2,
  MessageSquare,
  Move,
  RefreshCw,
  Sparkles,
  Square,
  WandSparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

/* ------------------------------------------------------------------ */
/* Action chips ("Assist · What should I say? · Follow-up questions · Recap") */
/* ------------------------------------------------------------------ */

export type Chip = { label: string; icon: ReactNode };

export const DEFAULT_CHIPS: Chip[] = [
  { label: "Guide me", icon: <Sparkles className="size-3.5" /> },
  { label: "Structure answer", icon: <WandSparkles className="size-3.5" /> },
  { label: "Follow-ups", icon: <MessageSquare className="size-3.5" /> },
  { label: "Key points", icon: <RefreshCw className="size-3.5" /> },
];

function Dot() {
  return <div className="size-[3px] shrink-0 rounded-full bg-[#898b91]" />;
}

export function ActionChips({
  chips = DEFAULT_CHIPS,
  variant = "separate",
  onChipClick,
  className,
}: {
  chips?: Chip[];
  variant?: "separate" | "widget";
  onChipClick?: (label: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1.5", className)}>
      {chips.map((chip, i) => (
        <span
          key={chip.label}
          className={cn(
            "group/static-insight flex items-center gap-2",
            variant === "widget" && i === 3 && "hidden xl:flex",
            variant === "widget" && i === 2 && "hidden md:flex",
            variant === "separate" && (i === 3 || i === 2) && "hidden sm:flex",
          )}
        >
          {i > 0 && <Dot />}
          <button
            type="button"
            onClick={() => onChipClick?.(chip.label)}
            className="flex items-center gap-1.5 rounded-full py-2 pr-2 pl-1.5 text-xs leading-none transition duration-75 ease-out group-hover/static-insight:bg-[#EDEEF2]/10"
          >
            <span className="shrink-0 text-[#b2b3ba] transition-colors duration-150 group-hover/static-insight:text-[#edeef2]">
              {chip.icon}
            </span>
            <span className="truncate text-[#edeef2]">{chip.label}</span>
          </button>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Control bar (logo · Hide/Ask · stop) */
/* ------------------------------------------------------------------ */

export function ControlBar({
  className,
  isHidden = false,
  onTogglePanel,
  isRecording = true,
  disabled = false,
  onStop,
  panelId,
}: {
  className?: string;
  isHidden?: boolean;
  onTogglePanel?: () => void;
  isRecording?: boolean;
  disabled?: boolean;
  onStop?: () => void;
  panelId?: string;
}) {
  return (
    <div
      className={cn("mx-auto flex w-fit items-center gap-1 rounded-full px-3 py-1.5", className)}
      style={{
        backgroundColor: "hsla(252, 10%, 10%, 0.8)",
        boxShadow: "0 0 0 1px rgba(207, 226, 255, 0.24), 0 -0.5px 0 0 rgba(255, 255, 255, 0.8)",
      }}
    >
      <Icons.cluely className="flex size-8 text-white mt-0.5 ml-0.5" />
      {isHidden ? (
        <button
          type="button"
          onClick={onTogglePanel}
          disabled={disabled}
          aria-expanded={false}
          aria-controls={panelId}
          className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(180deg, #0544a9 0%, #022c70 100%)",
            boxShadow: "0 0 0 0.5px #0c44a1, 0 -1px 0 0 #022c70 inset, 0 0.5px 0 0 #81b6ff inset",
          }}
        >
          <Sparkles className="size-4" />
          <span>Ask</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onTogglePanel}
          disabled={disabled}
          aria-expanded={true}
          aria-controls={panelId}
          className={cn(
            "flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium text-white bg-[linear-gradient(180deg,#2E3039_0%,#272A31_100%)] shadow-[0_0.7px_0_0_#AFB3C4_inset]",
            disabled ? "pointer-events-none" : "hover:scale-105",
          )}
        >
          <ChevronDown className="size-4 text-[#b2b3ba]" />
          <span>Hide</span>
        </button>
      )}
      {isRecording && (
        <button
          type="button"
          aria-label="Stop session"
          onClick={onStop}
          className="hover:scale-105 flex size-8 items-center justify-center rounded-full transition-colors bg-[linear-gradient(180deg,#2E3039_0%,#272A31_100%)] shadow-[0_0.7px_0_0_#AFB3C4_inset]"
        >
          <Square className="size-3.5 fill-white text-white" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Keybinds popover (opened from the "…" button) */
/* ------------------------------------------------------------------ */

function Kbd({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-white/20 bg-gradient-to-b from-black/10 to-black/15 px-1 font-mono text-[10px] text-white/50">
      {children}
    </span>
  );
}

const KEYBINDS = [
  { icon: Eye, label: "Show/hide faangin", keys: ["⌘", "\\"] },
  { icon: Move, label: "Move faangin", keys: ["⌘", "↑", "↓", "←", "→"] },
];

function KeybindsPopover({
  onClose,
  onToggleUndetectability,
  undetectabilityOn = false,
  triggerRef,
  id,
}: {
  onClose: () => void;
  onToggleUndetectability?: (on: boolean) => void;
  undetectabilityOn?: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) onClose();
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handler);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("keydown", escape);
    };
  }, [onClose, triggerRef]);
  return (
    <div ref={ref} id={id} role="dialog" aria-label="Keybinds and settings" className="absolute bottom-full left-0 z-50 mb-2 w-[260px]">
      <div
        className="rounded-xl border-[0.5px] border-white/[0.08] backdrop-blur-xl"
        style={{
          backgroundColor: "hsla(252, 10%, 10%, 0.96)",
          boxShadow: "0 0 0 1px rgba(207, 226, 255, 0.24), 0 16px 48px rgba(0,0,0,0.5)",
        }}
      >
        <div className="px-4 pt-3 pb-1 text-[11px] font-medium tracking-wide text-[#898b91]">Keybinds</div>
        {KEYBINDS.map(({ icon: Icon, label, keys }) => (
          <div key={label} className="flex w-full items-center gap-3 px-4 py-[7px]">
            <Icon className="size-4 shrink-0 text-[#898b91]" />
            <span className="flex-1 text-left text-[13px] text-[#edeef2]">{label}</span>
            <div className="flex items-center gap-0.5">
              {keys.map((k, i) => (
                <Kbd key={i}>{k}</Kbd>
              ))}
            </div>
          </div>
        ))}
        <div className="mx-4 my-1 h-px bg-white/[0.08]" />
        <button
          type="button"
          role="switch"
          aria-checked={undetectabilityOn}
          autoFocus
          onClick={() => onToggleUndetectability?.(!undetectabilityOn)}
          className="flex w-full items-center gap-3 px-4 py-2 transition-colors hover:bg-white/[0.05]"
        >
          <EyeOff className="size-4 shrink-0 text-[#898b91]" />
          <span className="flex-1 text-left text-[13px] text-[#edeef2]">Subtle overlay</span>
          <div
            className={cn(
              "flex h-[20px] w-[36px] shrink-0 items-center rounded-full p-0.5 transition-colors",
              undetectabilityOn ? "bg-[#4ADE80]" : "bg-white/20",
            )}
          >
            <div
              className={cn(
                "size-4 rounded-full bg-white shadow-sm transition-transform",
                undetectabilityOn ? "translate-x-4" : "translate-x-0",
              )}
            />
          </div>
        </button>
        <div className="h-2" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chat input ("Ask about your screen or conversation, or ⌘ ↵ for Assist") */
/* ------------------------------------------------------------------ */

function InputKbd({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[18px] w-4 items-center justify-center rounded-md border border-white/20 bg-gradient-to-b from-black/10 to-black/15 font-mono text-[9px] text-white/50 md:h-[22px] md:w-5 md:text-[10px]">
      {children}
    </span>
  );
}

function SendIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="ml-0.5 size-3">
      <path d="M2.5 1.5L10.5 6L2.5 10.5V1.5Z" />
    </svg>
  );
}

export function ChatInput({
  onSend,
  className,
  smartActive,
  onToggleSmart,
  onToggleUndetectability,
  undetectabilityOn,
  size = "md",
}: {
  onSend?: (value: string) => void;
  className?: string;
  smartActive?: boolean;
  onToggleSmart?: () => void;
  onToggleUndetectability?: (on: boolean) => void;
  undetectabilityOn?: boolean;
  size?: "sm" | "md";
}) {
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [localSmart, setLocalSmart] = useState(false);
  const [localUndetectable, setLocalUndetectable] = useState(false);
  const isSmart = smartActive ?? localSmart;
  const isUndetectable = undetectabilityOn ?? localUndetectable;
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const send = () => {
    if (value.trim()) {
      onSend?.(value);
      setValue("");
    }
  };
  const textSize = size === "sm" ? "text-[10px] md:text-[12px]" : "text-[11px] md:text-[13px]";
  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="rounded-xl"
        style={{ border: "0.5px solid rgba(155, 155, 155, 0.4)", boxShadow: "0 -1px 0 0 rgba(255, 255, 255, 0.25)" }}
      >
        <div className="relative">
          <input
            type="text"
            aria-label="Ask about this interview question"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            placeholder=""
            className={cn("block w-full resize-none bg-transparent p-2 pb-1.5 text-white outline-none md:p-2.5 md:pb-2", textSize)}
            style={{ boxShadow: "inset 0 2px 20px -1px rgba(0, 0, 0, 0.05)" }}
          />
          {!value && (
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center gap-1 p-2 pb-1.5 text-white/60 md:p-2.5 md:pb-2",
                textSize,
              )}
            >
              <span className="md:hidden">Ask about this question</span>
              <span className="hidden md:inline">Ask about this interview question</span>
              <InputKbd>⌘</InputKbd>
              <InputKbd>↵</InputKbd>
              <span className="hidden md:inline">for guidance</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-2 pt-0 pb-1.5 md:px-2.5 md:pb-2">
          <div className="relative flex items-center gap-1 md:gap-1.5">
            <button
              type="button"
              onClick={onToggleSmart ?? (() => setLocalSmart((active) => !active))}
              aria-pressed={isSmart}
              className={cn(
                "flex h-[22px] items-center gap-0.5 rounded-full border pl-1 pr-1.5 text-[10px] font-medium transition-all duration-150 md:h-[26px] md:gap-1 md:pl-1.5 md:pr-2 md:text-xs",
                isSmart
                  ? "border-yellow-200/60 bg-yellow-300/20 text-yellow-200/90 hover:border-yellow-200/80 hover:bg-yellow-300/30"
                  : "border-white/15 text-white/40 hover:border-white/25 hover:text-[#edeef2]",
              )}
              style={isSmart ? undefined : { backgroundColor: "hsla(252, 10%, 10%, 0.1)" }}
            >
              <Zap className="size-2.5 md:size-3" />
              Smart
            </button>
            <div className="relative">
              <button
                type="button"
                ref={menuTrigger}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Keybinds and settings"
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                aria-controls={menuOpen ? menuId : undefined}
                className="flex size-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-[#edeef2] md:size-7"
              >
                <Ellipsis className="size-3.5 md:size-4" />
              </button>
              {menuOpen && (
                <KeybindsPopover
                  id={menuId}
                  triggerRef={menuTrigger}
                  onClose={() => setMenuOpen(false)}
                  undetectabilityOn={isUndetectable}
                  onToggleUndetectability={onToggleUndetectability ?? setLocalUndetectable}
                />
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Send message"
            onClick={send}
            className="flex size-6 items-center justify-center rounded-full text-white transition-transform duration-[160ms] ease-out hover:scale-[1.03] active:scale-[0.97] md:size-7"
            style={{
              background: "linear-gradient(180deg, #0544a9 0%, #022c70 100%)",
              boxShadow: "0 0 0 0.5px #0c44a1, 0 -1px 0 0 #022c70 inset, 0 0.5px 0 0 #81b6ff inset",
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Message bubbles */
/* ------------------------------------------------------------------ */

export function Message({
  variant,
  children,
  className,
}: {
  variant: "user" | "assist" | "ai";
  children: ReactNode;
  className?: string;
}) {
  if (variant === "user" || variant === "assist") {
    const assist = variant === "assist";
    return (
      <div className={cn("flex justify-end", className)}>
        <div
          className={cn(
            "w-fit max-w-72 cursor-pointer select-text rounded-xl rounded-br-sm px-2.5 py-1.5 text-xs text-white",
            assist && "text-white/80",
          )}
          style={{
            background: assist
              ? "linear-gradient(180deg, #3a3d49 0%, #343841 100%)"
              : "linear-gradient(180deg, #0544a9 0%, #022c70 100%)",
            boxShadow: assist
              ? "0 -1px 0 0 #16171a inset, 0 0.5px 0 0 #afb3c4 inset"
              : "0 0 0 0.5px #0c44a1, 0 -1px 0 0 #022c70 inset, 0 0.5px 0 0 #81b6ff inset",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
  return <div className={cn("text-xs leading-[1.6] text-[#edeef2]", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Optional tab bar (Chat / Transcript) */
/* ------------------------------------------------------------------ */

function TabBar({
  defaultTab = "chat",
  onTabChange,
  profileName,
  className,
}: {
  defaultTab?: "chat" | "transcript";
  onTabChange?: (tab: "chat" | "transcript") => void;
  profileName?: string;
  className?: string;
}) {
  const [tab, setTab] = useState<"chat" | "transcript">(defaultTab);
  const change = (t: "chat" | "transcript") => {
    setTab(t);
    onTabChange?.(t);
  };
  return (
    <div className={cn("flex items-center justify-between border-b border-white/5 px-4 py-2.5", className)}>
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Home" className="transition-colors hover:text-white/70">
          <House className="size-3.5 text-white/50" />
        </button>
        {profileName && (
          <button type="button" className="flex items-center gap-1 text-xs font-medium text-white/70 transition-colors hover:text-white/90">
            {profileName}
            <ChevronDown className="size-2.5 text-white/50" />
          </button>
        )}
        <button
          type="button"
          onClick={() => change("chat")}
          className={cn("text-xs font-medium transition-colors", tab === "chat" ? "text-white/90" : "text-white/40 hover:text-white/60")}
        >
          Chat
        </button>
        <button
          type="button"
          onClick={() => change("transcript")}
          className={cn("text-xs transition-colors", tab === "transcript" ? "text-white/90" : "text-white/40 hover:text-white/60")}
        >
          Transcript
        </button>
      </div>
      <button type="button" aria-label="Expand" className="transition-colors hover:text-white/50">
        <Maximize2 className="size-3 text-white/30" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Full widget: control bar + translucent response panel */
/* ------------------------------------------------------------------ */

export function CluelyWidget({
  className,
  variant = "full",
  showControlBar = true,
  showActionChips = true,
  children,
  onChipClick,
  onSend,
  defaultHidden = false,
  defaultSmartActive = false,
  showTabBar = false,
  profileName,
  disableHideToggle = false,
  disableScroll = false,
}: {
  className?: string;
  variant?: "full" | "minimal";
  showControlBar?: boolean;
  showActionChips?: boolean;
  children?: ReactNode;
  onChipClick?: (label: string) => void;
  onSend?: (value: string) => void;
  defaultHidden?: boolean;
  defaultSmartActive?: boolean;
  showTabBar?: boolean;
  profileName?: string;
  disableHideToggle?: boolean;
  disableScroll?: boolean;
}) {
  const [hidden, setHidden] = useState(defaultHidden);
  const [smart, setSmart] = useState(defaultSmartActive);
  const [undetectable, setUndetectable] = useState(false);
  const [recording, setRecording] = useState(true);
  const panelId = useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showControlBar && variant !== "minimal" && (
        <ControlBar isHidden={hidden} panelId={panelId} onTogglePanel={disableHideToggle ? undefined : () => setHidden((h) => !h)} disabled={disableHideToggle} isRecording={recording} onStop={() => setRecording(false)} />
      )}
      <div
        id={panelId}
        aria-hidden={hidden}
        inert={hidden}
        className={cn(
          "origin-top transition-all duration-100 ease-out",
          hidden ? "pointer-events-none h-0 scale-[0.98] overflow-hidden opacity-0" : "opacity-100",
        )}
      >
        <div
          className={cn("flex flex-col rounded-2xl border", undetectable ? "border-dashed border-white/40" : "border-white/25")}
          style={{
            background: undetectable
              ? "linear-gradient(180deg, hsla(252,10%,10%,0.5) 0%, hsla(252,10%,10%,0.55) 100%)"
              : "linear-gradient(180deg, hsla(252,10%,10%,0.75) 0%, hsla(252,10%,10%,0.8) 100%)",
            boxShadow: "0 0 0 1px rgba(207, 226, 255, 0.24), 0 -0.5px 0 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          {showTabBar && <TabBar profileName={profileName} />}
          <div className="flex flex-1 flex-col p-4 pb-2">
            <div className="relative">
              <div
                className={cn(
                  "flex flex-1 flex-col gap-3 pr-1",
                  disableScroll ? "overflow-hidden" : "cluely-scrollbar max-h-[150px] overflow-x-hidden overflow-y-auto md:max-h-[150px]",
                )}
              >
                {children}
              </div>
            </div>
            {showActionChips && variant !== "minimal" && <ActionChips variant="widget" onChipClick={onChipClick} className="mt-3" />}
          </div>
          {variant !== "minimal" && (
            <div className="px-3 pb-3">
              <ChatInput
                onSend={onSend}
                smartActive={smart}
                onToggleSmart={() => setSmart((s) => !s)}
                onToggleUndetectability={setUndetectable}
                undetectabilityOn={undetectable}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
