"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Client-only, lazy-loaded canvas. Until it loads (or if WebGL is
// unavailable) we show a lightweight CSS-gradient fallback so mobile /
// low-power devices stay fast and Lighthouse stays healthy.
const NetworkCanvas = dynamic(() => import("./NetworkCanvas"), {
  ssr: false,
  loading: () => <div className="bg3d bg3d-fallback" aria-hidden="true" />,
});

function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return (
      !!window.WebGLRenderingContext &&
      !!(
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
      )
    );
  } catch {
    return false;
  }
}

export default function HeroBackground() {
  // null = undetermined (SSR / first paint): render the fallback meanwhile.
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(webglSupported());
  }, []);

  if (supported !== true) {
    return <div className="bg3d bg3d-fallback" aria-hidden="true" />;
  }
  return <NetworkCanvas />;
}
