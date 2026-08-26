'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { INITIAL_STATE } from '@/lib/data/initial-data';
import type { SkillTreeState, Todo } from '@/types';
import SkillTreeCanvas from '@/app/components/skill-tree/SkillTreeCanvas';
import { loadTodos, saveTodos, isOPFSAvailable } from '@/lib/storage/opfs';

export default function Home() {
  const [state, setState] = useState<SkillTreeState>(INITIAL_STATE);
  const [isStorageReady, setIsStorageReady] = useState(false);

  // Load todos from storage on mount
  useEffect(() => {
    const loadState = async () => {
      if (isOPFSAvailable()) {
        try {
          const savedTodos = await loadTodos();
          if (Object.keys(savedTodos).length > 0) {
            setState((prev) => ({
              ...prev,
              todos: savedTodos,
              branches: prev.branches.map((branch) =>
                branch.id === 'rogue'
                  ? { ...branch, skillIds: Object.keys(savedTodos) }
                  : branch
              ),
            }));
            console.log('[Storage] Loaded todos from OPFS');
          }
        } catch (err) {
          console.error('[Storage] Failed to load todos:', err);
        }
      }
      setIsStorageReady(true);
    };

    loadState();
  }, []);

  // Auto-register service worker and restore push subscription on mount
  useEffect(() => {
    const initPushNotifications = async () => {
      try {
        const { registerServiceWorker, subscribeToPush } = await import('@/lib/notifications/push-client');
        
        // Register service worker
        const registration = await registerServiceWorker();
        if (registration) {
          console.log('[Push] Service worker registered on app load');
          
          // Check for existing subscription and restore it
          const existingSubscription = await registration.pushManager.getSubscription();
          if (existingSubscription) {
            console.log('[Push] Found existing subscription, sending to backend');
            await fetch('/api/push/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(existingSubscription.toJSON()),
            });
          } else {
            console.log('[Push] No existing subscription found');
          }
        }
      } catch (err) {
        console.error('[Push] Failed to initialize push notifications:', err);
      }
    };

    initPushNotifications();
  }, []);

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

  const handleAddTodo = useCallback(async (title: string, description: string, reminderConfig?: { frequency: string; preferredTime: string }) => {
    const todoId = `todo-${Date.now()}`;
    const newTodo: Todo = {
      id: todoId,
      title,
      description,
      branchId: 'rogue',
      completed: false,
      completedAt: null,
      dueDate: null,
      reminder: reminderConfig ? {
        skillId: todoId,
        frequency: reminderConfig.frequency,
        preferredTime: reminderConfig.preferredTime,
        enabled: true,
      } : null,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => {
      const updatedTodos = { ...prev.todos, [todoId]: newTodo };
      
      // Save to OPFS
      if (isOPFSAvailable()) {
        saveTodos(updatedTodos);
      }
      
      return {
        ...prev,
        todos: updatedTodos,
        branches: prev.branches.map((branch) =>
          branch.id === 'rogue'
            ? { ...branch, skillIds: [...branch.skillIds, todoId] }
            : branch
        ),
      };
    });

    // Schedule reminder if configured
    if (reminderConfig) {
      try {
        const res = await fetch('/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skillId: todoId,
            skillName: title,
            frequency: reminderConfig.frequency,
            preferredTime: reminderConfig.preferredTime,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          console.error('Failed to schedule todo reminder:', data.error);
          // Remove reminder from todo if scheduling failed
          setState((prev) => ({
            ...prev,
            todos: {
              ...prev.todos,
              [todoId]: {
                ...prev.todos[todoId],
                reminder: null,
              },
            },
          }));
          throw new Error(data.error || 'Failed to schedule reminder');
        }
      } catch (err) {
        console.error('Failed to schedule todo reminder:', err);
        throw err;
      }
    }
  }, [isStorageReady]);

  const handleDeleteTodo = useCallback(async (todoId: string) => {
    // Remove reminder if exists
    try {
      await fetch(`/api/reminders?skillId=${todoId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to remove todo reminder:', err);
    }

    setState((prev) => {
      const newTodos = { ...prev.todos };
      delete newTodos[todoId];

      // Save to OPFS
      if (isOPFSAvailable()) {
        saveTodos(newTodos);
      }

      return {
        ...prev,
        todos: newTodos,
        branches: prev.branches.map((branch) =>
          branch.id === 'rogue'
            ? { ...branch, skillIds: branch.skillIds.filter((id) => id !== todoId) }
            : branch
        ),
      };
    });
  }, [isStorageReady]);

  const handleToggleTodo = useCallback((todoId: string) => {
    setState((prev) => {
      const todo = prev.todos[todoId];
      if (!todo) return prev;

      const updatedTodos = {
        ...prev.todos,
        [todoId]: {
          ...todo,
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date().toISOString() : null,
        },
      };

      // Save to OPFS
      if (isOPFSAvailable()) {
        saveTodos(updatedTodos);
      }

      return {
        ...prev,
        todos: updatedTodos,
      };
    });
  }, [isStorageReady]);

  return (
    <SkillTreeCanvas
      state={state}
      onPractice={handlePractice}
      onAddTodo={handleAddTodo}
      onDeleteTodo={handleDeleteTodo}
      onToggleTodo={handleToggleTodo}
    />
  );
}
