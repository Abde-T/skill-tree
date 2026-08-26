'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { Skill, Branch } from '@/types';
import XPBar from '@/app/components/ui/XPBar';
import LevelBadge from '@/app/components/ui/LevelBadge';
import ReminderEditor from '@/app/components/scheduler/ReminderEditor';

interface SkillDetailPanelProps {
  skill: Skill;
  branch: Branch;
  onClose: () => void;
  onPractice: (skillId: string) => void;
}

export default function SkillDetailPanel({ skill, branch, onClose, onPractice }: SkillDetailPanelProps) {
  const [isPracticing, setIsPracticing] = useState(false);
  const [showXPBurst, setShowXPBurst] = useState(false);
  const [showReminderEditor, setShowReminderEditor] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [pushSubscribed, setPushSubscribed] = useState(false);

  const xpInLevel = skill.xp % 100;
  const isPracticedToday = skill.lastPracticedDate === new Date().toISOString().split('T')[0];

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handlePractice = useCallback(() => {
    if (isPracticing) return;
    setIsPracticing(true);
    setShowXPBurst(true);
    onPractice(skill.id);

    setTimeout(() => {
      setIsPracticing(false);
    }, 600);
    setTimeout(() => {
      setShowXPBurst(false);
    }, 800);
  }, [isPracticing, onPractice, skill.id]);

  const handleEnableNotifications = async () => {
    try {
      const { subscribeToPush } = await import('@/lib/notifications/push-client');
      const sub = await subscribeToPush();
      if (sub) {
        setPushSubscribed(true);
        setNotifPermission('granted');
      }
    } catch (err) {
      console.error('Failed to subscribe to push:', err);
    }
  };

  const handleTestNotification = async () => {
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Skill Tree Test',
          body: `Test notification for ${skill.name}!`,
          skillId: skill.id,
        }),
      });
    } catch (err) {
      console.error('Failed to send test notification:', err);
    }
  };

  const frequencyLabel: Record<string, string> = {
    'daily': 'Daily',
    '3x/week': '3× per week',
    '2x/week': '2× per week',
    'weekly': 'Weekly',
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Never';
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === yesterday) return 'Yesterday';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="backdrop-overlay animate-fade-in"
        style={{ animationDuration: '0.2s', opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="detail-panel surface-glass animate-slide-in-right">
        <div className="p-6 flex flex-col gap-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                       text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]
                       transition-all duration-200"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Header */}
          <div className="flex flex-col items-center gap-4 pt-4">
            {/* Branch indicator */}
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: branch.color }}
            >
              {branch.icon} {branch.name}
            </span>

            {/* Skill name */}
            <h2 className="text-xl font-bold text-center text-[var(--text-primary)]">
              {skill.name}
            </h2>

            {/* Level */}
            <div className="flex items-center gap-2">
              <LevelBadge level={skill.level} size="lg" color={branch.color} />
              <span className="text-sm font-bold font-mono text-[var(--text-secondary)]">
                LEVEL {skill.level}
              </span>
            </div>

            {/* XP bar */}
            <div className="w-full max-w-[280px]">
              <XPBar
                current={xpInLevel}
                max={100}
                color={branch.color}
                colorEnd={branch.glowColor}
                size="lg"
              />
            </div>
          </div>

          {/* Streak */}
          <div
            className="flex items-center justify-center gap-6 py-4 rounded-xl"
            style={{
              background: `color-mix(in srgb, ${branch.color} 5%, transparent)`,
              border: `1px solid color-mix(in srgb, ${branch.color} 10%, transparent)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl animate-streak-fire inline-block">
                {skill.currentStreak > 0 ? '🔥' : '❄️'}
              </span>
              <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
                {skill.currentStreak}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Current
              </span>
            </div>
            <div className="w-px h-10 bg-[var(--border-subtle)]" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">🏆</span>
              <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
                {skill.bestStreak}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Best
              </span>
            </div>
            <div className="w-px h-10 bg-[var(--border-subtle)]" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">📊</span>
              <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
                {skill.totalSessions}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Sessions
              </span>
            </div>
          </div>

          {/* Practice button */}
          <div className="relative flex justify-center">
            {showXPBurst && (
              <span
                className="absolute -top-2 text-sm font-bold animate-xp-burst"
                style={{ color: branch.color }}
              >
                +1 XP
              </span>
            )}
            <button
              className="practice-btn w-full max-w-[280px]"
              onClick={handlePractice}
              disabled={isPracticing}
              style={{
                background: `linear-gradient(135deg, ${branch.color}, ${branch.glowColor})`,
                boxShadow: `0 4px 15px color-mix(in srgb, ${branch.color} 30%, transparent)`,
              }}
            >
              {isPracticedToday ? '✓ +1 XP — PRACTICE' : '+1 XP — PRACTICE'}
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="surface-elevated rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Last practiced
              </span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {formatDate(skill.lastPracticedDate)}
              </span>
            </div>
            <div className="surface-elevated rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Total XP
              </span>
              <span className="text-sm font-semibold font-mono text-[var(--text-primary)]">
                {skill.xp}
              </span>
            </div>
            <div className="surface-elevated rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Priority
              </span>
              <span className={`text-sm font-bold priority-${skill.priority.toLowerCase()}`}>
                {skill.priority}-Rank
              </span>
            </div>
            <div className="surface-elevated rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Frequency
              </span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {frequencyLabel[skill.frequency] || skill.frequency}
              </span>
            </div>
          </div>

          {/* ─── Reminder & Notifications Section ─────────────────────────── */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Reminders & Notifications
            </span>

            {/* Set Reminder button */}
            <button
              onClick={() => setShowReminderEditor(true)}
              className="w-full py-3 rounded-xl font-semibold text-sm border transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                borderColor: `color-mix(in srgb, ${branch.color} 30%, transparent)`,
                color: branch.color,
                background: `color-mix(in srgb, ${branch.color} 5%, transparent)`,
              }}
            >
              ⏰ Set Reminder
            </button>

            {/* Notification permission */}
            {notifPermission !== 'granted' ? (
              <button
                onClick={handleEnableNotifications}
                className="w-full py-3 rounded-xl font-semibold text-sm border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-indigo-500/30 hover:text-indigo-400 transition-all duration-200 flex items-center justify-center gap-2"
              >
                🔔 Enable Push Notifications
              </button>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 py-2.5 rounded-xl text-center text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  🔔 Notifications Active
                </div>
                <button
                  onClick={handleTestNotification}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] transition-all"
                >
                  Test
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {skill.description && (
            <div className="surface-elevated rounded-xl p-4">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">
                Description
              </span>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {skill.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reminder Editor Modal */}
      {showReminderEditor && (
        <ReminderEditor
          skill={skill}
          branch={branch}
          onClose={() => setShowReminderEditor(false)}
        />
      )}
    </>
  );
}
