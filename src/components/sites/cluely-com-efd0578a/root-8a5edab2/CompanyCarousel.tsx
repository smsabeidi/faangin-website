"use client";

import Image from "next/image";
import { motion } from "motion/react";
import "./CompanyCarousel.css";

type Company = { name: string; logo: string };

type CarouselProps = {
  id?: string;
  title?: string;
  description?: string;
  items?: Company[];
  label?: string;
};

const companies: Company[] = [
  { name: "Google", logo: "google" },
  { name: "SpaceX", logo: "spacex" },
  { name: "Goldman Sachs", logo: "goldman-sachs" },
  { name: "Meta", logo: "meta" },
  { name: "Tesla", logo: "tesla" },
  { name: "Microsoft", logo: "microsoft" },
  { name: "JPMorgan Chase", logo: "jpmorgan-chase" },
  { name: "IBM", logo: "ibm" },
  { name: "Amazon", logo: "amazon" },
  { name: "Capital One", logo: "capital-one" },
  { name: "Visa", logo: "visa" },
  { name: "Apple", logo: "apple" },
  { name: "Uber", logo: "uber" },
  { name: "NVIDIA", logo: "nvidia" },
  { name: "Bank of America", logo: "bank-of-america" },
  { name: "Netflix", logo: "netflix" },
  { name: "American Express", logo: "american-express" },
  { name: "Adobe", logo: "adobe" },
  { name: "Mastercard", logo: "mastercard" },
  { name: "Spotify", logo: "spotify" },
  { name: "PayPal", logo: "paypal" },
  { name: "Salesforce", logo: "salesforce" },
  { name: "Airbnb", logo: "airbnb" },
  { name: "Stripe", logo: "stripe" },
  { name: "Databricks", logo: "databricks" },
];

function CompanyList({ items, label, duplicate = false }: { items: Company[]; label: string; duplicate?: boolean }) {
  return (
    <ul className="company-carousel__group" aria-label={duplicate ? undefined : `${label} logos`} aria-hidden={duplicate || undefined}>
      {items.map(company => (
        <li key={company.logo} className="company-carousel__company">
          <Image src={company.logo.startsWith("/") ? company.logo : `/brand/companies/${company.logo}.svg`} alt="" width={36} height={36} loading="eager" className="company-carousel__logo" />
          <span>{company.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CompanyCarousel({
  id = "company-interview-targets",
  title = "Used by candidates interviewing at",
  description = "Across technology, finance, and beyond.",
  items = companies,
  label = "company",
}: CarouselProps = {}) {
  return (
    <section className="company-carousel mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-5 md:gap-14 md:px-8" aria-labelledby={id}>
      <div className="company-carousel__heading">
        <motion.h2
          id={id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="company-carousel__title inline-block w-fit text-3xl leading-[1.25] font-medium tracking-[-1.28px] lg:text-5xl xl:text-[56px]"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="company-carousel__description max-w-150 text-base leading-relaxed md:text-lg"
        >
          {description}
        </motion.p>
      </div>
      <div className="company-carousel__body">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
          className="company-carousel__window"
          tabIndex={0}
          role="group"
          aria-label={`${label} logos, animation pauses while focused`}
        >
          <div className="company-carousel__track">
            <CompanyList items={items} label={label} />
            <CompanyList items={items} label={label} duplicate />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
