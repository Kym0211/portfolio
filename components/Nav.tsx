"use client";

import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [progress, setProgress] = useState(0);

  // scrolled state + scroll progress
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: highlight the section nearest the viewport centre
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // close the mobile menu on Escape, and lock body scroll while it's open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className={scrolled ? "scrolled" : undefined}>
        <div className="nav-inner">
          <a href="#top" className="logo" aria-label={`${site.name} — home`}>
            <span className="logo-badge" aria-hidden="true">
              {site.name.charAt(0)}
            </span>
            {site.name}
          </a>
          <div className="nav-right">
            <div className="nav-links">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={
                    active === link.href.slice(1) ? "active" : undefined
                  }
                  aria-current={
                    active === link.href.slice(1) ? "true" : undefined
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a href="#contact" className="nav-cta">
              Let&apos;s talk &#8594;
            </a>
            <button
              type="button"
              className="nav-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`burger ${open ? "open" : ""}`}>
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
        <div
          className="scroll-progress"
          style={{ transform: `scaleX(${progress})` }}
        />
      </nav>

      <div
        id="mobile-menu"
        className={`mobile-menu ${open ? "open" : ""}`}
        inert={!open}
        aria-hidden={!open}
      >
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
