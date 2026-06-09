"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import NetworkScene from "./NetworkScene";

/**
 * Mounts the R3F canvas as a fixed background. Performance & a11y:
 * - dpr capped at [1, 2]
 * - render loop paused when the tab is hidden or the hero scrolls offscreen
 * - prefers-reduced-motion renders a single static frame instead of animating
 */
export default function NetworkCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // reduced motion → render one frame then stop; otherwise run only when visible
  const frameloop = reduced
    ? "demand"
    : tabVisible && onScreen
      ? "always"
      : "never";

  return (
    <div ref={wrapRef} className="bg3d" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <NetworkScene animate={!reduced} />
      </Canvas>
    </div>
  );
}
