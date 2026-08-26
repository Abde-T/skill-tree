'use client';

import React, { useState, useCallback } from 'react';
import { INITIAL_STATE } from '@/lib/data/initial-data';
import type { SkillTreeState } from '@/types';
import SkillTreeCanvas from '@/app/components/skill-tree/SkillTreeCanvas';

export default function Home() {
  const [state, setState] = useState<SkillTreeState>(INITIAL_STATE);

  const handlePractice = useCallback((skillId: string) => {
    setState((prev) => {
      const skill = prev.skills[skillId];
      if (!skill) return prev;

      const today = new Date().toISOString().split('T')[0];
      const newXP = skill.xp + 1;
      const newLevel = Math.floor(newXP / 100) + 1;

      // Streak calculation
      let newStreak = skill.currentStreak;
      if (skill.lastPracticedDate === today) {
        // Already practiced today — XP still counts but streak doesn't change
        newStreak = skill.currentStreak;
      } else if (
        skill.lastPracticedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
      ) {
        // Practiced yesterday — streak continues
        newStreak = skill.currentStreak + 1;
      } else if (skill.lastPracticedDate === null) {
        // First practice ever
        newStreak = 1;
      } else {
        // Streak broken — restart
        newStreak = 1;
      }

      const newBestStreak = Math.max(skill.bestStreak, newStreak);

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [skillId]: {
            ...skill,
            xp: newXP,
            level: newLevel,
            totalSessions: skill.totalSessions + 1,
            lastPracticedDate: today,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
          },
        },
        sessions: [
          ...prev.sessions,
          {
            id: `${skillId}-${Date.now()}`,
            skillId,
            timestamp: new Date().toISOString(),
            xpGained: 1,
          },
        ],
      };
    });
  }, []);

  return <SkillTreeCanvas state={state} onPractice={handlePractice} />;
}
