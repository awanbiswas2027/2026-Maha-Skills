import { useState, useEffect } from 'react';
import { checkCanRender3D } from './checkCanRender3D';

export function useCanRender3D(): boolean {
  const [canRender] = useState(() => checkCanRender3D(window, navigator));

  // Keep it quiet to the hook
  useEffect(() => {
     // Intentionally empty, we just calculated once eagerly.
     // In a real app we might re-eval on resize but prompt doesn't strictly require resizing enabling it.
  }, []);

  return canRender;
}
