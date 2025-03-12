import React, { useEffect, useState, useCallback, useRef } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor = () => {
  const cursorRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<number>();
  const animationFrame = useRef<number>();
  const targetPosition = useRef<CursorPosition>({ x: 0, y: 0 });

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updateCursorPosition = useCallback(() => {
    if (!cursorRef.current) return;

    setPosition(prev => ({
      x: lerp(prev.x, targetPosition.current.x, 0.2),
      y: lerp(prev.y, targetPosition.current.y, 0.2)
    }));

    animationFrame.current = requestAnimationFrame(updateCursorPosition);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetPosition.current = { x: e.clientX, y: e.clientY };
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

  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

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
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousemove', updateHoverState, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('scroll', handleScroll, { passive: true });

    animationFrame.current = requestAnimationFrame(updateCursorPosition);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', updateHoverState);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout.current);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [handleMouseMove, updateHoverState, handleMouseDown, handleMouseUp, handleScroll, updateCursorPosition]);

  return (
    <img
      ref={cursorRef}
      src={isHovering ? '/src/Assets/Spray.png' : '/src/Assets/Perfume.png'}
      alt="Custom Cursor"
      className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''} ${isScrolling ? 'scrolling' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isHovering ? '50px' : '40px',
        height: isHovering ? '50px' : '40px',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
      }}
    />
  );
};

export default CustomCursor;