import React, { Suspense, useState, useEffect } from 'react';
import { useCanRender3D } from './useCanRender3D';

const HeroScene = React.lazy(() => import('./HeroScene'));

export function HeroVisual() {
  const canRender3D = useCanRender3D();
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      setTheme(dark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const fallbackSrc = theme === 'dark' ? '/brand/hero-fallback-dark.png' : '/brand/hero-fallback.png';

  // Cross-fade opacity
  const fallbackOpacity = canRender3D && sceneLoaded ? 0 : 1;
  const canvasOpacity = canRender3D && sceneLoaded ? 1 : 0;

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
      {/* Fallback image */}
      <img 
        src={fallbackSrc} 
        alt="" 
        width={1040} 
        height={800} 
        // @ts-expect-error fetchpriority is a valid HTML attribute but may not be in React types yet
        fetchpriority="high"
        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 motion-reduce:transition-none"
        style={{ opacity: fallbackOpacity, zIndex: 10, pointerEvents: (canRender3D && sceneLoaded) ? 'none' : 'auto' }}
      />
      
      {/* 3D Canvas */}
      {canRender3D && (
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-200 motion-reduce:transition-none"
          style={{ opacity: canvasOpacity, zIndex: 20 }}
        >
          <Suspense fallback={null}>
            <HeroScene onLoaded={() => setSceneLoaded(true)} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
