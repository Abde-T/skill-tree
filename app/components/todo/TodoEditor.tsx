'use client';

import React, { useState } from 'react';
import type { Branch } from '@/types';

interface TodoEditorProps {
  branch: Branch;
  onClose: () => void;
  onAddTodo: (title: string, description: string, reminder?: { frequency: string; preferredTime: string }) => void;
}

export default function TodoEditor({ branch, onClose, onAddTodo }: TodoEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [preferredTime, setPreferredTime] = useState('18:00');
  const [enableReminder, setEnableReminder] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      setStatus('error');
      setErrorMsg('Title is required');
      return;
    }

    setStatus('saving');
    setErrorMsg('');
    
    const reminder = enableReminder ? { frequency, preferredTime } : undefined;
    
    try {
      onAddTodo(title.trim(), description.trim(), reminder);
      setStatus('saved');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  const frequencyOptions: Array<{ value: string; label: string }> = [
    { value: 'daily', label: 'Daily' },
    { value: '3x/week', label: '3× per week' },
    { value: '2x/week', label: '2× per week' },
    { value: 'weekly', label: 'Weekly' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Editor modal */}
      <div className="relative z-10 w-full max-w-md surface-glass rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Add Todo
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              <span style={{ color: branch.color }}>{branch.icon}</span>{' '}
              {branch.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Title input */}
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Description input */}
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Reminder toggle */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] mb-4">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Set Reminder
          </span>
          <button
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
              enableReminder ? 'bg-indigo-500' : 'bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                enableReminder ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Reminder options */}
        {enableReminder && (
          <>
            {/* Frequency */}
            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">
                Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                {frequencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFrequency(opt.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      frequency === opt.value
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time picker */}
            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">
                Preferred Time
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono text-lg focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </>
        )}

        {/* Error message */}
        {status === 'error' && errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={status === 'saving' || !title.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50"
          style={{
            background: status === 'saved'
              ? '#10b981'
              : `linear-gradient(135deg, ${branch.color}, ${branch.glowColor})`,
          }}
        >
          {status === 'saving' ? 'Adding...' :
           status === 'saved' ? '✓ Added!' :
           'Add Todo'}
        </button>
      </div>
    </div>
  );
}
