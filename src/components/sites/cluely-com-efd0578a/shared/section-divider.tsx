/** 1px transparent rule inside the standard container; only contributes spacing between sections. */
export function SectionDivider() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
      <hr className="h-px w-full border-none bg-transparent" />
    </div>
  );
}
