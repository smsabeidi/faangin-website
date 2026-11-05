"use client";

import Image from "next/image";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { CircleCheck, X } from "lucide-react";
import { images } from "./assets";
import { routes } from "./routes";

const STEPS = [
  { img: images.step1, alt: "Download DMG", cls: "rounded-md object-cover shadow-xs ring-1 ring-black/10", pCls: "mx-3 mx-auto mt-4 w-60 text-center font-medium" },
  { img: images.step2, alt: "Drag .app from DMG", cls: "rounded-md bg-[#E5E5E5] object-cover shadow-xs ring-1 ring-black/10", pCls: "mx-3 mt-4 text-center font-medium" },
  { img: images.step3, alt: "Open the .app", cls: "rounded-md object-cover shadow-xs ring-1 ring-black/10", pCls: "mx-3 mt-4 text-center font-medium" },
];

/** "Install the Cluely reference app" modal shown after clicking the Mac download link. */
export function InstallDialog({ open, onClose }: { open: boolean; onClose: (open: boolean) => void }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-white/16 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl ring-1 ring-black/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-6xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="text-center select-none">
              <p className="mt-4 text-lg font-semibold text-emerald-400">
                <CircleCheck className="-mt-1 inline" size={20} /> Reference app instructions
              </p>
              <DialogTitle as="h2" className="mt-1 text-3xl font-bold text-zinc-800">
                Install the Cluely reference app
              </DialogTitle>
              <button
                type="button"
                aria-label="Close installation instructions"
                onClick={() => onClose(false)}
                className="absolute top-6 right-7 rounded-lg p-2 text-zinc-400 transition hover:bg-black/5 hover:text-black"
              >
                <X size={20} />
              </button>
              <div className="mx-auto my-20 px-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {STEPS.map((step, i) => (
                    <div key={step.alt} className="relative">
                      <span className="absolute -top-5 left-4 flex size-9 items-center justify-center rounded-full bg-blue-300 text-lg font-bold text-blue-900">
                        {i + 1}
                      </span>
                      <Image src={step.img} alt={step.alt} className={step.cls} />
                      <p className={step.pCls}>
                        {i === 0 && (
                          <>
                            Open <span className="font-semibold text-sky-600">Cluely.dmg</span> from your{" "}
                            <span className="font-semibold text-sky-500">Downloads</span> folder
                          </>
                        )}
                        {i === 1 && (
                          <>
                            Drag the <span className="font-semibold text-sky-600">Cluely icon</span> into your{" "}
                            <span className="font-semibold text-sky-500">Applications</span> folder
                          </>
                        )}
                        {i === 2 && (
                          <>
                            Open the <span className="font-semibold text-sky-600">Cluely</span> app from your{" "}
                            <span className="font-semibold text-sky-500">Applications</span> folder
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 mb-4 text-center font-[550] text-zinc-700">
                Problem?{" "}
                <a href={routes.downloadMac} className="text-blue-500 underline decoration-blue-300">
                  Download Cluely reference app
                </a>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
