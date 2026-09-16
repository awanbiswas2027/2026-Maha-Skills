import { checkCanRender3D } from './checkCanRender3D';
import { describe, it, expect, vi } from 'vitest';

describe('checkCanRender3D', () => {
  const createMockCanvas = (hasWebGL: boolean, isContextLost = false) => {
    return () => {
      const canvas = {
        getContext: vi.fn((contextId) => {
          if (hasWebGL && (contextId === 'webgl2' || contextId === 'webgl')) {
            return {
              isContextLost: () => isContextLost,
              getExtension: (name: string) => {
                if (name === 'WEBGL_lose_context') {
                  return { loseContext: vi.fn() };
                }
                return null;
              }
            };
          }
          return null;
        })
      };
      return canvas as any;
    };
  };

  const getMocks = (matchesMotion = false) => ({
    window: {
      innerWidth: 1024,
      matchMedia: vi.fn().mockImplementation(() => ({ matches: matchesMotion }))
    },
    navigator: { connection: { saveData: false }, deviceMemory: 8 }
  });

  it('returns true when WebGL is available and constraints are met', () => {
    const { window, navigator } = getMocks();
    const factory = createMockCanvas(true, false);
    expect(checkCanRender3D(window, navigator, factory)).toBe(true);
  });

  it('returns false when WebGL context is lost', () => {
    const { window, navigator } = getMocks();
    const factory = createMockCanvas(true, true);
    expect(checkCanRender3D(window, navigator, factory)).toBe(false);
  });

  it('returns false when WebGL is unavailable', () => {
    const { window, navigator } = getMocks();
    const factory = createMockCanvas(false, false);
    expect(checkCanRender3D(window, navigator, factory)).toBe(false);
  });

  it('returns false when reduced motion is preferred', () => {
    const { window, navigator } = getMocks(true);
    const factory = createMockCanvas(true, false);
    expect(checkCanRender3D(window, navigator, factory)).toBe(false);
  });
});
