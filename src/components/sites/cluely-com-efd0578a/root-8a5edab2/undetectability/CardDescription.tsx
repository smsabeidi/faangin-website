/** Caption under each "Stay focused. Stay in control." card (bold lead-in + description). */
export function CardDescription({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto mt-[19px] max-w-[600px] text-base leading-snug tracking-tight text-gray-40 sm:text-18 md:mt-5 xl:mt-[18px] xl:text-20 2xl:mt-[26px]">
      <p>
        <strong className="mr-1 font-medium text-gray-20">{title}</strong>
        {description}
      </p>
    </div>
  );
}
