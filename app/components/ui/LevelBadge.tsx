'use client';

import React from 'react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LevelBadge({ level, size = 'md', color }: LevelBadgeProps) {
  const sizes: Record<string, { wrapper: string; text: string }> = {
    sm: { wrapper: 'w-6 h-6', text: 'text-[10px]' },
    md: { wrapper: 'w-8 h-8', text: 'text-xs' },
    lg: { wrapper: 'w-10 h-10', text: 'text-sm' },
  };

  const s = sizes[size];

  return (
    <div
      className={`${s.wrapper} rounded-lg flex items-center justify-center font-bold ${s.text} font-mono`}
      style={{
        background: color
          ? `color-mix(in srgb, ${color} 15%, transparent)`
          : 'rgba(99, 102, 241, 0.15)',
        color: color || '#8b5cf6',
        border: `1px solid ${color ? `color-mix(in srgb, ${color} 25%, transparent)` : 'rgba(99, 102, 241, 0.25)'}`,
      }}
    >
      {level}
    </div>
  );
}
