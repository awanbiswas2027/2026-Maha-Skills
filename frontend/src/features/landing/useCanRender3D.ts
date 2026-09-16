import { useState, useEffect } from 'react';
import { checkCanRender3D, type Render3DNavigator } from './checkCanRender3D';

export function useCanRender3D(): boolean {
  const [canRender] = useState(() => checkCanRender3D(window, navigator as Navigator & Render3DNavigator));

  // Keep it quiet to the hook
  useEffect(() => {
     // Intentionally empty, we just calculated once eagerly.
     // In a real app we might re-eval on resize but prompt doesn't strictly require resizing enabling it.
  }, []);

  return canRender;
}
