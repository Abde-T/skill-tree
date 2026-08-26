'use client';

import React from 'react';
import type { Branch, Skill } from '@/types';
import SkillNode from './SkillNode';
import XPBar from '@/app/components/ui/XPBar';

interface BranchGroupProps {
  branch: Branch;
  skills: Skill[];
  onSkillClick: (skillId: string) => void;
  branchIndex: number;
}

export default function BranchGroup({ branch, skills, onSkillClick, branchIndex }: BranchGroupProps) {
  // Calculate branch-level aggregate
  const totalXP = skills.reduce((sum, s) => sum + s.xp, 0);
  const avgLevel = skills.length > 0
    ? Math.floor(skills.reduce((sum, s) => sum + s.level, 0) / skills.length)
    : 1;
  const totalMaxXP = skills.length * 100; // per-level max for display

  return (
    <div
      className="flex flex-col items-center gap-6 animate-fade-in"
      style={{ animationDelay: `${branchIndex * 0.15}s`, opacity: 0 }}
    >
      {/* Branch header */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{
            background: `color-mix(in srgb, ${branch.color} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${branch.color} 20%, transparent)`,
            boxShadow: `0 0 20px color-mix(in srgb, ${branch.color} 10%, transparent)`,
          }}
        >
          {branch.icon}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="text-xs font-bold tracking-[0.15em] uppercase"
            style={{ color: branch.color }}
          >
            {branch.name}
          </span>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            LVL {avgLevel} · {skills.length} skills
          </span>
        </div>
        {/* Mini branch XP bar */}
        <div className="w-24">
          <XPBar
            current={totalXP % 100}
            max={100}
            color={branch.color}
            colorEnd={branch.glowColor}
            size="sm"
            showLabel={false}
          />
        </div>
      </div>

      {/* Skill nodes */}
      <div className="flex flex-wrap justify-center gap-6">
        {skills.map((skill, i) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            branch={branch}
            onClick={onSkillClick}
          />
        ))}
      </div>
    </div>
  );
}
