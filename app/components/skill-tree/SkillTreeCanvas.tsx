'use client';

import React, { useState, useCallback, useRef } from 'react';
import type { SkillTreeState } from '@/types';
import CharacterNode from './CharacterNode';
import SkillNode from './SkillNode';
import ConnectionLines from './ConnectionLines';
import SkillDetailPanel from '@/app/components/skill/SkillDetailPanel';
import TodoNode from '@/app/components/todo/TodoNode';
import TodoEditor from '@/app/components/todo/TodoEditor';
import { TREE_LAYOUT } from '@/lib/layout/tree-layout';

interface SkillTreeCanvasProps {
  state: SkillTreeState;
  onPractice: (skillId: string) => void;
  onAddTodo?: (title: string, description: string) => void;
  onDeleteTodo?: (todoId: string) => void;
  onToggleTodo?: (todoId: string) => void;
}

export default function SkillTreeCanvas({ state, onPractice, onAddTodo, onDeleteTodo, onToggleTodo }: SkillTreeCanvasProps) {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [showTodoEditor, setShowTodoEditor] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: -200 }); // Start scrolled down a bit for mobile first
  const [isDragging, setIsDragging] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const { branches, skills, todos } = state;

  // Aggregate character level
  const allSkills = Object.values(skills);
  const totalLevel = allSkills.reduce((sum, s) => sum + s.level, 0);

  // Handlers
  const handleSkillClick = useCallback((skillId: string) => {
    setSelectedSkillId(skillId);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedSkillId(null);
  }, []);

  const handleAddTodo = useCallback((title: string, description: string) => {
    onAddTodo?.(title, description);
  }, [onAddTodo]);

  const handleDeleteTodo = useCallback((todoId: string) => {
    onDeleteTodo?.(todoId);
  }, [onDeleteTodo]);

  const handleToggleTodo = useCallback((todoId: string) => {
    onToggleTodo?.(todoId);
  }, [onToggleTodo]);

  // Get Rogue branch
  const rogueBranch = branches.find((b) => b.id === 'rogue');

  // Pan handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.organic-skill-node, .character-node, button, .detail-panel, .backdrop-overlay')) return;
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => Math.min(2, Math.max(0.4, prev - e.deltaY * 0.001)));
  }, []);

  // Selected skill & branch
  const selectedSkill = selectedSkillId ? skills[selectedSkillId] : null;
  const selectedBranch = selectedSkill
    ? branches.find((b) => b.id === selectedSkill.branchId) || null
    : null;

  return (
    <div
      className="tree-canvas bg-grid"
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Radial vignette overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-[1]" />

      {/* Tree content - the actual coordinate space */}
      <div
        className="tree-inner absolute z-[2]"
        style={{
          width: '1000px', // Fixed coordinate space size, scaled by transform
          height: '1000px',
          left: '50%',
          top: '50%',
          marginLeft: '-500px', // Center the space
          marginTop: '-500px',
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Connection lines (SVG layer) */}
        <div className="absolute inset-0 pointer-events-none">
          <ConnectionLines skills={skills} branches={branches} />
        </div>

        {/* Root Node (Character) */}
        <div 
          className="absolute z-10"
          style={{
            left: '50%',
            bottom: '5%',
            transform: 'translate(-50%, 50%)',
          }}
        >
          <CharacterNode 
            totalLevel={totalLevel}
            totalSkills={allSkills.length}
          />
        </div>

        {/* Nodes layer */}
        {Object.entries(TREE_LAYOUT).map(([skillId, layoutData]) => {
          const skill = skills[skillId];
          if (!skill) return null;
          
          const branch = branches.find(b => b.id === skill.branchId);
          
          return (
            <div 
              key={skillId}
              className="absolute"
              style={{
                left: `${layoutData.pos.x}%`,
                bottom: `${layoutData.pos.y}%`,
                transform: 'translate(-50%, 50%)', // Center the node exactly on the coordinate
              }}
            >
              <SkillNode 
                skill={skill} 
                branch={branch} 
                onClick={handleSkillClick} 
              />
            </div>
          );
        })}

        {/* Todo nodes for Rogue branch */}
        {rogueBranch && rogueBranch.skillIds.map((todoId, index) => {
          const todo = todos[todoId];
          if (!todo) return null;

          // Position todos in a vertical line on the far right to avoid overlap
          // Communication branch is at x: 85-90, so we position Rogue at x: 95
          const xPos = 95;
          const yPos = 20 + (index * 12);

          return (
            <div
              key={todoId}
              className="absolute"
              style={{
                left: `${xPos}%`,
                bottom: `${yPos}%`,
                transform: 'translate(-50%, 50%)',
              }}
            >
              <TodoNode
                todo={todo}
                branch={rogueBranch}
                onClick={() => {}}
                onToggle={() => handleToggleTodo(todoId)}
                onDelete={() => handleDeleteTodo(todoId)}
              />
            </div>
          );
        })}

        {/* Add Todo button for Rogue branch */}
        {rogueBranch && (
          <div
            className="absolute cursor-pointer"
            style={{
              left: '95%',
              bottom: '8%',
              transform: 'translate(-50%, 50%)',
            }}
            onClick={() => setShowTodoEditor(true)}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-200 hover:border-solid"
              style={{
                borderColor: rogueBranch.color,
                color: rogueBranch.color,
              }}
            >
              <span className="text-xl">+</span>
            </div>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[30]">
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.15))}
          className="w-9 h-9 rounded-lg surface-glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 text-lg"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.4, s - 0.15))}
          className="w-9 h-9 rounded-lg surface-glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 text-lg"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => { setScale(1); setTranslate({ x: 0, y: 0 }); }}
          className="w-9 h-9 rounded-lg surface-glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 text-xs font-mono"
          aria-label="Reset view"
        >
          1:1
        </button>
      </div>

      {/* Title watermark */}
      <div className="absolute top-6 left-6 z-[30]">
        <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">
          Skill Tree
        </h1>
        <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5 opacity-50">
          v0.1
        </p>
      </div>

      {/* Skill detail panel */}
      {selectedSkill && selectedBranch && (
        <SkillDetailPanel
          skill={selectedSkill}
          branch={selectedBranch}
          onClose={handleCloseDetail}
          onPractice={onPractice}
        />
      )}

      {/* Todo Editor modal */}
      {showTodoEditor && rogueBranch && (
        <TodoEditor
          branch={rogueBranch}
          onClose={() => setShowTodoEditor(false)}
          onAddTodo={handleAddTodo}
        />
      )}
    </div>
  );
}
