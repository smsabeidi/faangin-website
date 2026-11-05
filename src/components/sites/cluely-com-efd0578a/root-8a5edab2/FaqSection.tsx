"use client";

import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import { useDesktopCampaign } from "@/components/sites/cluely-com-efd0578a/shared/hooks";
import { cn } from "@/lib/utils";
import { faanginFaqs } from "@/lib/site-content";

/* ---------- shadcn-style accordion wrappers (original module 13496) ---------- */

function Accordion({ ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between rounded py-4 text-left text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      forceMount
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:hidden data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

/* ---------- section (original module 90982) ---------- */

export default function FaqSection({ className }: { className?: string }) {
  const desktopCampaign = useDesktopCampaign();

  return (
    <section id="faq" className={cn("faq relative z-1 w-full py-12 md:py-16 lg:py-24", className)}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-5 px-5 md:px-8">
        {desktopCampaign && (
          <DownloadButton
            className={cn(
              "mx-auto",
              "-mt-4 mb-12 min-h-14 !overflow-hidden !rounded-2xl !px-7 !py-4 !text-lg shadow-2xl shadow-black/25 [&_.blurred-border]:!rounded-2xl [&_svg]:size-6",
            )}
          />
        )}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-28 leading-tight font-medium tracking-4 text-foreground md:text-4xl md:text-32 lg:mb-[16px] lg:text-40 xl:mb-[24px]"
        >
          Frequently asked questions
        </motion.h2>
        <Accordion type="single" collapsible className="text-foreground">
          {faanginFaqs.map((item, index) => (
            <AccordionItem
              key={index}
              className={cn(index === faanginFaqs.length - 1 && "border-b-0")}
              value={`item-${index}`}
            >
              <AccordionTrigger className="gap-x-4 text-left tracking-tight text-foreground hover:text-foreground/80 hover:no-underline sm:py-4 md:py-[19px] lg:py-5 [&_svg]:size-7">
                <span className="text-18 leading-snug font-medium tracking-4 text-pretty md:text-xl md:text-20 md:leading-[1.125] lg:text-24">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="relative z-10 -mt-[4px] flex flex-col gap-y-5 pt-0 pr-8 pb-0 text-base leading-snug tracking-2 text-gray-30 md:-mt-[4px] md:max-w-[616px] md:pt-0 md:pr-0 md:pb-0 md:text-18 lg:mt-0 lg:pb-[2px] lg:text-lg lg:text-20 xl:pb-[4px]">
                  <p>{item.answer}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
