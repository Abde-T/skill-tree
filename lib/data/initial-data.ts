import { Branch, Skill, SkillTreeState, AppSettings, Todo } from '@/types';

// ─── Branches ────────────────────────────────────────────────────────────────

export const BRANCHES: Branch[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    color: '#3b82f6',    // blue-500
    glowColor: '#60a5fa', // blue-400
    icon: '⚙️',
    skillIds: ['software-engineering', 'typescript', 'react', 'computer-science'],
  },
  {
    id: 'thinking',
    name: 'Thinking',
    color: '#a855f7',    // purple-500
    glowColor: '#c084fc', // purple-400
    icon: '🧠',
    skillIds: ['decision-making', 'deep-work'],
  },
  {
    id: 'communication',
    name: 'Communication',
    color: '#f59e0b',    // amber-500
    glowColor: '#fbbf24', // amber-400
    icon: '💬',
    skillIds: ['writing', 'verbal-communication'],
  },
  {
    id: 'character',
    name: 'Character',
    color: '#10b981',    // emerald-500
    glowColor: '#34d399', // emerald-400
    icon: '🛡️',
    skillIds: ['discipline', 'consistency'],
  },
  {
    id: 'rogue',
    name: 'Rogue',
    color: '#ef4444',    // red-500
    glowColor: '#f87171', // red-400
    icon: '🗡️',
    skillIds: [], // Todos will be added dynamically
  },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

function createSkill(
  id: string,
  name: string,
  branchId: string,
  description: string,
  priority: Skill['priority'],
  frequency: Skill['frequency'],
): Skill {
  return {
    id,
    name,
    branchId,
    description,
    xp: 0,
    level: 1,
    currentStreak: 0,
    bestStreak: 0,
    totalSessions: 0,
    lastPracticedDate: null,
    priority,
    frequency,
    reminder: null,
    isActive: true,
  };
}

export const INITIAL_SKILLS: Record<string, Skill> = {
  // Engineering
  'software-engineering': createSkill(
    'software-engineering',
    'Software Engineering',
    'engineering',
    'Core software engineering principles, design patterns, and best practices.',
    'S',
    'daily',
  ),
  'typescript': createSkill(
    'typescript',
    'TypeScript',
    'engineering',
    'TypeScript language mastery — types, generics, patterns, and advanced features.',
    'A',
    '3x/week',
  ),
  'react': createSkill(
    'react',
    'React',
    'engineering',
    'React framework — components, hooks, state management, and performance.',
    'A',
    '3x/week',
  ),
  'computer-science': createSkill(
    'computer-science',
    'Computer Science',
    'engineering',
    'Algorithms, data structures, and foundational CS concepts.',
    'A',
    '2x/week',
  ),

  // Thinking
  'decision-making': createSkill(
    'decision-making',
    'Decision Making',
    'thinking',
    'Frameworks for better decisions — mental models, probabilistic thinking, bias awareness.',
    'A',
    '2x/week',
  ),
  'deep-work': createSkill(
    'deep-work',
    'Deep Work',
    'thinking',
    'Sustained focus and concentration — deep work protocols and attention training.',
    'S',
    'daily',
  ),

  // Communication
  'writing': createSkill(
    'writing',
    'Writing',
    'communication',
    'Clear, persuasive, and effective written communication.',
    'B',
    '2x/week',
  ),
  'verbal-communication': createSkill(
    'verbal-communication',
    'Verbal Communication',
    'communication',
    'Speaking, presenting, and articulating ideas clearly.',
    'B',
    '2x/week',
  ),

  // Character
  'discipline': createSkill(
    'discipline',
    'Discipline',
    'character',
    'Self-discipline, habit formation, and consistent execution.',
    'S',
    'daily',
  ),
  'consistency': createSkill(
    'consistency',
    'Consistency',
    'character',
    'Showing up every day — maintaining routines and commitments.',
    'S',
    'daily',
  ),
};

// ─── Default Settings ────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  animationsEnabled: true,
  notificationsEnabled: false,
  notificationPermission: 'default',
};

// ─── Initial State ───────────────────────────────────────────────────────────

export const INITIAL_STATE: SkillTreeState = {
  branches: BRANCHES,
  skills: INITIAL_SKILLS,
  todos: {},
  sessions: [],
  settings: DEFAULT_SETTINGS,
};
