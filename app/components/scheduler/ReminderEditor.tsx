'use client';

import React, { useState } from 'react';
import type { Skill, Branch } from '@/types';

interface ReminderEditorProps {
  skill: Skill;
  branch: Branch;
  onClose: () => void;
}

export default function ReminderEditor({ skill, branch, onClose }: ReminderEditorProps) {
  const [frequency, setFrequency] = useState(skill.frequency || 'daily');
  const [preferredTime, setPreferredTime] = useState(
    skill.reminder?.preferredTime || '18:00'
  );
  const [enabled, setEnabled] = useState(skill.reminder?.enabled ?? true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    setStatus('saving');
    setErrorMsg('');

    try {
      if (enabled) {
        const res = await fetch('/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skillId: skill.id,
            skillName: skill.name,
            frequency,
            preferredTime,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to save reminder');
        }
      } else {
        const res = await fetch(`/api/reminders?skillId=${skill.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to remove reminder');
        }
      }

      setStatus('saved');
      setTimeout(() => onClose(), 1000);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const frequencyOptions: Array<{ value: typeof frequency; label: string }> = [
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
              Set Reminder
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              <span style={{ color: branch.color }}>{branch.icon}</span>{' '}
              {skill.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Enable toggle */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Reminder enabled
          </span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
              enabled ? 'bg-indigo-500' : 'bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <>
            {/* Frequency */}
            <div className="mt-4">
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
            <div className="mt-4">
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
        {status === 'error' && (
          <div className="mt-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="w-full mt-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50"
          style={{
            background: status === 'saved'
              ? '#10b981'
              : `linear-gradient(135deg, ${branch.color}, ${branch.glowColor})`,
          }}
        >
          {status === 'saving' ? 'Saving...' :
           status === 'saved' ? '✓ Saved!' :
           enabled ? 'Save Reminder' : 'Disable Reminder'}
        </button>
      </div>
    </div>
  );
}
