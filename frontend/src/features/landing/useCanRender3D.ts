import { useState, useEffect } from 'react';

export function useCanRender3D(): boolean {
  const [canRender] = useState(() => {
    // 1. Reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return false;
    }

    // 2. Viewport < 768px
    if (window.innerWidth < 768) {
      return false;
    }

    // 3. WebGL available
    let hasWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl && gl instanceof WebGLRenderingContext) {
        hasWebGL = true;
      }
    } catch {
      hasWebGL = false;
    }
    if (!hasWebGL) {
      return false;
    }

    // 4. Save data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    if (nav.connection && nav.connection.saveData === true) {
      return false;
    }

    // 5. Device memory
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) {
      return false;
    }

    return true;
  });

  // Keep it quiet to the hook
  useEffect(() => {
     // Intentionally empty, we just calculated once eagerly.
     // In a real app we might re-eval on resize but prompt doesn't strictly require resizing enabling it.
  }, []);

  return canRender;
}
