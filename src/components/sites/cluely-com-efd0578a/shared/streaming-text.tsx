"use client";

import { Fragment, type HTMLAttributes } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = Omit<HTMLAttributes<HTMLParagraphElement>, "children"> & {
  /** seconds before the first word appears */
  delay?: number;
  children: string;
};

/** Word-by-word reveal: each word fades to opacity 1 over 1s, next word scheduled 10ms later. */
export function StreamingText({ delay = 0, children, ...rest }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <p {...rest}>
      {children.split(" ").map((word, i) => (
        <Fragment key={`${children}-${i}`}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : delay + i * 0.01 }}
          >
            {word}
          </motion.span>{" "}
        </Fragment>
      ))}
    </p>
  );
}
