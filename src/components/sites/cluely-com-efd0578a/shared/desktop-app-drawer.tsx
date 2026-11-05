"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleAlert, Laptop, LoaderCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./drawer";
import { PurpleButton } from "./gradient-button";
import { ShimmerLeft, ShimmerRight } from "./shimmer";
import { routes } from "./routes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Optional campaign drawer for exploring the faangin preview.
 * The email interaction remains a local demonstration and does not send email.
 */
export function DesktopAppDrawer({
  className,
  hasShimmer = true,
  forceShow = false,
  trigger,
  shimmerRepeatDelay,
}: {
  className?: string;
  hasShimmer?: boolean;
  forceShow?: boolean;
  trigger?: ReactNode;
  shimmerRepeatDelay?: number;
}) {
  const [invalid, setInvalid] = useState(false);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [showSent, setShowSent] = useState(false);
  const [sentVisible, setSentVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const emailId = useId();
  const linkInput = useRef<HTMLInputElement>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const label = "Try the demo";

  useEffect(
    () => () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
      if (submitTimer.current) clearTimeout(submitTimer.current);
    },
    [],
  );

  const clearReveal = () => {
    if (revealTimer.current) {
      clearTimeout(revealTimer.current);
      revealTimer.current = null;
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      clearReveal();
      if (submitTimer.current) {
        clearTimeout(submitTimer.current);
        submitTimer.current = null;
      }
      setEmail("");
      setSentEmail("");
      setShowSent(false);
      setSentVisible(false);
      setCopyStatus("");
      setInvalid(false);
      setSending(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setSending(true);
    submitTimer.current = setTimeout(() => {
      submitTimer.current = null;
      setSentEmail(value);
      setSending(false);
    }, 600);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(routes.demo, window.location.origin).href);
      setCopyStatus("Link copied");
    } catch {
      linkInput.current?.focus();
      linkInput.current?.select();
      setCopyStatus("Select and copy the link above.");
    }
  };

  return (
    <Drawer dismissible={false} shouldScaleBackground={false} open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        {trigger ?? (
          <PurpleButton className={cn("relative overflow-hidden", className, !forceShow && "sm:hidden")}>
            {hasShimmer && <ShimmerLeft repeatDelay={shimmerRepeatDelay} />}
            <Laptop />
            <span>{label}</span>
          </PurpleButton>
        )}
      </DrawerTrigger>
      <DrawerContent hasHandle={false} className="flex max-h-dvh flex-col items-center overflow-x-hidden overflow-y-auto border-none bg-transparent px-0 pt-30 pb-0">
        <DrawerTitle className="sr-only">Try the demo</DrawerTitle>
        <DrawerDescription className="sr-only">Open the faangin preview and copy its link. This demo does not send email.</DrawerDescription>
        <motion.div
          initial={false}
          animate={{ height: sentEmail ? 650 : 550 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="relative w-full shrink-0 overflow-visible rounded-t-[36px] border bg-gradient-to-b from-[#E9F4FF] to-white px-8"
        >
          <motion.button
            type="button"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => handleOpenChange(false)}
            className={cn(
              "pointer-events-auto absolute top-4 right-5 z-[100] rounded-full p-2 text-[#6E6C7A] transition hover:bg-black/5 hover:text-[#2B2841]",
            )}
            aria-label="Close"
          >
            <X className="size-4.5" />
          </motion.button>
          <div className="absolute -top-14 left-0 flex w-full flex-col items-center">
            <div aria-hidden className="flex aspect-square size-[172px] items-center justify-center rounded-[36px] bg-gradient-to-br from-blue-400 to-indigo-700 text-3xl font-semibold tracking-tight text-white shadow-xl">faangin</div>
            <motion.div layout transition={{ duration: 0.35, ease: "easeInOut" }} className="flex w-full flex-col items-center justify-center gap-8">
              <AnimatePresence
                initial={false}
                onExitComplete={() => {
                  if (sentEmail) {
                    clearReveal();
                    setShowSent(true);
                    revealTimer.current = setTimeout(() => {
                      setSentVisible(true);
                      revealTimer.current = null;
                    }, 350);
                  }
                }}
              >
                {!sentEmail && (
                  <motion.form
                    key="email-form"
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center gap-4"
                    noValidate
                    aria-busy={sending}
                    onSubmit={submit}
                  >
                    <div className="flex w-full flex-col items-center justify-center gap-6">
                      <div className="flex flex-col justify-center gap-1 text-center">
                        <h2 className="flex items-center justify-center gap-3 text-[32px] font-medium whitespace-nowrap text-[#2B2841]">
                          <span>Preview faangin</span>
                        </h2>
                        <p className="text-[16px] leading-[135%] text-[#6E6C7A]">
                          A closer look at live interview support.
                          <br />
                          No email is sent from this demo.
                        </p>
                      </div>
                      <div className="relative p-1">
                        <label htmlFor={emailId} className="sr-only">Email address</label>
                        <input
                          id={emailId}
                          type="email"
                          inputMode="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          className="w-[18rem] rounded-xl bg-[#FEFFFF] py-2.5 pr-10 pl-2.5 text-[16px] font-medium text-[#0c1747] placeholder:text-[#C2CAE3] focus-visible:outline-[#081861]"
                          style={{ boxShadow: "0 0 0.3px 0.6px rgba(33, 77, 144, 0.10), 0 1.5px 1px 0 rgba(33, 77, 144, 0.09)" }}
                          placeholder="Enter your email"
                          aria-invalid={invalid}
                          aria-describedby={invalid ? `${emailId}-error` : undefined}
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setInvalid(false); }}
                          onBlur={() => setInvalid(!EMAIL_RE.test(email.trim()))}
                        />
                        {invalid && (
                          <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <CircleAlert aria-hidden className="size-4 text-[#F16C6C]" />
                            <span id={`${emailId}-error`} role="alert" className="sr-only">Enter a valid email address.</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <PurpleButton type="submit" disabled={sending} className="relative w-[18rem]! overflow-hidden disabled:cursor-not-allowed disabled:opacity-70">
                      <div className="mx-auto flex items-center gap-x-2">
                        <ShimmerRight />
                        {sending ? (
                          <>
                            <LoaderCircle className="size-4 animate-spin" />
                            <span>Preparing...</span>
                          </>
                        ) : (
                          <>
                            <span>Continue in Demo</span>
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </div>
                    </PurpleButton>
                  </motion.form>
                )}
              </AnimatePresence>
              <motion.p layout transition={{ duration: 0.35, ease: "easeInOut" }} className="text-center text-sm text-[#6E6C7A]">
                Clearer thinking for the question in front of you.
              </motion.p>
              <AnimatePresence initial={false}>
                {showSent && (
                  <motion.div
                    key="email-sent"
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: sentVisible ? 1 : 0, y: sentVisible ? 0 : 6 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex max-w-[18rem] flex-col items-center gap-3 text-center"
                  >
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <h2 className="text-[28px] font-medium whitespace-nowrap text-[#2B2841]">Your preview is ready</h2>
                      <p className="text-[16px] leading-[135%] text-[#6E6C7A]">
                        Demo complete for <span className="break-all font-medium text-[#2B2841]">{sentEmail}</span>. No email was sent. Open the faangin preview using the link below.
                      </p>
                    </div>
                    <div className="w-full rounded-xl bg-white/80 p-3 shadow-sm ring-1 ring-black/10">
                      <input ref={linkInput} aria-label="faangin preview URL" readOnly value={routes.demo} onFocus={(event) => event.target.select()} className="w-full rounded-md border border-black/10 p-2 text-xs text-[#2B2841]" />
                      <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                        <button type="button" onClick={copyLink} className="font-medium text-blue-600 hover:underline">Copy link</button>
                        <a href={routes.demo} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">Open preview</a>
                      </div>
                      <p role="status" className="mt-1 min-h-4 text-xs text-[#6E6C7A]">{copyStatus}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenChange(false)}
                      className={cn(
                        "text-[13px] font-medium text-[#6E6C7A]/70 underline-offset-4 transition-colors duration-200 hover:text-[#2B2841] hover:underline",
                      )}
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
