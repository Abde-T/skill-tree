'use client';

import React from 'react';
import type { Skill, Branch } from '@/types';

interface SkillNodeProps {
  skill: Skill;
  branch: Branch | undefined;
  onClick: (skillId: string) => void;
}

export default function SkillNode({ skill, branch, onClick }: SkillNodeProps) {
  const color = branch ? branch.color : '#444';
  const glowColor = branch ? branch.glowColor : '#888';
  
  const xpInLevel = skill.xp % 100;
  const isPracticedToday = skill.lastPracticedDate === new Date().toISOString().split('T')[0];
  
  // Icon placeholder based on skill name for now
  const getIcon = (name: string) => {
    if (name.includes('Eng')) return '⚙️';
    if (name.includes('Type') || name.includes('React')) return '💻';
    if (name.includes('Science')) return '🧬';
    if (name.includes('Decision')) return '⚖️';
    if (name.includes('Deep')) return '🧘';
    if (name.includes('Writing')) return '✍️';
    if (name.includes('Verbal')) return '🗣️';
    if (name.includes('Discipline')) return '🛡️';
    if (name.includes('Consistency')) return '♾️';
    return '📌';
  };

  return (
    <div
      className="organic-skill-node group"
      onClick={() => onClick(skill.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(skill.id); }}
      aria-label={`${skill.name} — Level ${skill.level}, ${xpInLevel}/100 XP`}
    >
      {/* The main solid color node circle */}
      <div 
        className="node-circle relative w-14 h-14 rounded-full flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 z-10"
        style={{ 
          backgroundColor: isPracticedToday ? glowColor : 'transparent',
          border: `2px solid ${color}`,
          boxShadow: isPracticedToday ? `0 0 15px ${glowColor}80` : `0 0 10px ${color}40 inset`,
        }}
      >
        {getIcon(skill.name)}
        
        {/* Lock icon if level is 0 (optional feature later, for now just show if it's unlocked) */}
        {skill.level === 0 && (
          <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-[var(--bg-elevated)] rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[10px]">
            🔒
          </div>
        )}
      </div>

      {/* Progress / Level Badge attached below */}
      <div 
        className="node-badge absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border bg-[var(--bg-elevated)] text-[10px] font-bold font-mono z-20 whitespace-nowrap transition-transform duration-300 group-hover:scale-110"
        style={{
          borderColor: color,
          color: color,
          boxShadow: `0 2px 4px rgba(0,0,0,0.5)`,
        }}
      >
        {skill.level} <span className="opacity-50">Lvl</span>
      </div>

      {/* Permanent label for name */}
      <div className="absolute top-full mt-5 left-1/2 -translate-x-1/2 text-center pointer-events-none z-30 w-max max-w-[120px]">
        <span className="text-[11px] font-semibold tracking-wide text-[var(--text-primary)] drop-shadow-md bg-[var(--bg-base)]/60 px-1.5 py-0.5 rounded leading-tight inline-block">
          {skill.name}
        </span>
      </div>
    </div>
  );
}
