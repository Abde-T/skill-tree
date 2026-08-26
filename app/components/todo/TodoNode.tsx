'use client';

import React from 'react';
import type { Todo, Branch } from '@/types';

interface TodoNodeProps {
  todo: Todo;
  branch: Branch;
  onClick: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoNode({ todo, branch, onClick, onToggle, onDelete }: TodoNodeProps) {
  return (
    <div
      className="organic-skill-node cursor-pointer group"
      onClick={onClick}
    >
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: todo.completed
            ? `color-mix(in srgb, ${branch.color} 20%, transparent)`
            : `linear-gradient(135deg, ${branch.color}, ${branch.glowColor})`,
          border: `2px solid ${todo.completed ? branch.color : 'transparent'}`,
          boxShadow: todo.completed
            ? 'none'
            : `0 0 20px color-mix(in srgb, ${branch.color} 40%, transparent)`,
        }}
      >
        <span className="text-2xl">
          {todo.completed ? '✓' : '📋'}
        </span>
        
        {/* Glow effect for active todos */}
        {!todo.completed && (
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${branch.glowColor} 0%, transparent 70%)`,
              opacity: 0.3,
            }}
          />
        )}
      </div>

      {/* Title */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
        <span
          className="text-xs font-medium transition-all duration-200"
          style={{
            color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: todo.completed ? 'line-through' : 'none',
          }}
        >
          {todo.title}
        </span>
      </div>

      {/* Quick actions on hover */}
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="w-6 h-6 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-xs hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
          title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.completed ? '↩' : '✓'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-6 h-6 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-xs hover:border-red-500/50 hover:text-red-400 transition-all"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
