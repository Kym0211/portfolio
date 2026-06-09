"use client";

import {
  createElement,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

/**
 * Wraps content in a scroll-reveal container. Adds the `in` class once the
 * element scrolls into view (matching the prototype's IntersectionObserver),
 * then stops observing. Respects prefers-reduced-motion via CSS.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    Tag,
    { ref, className: `reveal ${className}`.trim() },
    children,
  );
}
