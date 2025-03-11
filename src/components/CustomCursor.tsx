import React, { useEffect, useState } from 'react';
import PerfumeBottle from '../Assets/Perfume.png';
import SprayBottle from '../Assets/Spray.png';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  let scrollTimeout: number;

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
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
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousemove', updateHoverState);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousemove', updateHoverState);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <img
      src={isHovering ? SprayBottle : PerfumeBottle}
      alt="Custom Cursor"
      className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''} ${isScrolling ? 'scrolling' : ''}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: isHovering ? '50px' : '40px',
        height: isHovering ? '50px' : '40px',
        pointerEvents: 'none',
        transform: `translate(-50%, -50%)`,
        transition: 'width 0.2s, height 0.2s, transform 0.1s',
        zIndex: 9999,
      }}
    />
  );
};

export default CustomCursor;