"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

interface MagneticCTAProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function MagneticCTA({
  children,
  className = "",
  href,
  onClick,
  ...props
}: MagneticCTAProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      typeof window === "undefined" ||
      window.innerWidth < 768 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const { clientX, clientY } = e;
    const targetEl = linkRef.current || buttonRef.current;
    const rect = targetEl?.getBoundingClientRect();
    if (!rect) return;

    const middleX = clientX - (rect.left + rect.width / 2);
    const middleY = clientY - (rect.top + rect.height / 2);

    // Max 5px displacement for a subtle magnetic feel
    const moveX = Math.max(-5, Math.min(5, middleX * 0.15));
    const moveY = Math.max(-5, Math.min(5, middleY * 0.15));

    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${
      position.x !== 0 || position.y !== 0 ? 1.03 : 1
    })`,
    transition:
      position.x === 0 && position.y === 0
        ? "transform 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease"
        : "transform 100ms ease-out",
  };

  if (href) {
    return (
      <Link
        ref={linkRef}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
