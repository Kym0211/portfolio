"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import type { Project } from "@/data/projects";

/**
 * Project card that tilts in 3D toward the cursor with a cursor-following
 * glow, matching the prototype's `data-tilt` behaviour. Tilt is skipped for
 * touch / coarse pointers so it never interferes with scrolling on mobile.
 */
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // scroll-reveal: add `in` once the card enters the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card || e.pointerType !== "mouse") return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform = `rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 10}deg) translateZ(6px)`;
    card.style.setProperty("--mx", `${px * 100}%`);
    card.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className="card reveal"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className="card-inner">
        <div className="idx">{String(index + 1).padStart(2, "0")}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <a
          className="card-link"
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub &#8594;
        </a>
      </div>
    </div>
  );
}
