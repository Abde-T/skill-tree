'use client';

import React from 'react';

interface CharacterNodeProps {
  totalLevel: number;
  totalSkills: number;
}

export default function CharacterNode({ totalLevel, totalSkills }: CharacterNodeProps) {
  return (
    <div className="character-node animate-float" style={{ animationDelay: '0s' }}>
      {/* Outer pulse rings */}
      <div className="character-node-ring">
        <div className="pulse-ring" />
        <div className="pulse-ring" style={{ animationDelay: '1.5s', inset: '-12px' }} />

        {/* Inner content */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-2xl">⚡</span>
          <span className="text-[10px] font-bold font-mono tracking-widest text-[var(--text-secondary)] uppercase">
            LVL
          </span>
          <span className="text-xl font-black font-mono text-[var(--text-primary)]">
            {totalLevel}
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-bold tracking-[0.15em] uppercase text-[var(--text-primary)]">
          Character
        </span>
        <span className="text-[11px] font-mono text-[var(--text-muted)]">
          {totalSkills} skills
        </span>
      </div>
    </div>
  );
}
