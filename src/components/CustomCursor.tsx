import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PerfumeBottle from '../Assets/Perfume.png';
import SprayBottle from '../Assets/Spray.png';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
}

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const scrollTimeout = React.useRef<number>();
  const animationFrame = React.useRef<number>();
  const lastTime = React.useRef<number>(0);

  const createSprayParticles = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    const sprayOriginX = x - 20;
    const sprayOriginY = y - 8;
    
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI / 3) + (Math.random() * Math.PI / 4);
      const speed = 3 + Math.random() * 4;
      const size = 2 + Math.random() * 3;
      
      newParticles.push({
        id: Date.now() + i,
        x: sprayOriginX,
        y: sprayOriginY,
        size,
        opacity: 0.7 + Math.random() * 0.2,
        velocityX: Math.cos(angle) * speed,
        velocityY: -Math.sin(angle) * speed
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const updateParticles = useCallback(() => {
    const now = performance.now();
    const deltaTime = (now - lastTime.current) / 16; // Normalize to 60fps
    lastTime.current = now;

    setParticles(prevParticles =>
      prevParticles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.velocityX * deltaTime,
          y: particle.y + particle.velocityY * deltaTime,
          opacity: particle.opacity * 0.97,
          velocityX: particle.velocityX * 0.96,
          velocityY: particle.velocityY * 0.96 + 0.04 * deltaTime
        }))
        .filter(particle => particle.opacity > 0.1)
    );
  }, []);

  const updateCursorPosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const updateHoverState = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    setIsHovering(
      target.tagName.toLowerCase() === 'a' ||
      target.tagName.toLowerCase() === 'button' ||
      target.closest('a') !== null ||
      target.closest('button') !== null ||
      target.hasAttribute('role') ||
      target.tagName.toLowerCase() === 'input' ||
      target.tagName.toLowerCase() === 'select' ||
      target.tagName.toLowerCase() === 'textarea'
    );
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsClicking(true);
    if (isHovering) {
      createSprayParticles(e.clientX, e.clientY);
    }
  }, [isHovering, createSprayParticles]);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', updateCursorPosition, { passive: true });
    document.addEventListener('mousemove', updateHoverState, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousemove', updateHoverState);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout.current);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [updateCursorPosition, updateHoverState, handleMouseDown, handleMouseUp, handleScroll]);

  useEffect(() => {
    if (particles.length > 0) {
      lastTime.current = performance.now();
      const animate = () => {
        updateParticles();
        animationFrame.current = requestAnimationFrame(animate);
      };
      animationFrame.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
      };
    }
  }, [particles.length, updateParticles]);

  const cursorStyle = useMemo(() => ({
    position: 'fixed' as const,
    left: position.x,
    top: position.y,
    width: isHovering ? '50px' : '40px',
    height: isHovering ? '50px' : '40px',
    pointerEvents: 'none' as const,
    transform: `translate(-50%, -50%)`,
    transition: 'width 0.2s, height 0.2s, transform 0.1s',
    zIndex: 9999,
  }), [position.x, position.y, isHovering]);

  return (
    <>
      <img
        src={isHovering ? SprayBottle : PerfumeBottle}
        alt="Custom Cursor"
        className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''} ${isScrolling ? 'scrolling' : ''}`}
        style={cursorStyle}
      />
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, 
              rgba(255,255,255,${particle.opacity}), 
              rgba(200,200,200,${particle.opacity * 0.7}))`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255,255,255,${particle.opacity * 0.5})`,
            pointerEvents: 'none',
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            zIndex: 9998,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;