import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { createLogoMarkModel } from './createLogoMarkModel';

export default function HeroScene({ onLoaded }: { onLoaded?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation('hero3d');
  
  const [showReset, setShowReset] = useState(false);
  const isDragging = useRef(false);
  const pointerPos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const renderRequested = useRef(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const getColors = () => {
    const style = getComputedStyle(document.documentElement);
    const primStr = style.getPropertyValue('--primary').trim();
    
    const toHex = (hslStr: string, fallback: string) => {
      const parts = hslStr.split(' ');
      if (parts.length >= 3) {
        const h = parseFloat(parts[0]);
        const s = parseFloat(parts[1]);
        const l = parseFloat(parts[2]);
        const color = new THREE.Color();
        color.setHSL(h / 360, s / 100, l / 100);
        return color;
      }
      return new THREE.Color(fallback);
    };

    const primaryColor = primStr ? toHex(primStr, '#0E3998') : new THREE.Color('#0E3998');
    const accentStr = style.getPropertyValue('--accent').trim();
    const accentColor = accentStr ? toHex(accentStr, '#D88B09') : new THREE.Color('#D88B09');
    
    return { primary: primaryColor, accent: accentColor };
  };

  const requestRender = () => {
    if (!renderRequested.current) {
      renderRequested.current = true;
      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(renderLoop);
      }
    }
  };

  const renderLoop = () => {
    renderRequested.current = false;
    animationFrameId.current = null;

    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !groupRef.current) return;

    let needsAnotherFrame = false;
    
    const dx = targetRotation.current.x - currentRotation.current.x;
    const dy = targetRotation.current.y - currentRotation.current.y;
    
    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      currentRotation.current.x += dx * 0.1;
      currentRotation.current.y += dy * 0.1;
      needsAnotherFrame = true;
    } else {
      currentRotation.current.x = targetRotation.current.x;
      currentRotation.current.y = targetRotation.current.y;
    }

    groupRef.current.rotation.y = currentRotation.current.x;
    groupRef.current.rotation.x = currentRotation.current.y;

    rendererRef.current.render(sceneRef.current, cameraRef.current);

    if (needsAnotherFrame) {
      requestRender();
    }
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(35, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 60;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 30);
    scene.add(dirLight);

    const { primary, accent } = getColors();
    const group = createLogoMarkModel({ primary, accent, depth: 3 });
    scene.add(group);
    groupRef.current = group;

    requestRender();
    
    const timer = setTimeout(() => {
      if (onLoaded) onLoaded();
    }, 100);

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      requestRender();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class' && m.target === document.documentElement) {
          const newColors = getColors();
          groupRef.current?.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if ((child.geometry as THREE.BufferGeometry) === (group.children[3] as THREE.Mesh).geometry) {
                (child.material as THREE.MeshStandardMaterial).color.copy(newColors.accent);
              } else {
                (child.material as THREE.MeshStandardMaterial).color.copy(newColors.primary);
              }
            }
          });
          requestRender();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      observer.disconnect();
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    pointerPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    
    if (isDragging.current) {
      const deltaX = e.clientX - pointerPos.current.x;
      const deltaY = e.clientY - pointerPos.current.y;
      
      const rotationSpeed = 0.01;
      let newTargetX = targetRotation.current.x + deltaX * rotationSpeed;
      let newTargetY = targetRotation.current.y + deltaY * rotationSpeed;
      
      const maxRad = 25 * (Math.PI / 180);
      newTargetX = Math.max(-maxRad, Math.min(maxRad, newTargetX));
      newTargetY = Math.max(-maxRad, Math.min(maxRad, newTargetY));
      
      targetRotation.current = { x: newTargetX, y: newTargetY };
      pointerPos.current = { x: e.clientX, y: e.clientY };
      setShowReset(true);
      requestRender();
    } else {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      const maxTilt = 8 * (Math.PI / 180);
      targetRotation.current = { x: x * maxTilt, y: -y * maxTilt };
      requestRender();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    if (!showReset) {
      targetRotation.current = { x: 0, y: 0 };
      requestRender();
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging.current && !showReset) {
      targetRotation.current = { x: 0, y: 0 };
      requestRender();
    }
  };

  const resetView = () => {
    targetRotation.current = { x: 0, y: 0 };
    setShowReset(false);
    requestRender();
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[300px] flex items-center justify-center touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <span className="sr-only">{t('description')}</span>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none" 
        role="img" 
        aria-label={t('label')} 
      />
      
      {showReset && (
        <div className="absolute bottom-4 right-4">
          <Button size="sm" variant="ghost" onClick={resetView}>
            Reset view
          </Button>
        </div>
      )}
    </div>
  );
}
