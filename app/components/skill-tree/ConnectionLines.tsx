'use client';

import React from 'react';
import { TREE_LAYOUT } from '@/lib/layout/tree-layout';
import type { Skill, Branch } from '@/types';

interface ConnectionLinesProps {
  skills: Record<string, Skill>;
  branches: Branch[];
}

export default function ConnectionLines({ skills, branches }: ConnectionLinesProps) {
  // Helper to get branch color for a skill
  const getSkillColor = (skillId: string) => {
    const skill = skills[skillId];
    if (!skill) return '#444';
    const branch = branches.find((b) => b.id === skill.branchId);
    return branch ? branch.color : '#444';
  };

  const paths: React.ReactNode[] = [];

  Object.entries(TREE_LAYOUT).forEach(([skillId, nodeData]) => {
    const skillColor = getSkillColor(skillId);
    
    nodeData.parents.forEach((parentId) => {
      let parentData = TREE_LAYOUT[parentId];
      let parentColor = getSkillColor(parentId);
      
      // Virtual root node handling
      if (parentId === 'root') {
        parentData = { pos: { x: 50, y: 5 }, parents: [] };
        parentColor = '#6366f1'; // Default root color
      } else if (!parentData) {
        return;
      }

      // We draw from parent to child (bottom to top usually)
      const startX = parentData.pos.x;
      // Convert y from bottom-origin (0-100) to top-origin (100-0) for SVG viewBox
      const startY = 100 - parentData.pos.y;
      
      const endX = nodeData.pos.x;
      const endY = 100 - nodeData.pos.y;

      // Bezier control points for vertical organic flow
      // We push the control points vertically to make lines exit top and enter bottom smoothly
      const controlY1 = startY - Math.abs(endY - startY) * 0.5;
      const controlY2 = endY + Math.abs(endY - startY) * 0.5;

      const gradientId = `grad-${parentId}-${skillId}`;

      paths.push(
        <g key={`${parentId}-${skillId}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={parentColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={skillColor} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={`M ${startX} ${startY} C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${endY}`}
            stroke={`url(#${gradientId})`}
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            className="organic-line-path"
            style={{ filter: `drop-shadow(0 0 4px ${skillColor}40)` }}
          />
        </g>
      );
    });
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 0 }}
    >
      {paths}
    </svg>
  );
}
