'use client';

import React from 'react';

interface XPBarProps {
  current: number;
  max: number;
  color?: string;
  colorEnd?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export default function XPBar({
  current,
  max,
  color,
  colorEnd,
  size = 'md',
  showLabel = true,
  animated = true,
}: XPBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  const heights: Record<string, string> = {
    sm: '4px',
    md: '8px',
    lg: '12px',
  };

  return (
    <div className="w-full">
      <div
        className="xp-bar relative rounded-full overflow-hidden"
        style={{ height: heights[size] }}
      >
        {/* Glow behind */}
        <div
          className="xp-bar-glow"
          style={{
            width: `${percentage}%`,
            ...(color && { '--fill-start': color, '--fill-end': colorEnd || color } as React.CSSProperties),
          }}
        />
        {/* Fill */}
        <div
          className="xp-bar-fill"
          style={{
            width: `${percentage}%`,
            transition: animated ? 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            ...(color && { '--fill-start': color, '--fill-end': colorEnd || color } as React.CSSProperties),
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1.5">
          <span
            className="text-xs font-mono font-medium"
            style={{ color: color || 'var(--text-secondary)' }}
          >
            {current} / {max} XP
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
