export function checkCanRender3D(
  windowObj: any,
  navigatorObj: any,
  canvasFactory: () => HTMLCanvasElement = () => document.createElement('canvas')
): boolean {
  // 1. Reduced motion
  const prefersReducedMotion = windowObj.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return false;

  // 2. Viewport < 768px
  if (windowObj.innerWidth < 768) return false;

  // 3. WebGL available
  let hasWebGL = false;
  try {
    const canvas = canvasFactory();
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | WebGL2RenderingContext | null;
    if (gl && typeof gl.isContextLost === 'function' && !gl.isContextLost()) {
      hasWebGL = true;
      const loseCtx = gl.getExtension('WEBGL_lose_context');
      if (loseCtx) {
        loseCtx.loseContext();
      }
    }
  } catch {
    hasWebGL = false;
  }
  if (!hasWebGL) return false;

  // 4. Save data
  if (navigatorObj.connection && navigatorObj.connection.saveData === true) return false;

  // 5. Device memory
  if (navigatorObj.deviceMemory !== undefined && navigatorObj.deviceMemory < 4) return false;

  return true;
}
