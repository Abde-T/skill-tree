// ─── Priority & Frequency ────────────────────────────────────────────────────

export type SkillPriority = 'S' | 'A' | 'B' | 'C';

export type SkillFrequency =
  | 'daily'
  | '3x/week'
  | '2x/week'
  | 'weekly';

// ─── Reminder ────────────────────────────────────────────────────────────────

export interface ReminderConfig {
  skillId: string;
  frequency: string; // e.g. "every 2 days", "daily"
  preferredTime: string; // HH:mm format
  enabled: boolean;
}

// ─── Practice Session ────────────────────────────────────────────────────────

export interface PracticeSession {
  id: string;
  skillId: string;
  timestamp: string; // ISO 8601
  xpGained: number;
}

// ─── Todo ─────────────────────────────────────────────────────────────────────

export interface Todo {
  id: string;
  title: string;
  description: string;
  branchId: string;
  completed: boolean;
  completedAt: string | null;
  dueDate: string | null; // ISO 8601 date string or null
  reminder: ReminderConfig | null;
  createdAt: string; // ISO 8601
}

// ─── Skill ───────────────────────────────────────────────────────────────────

export interface Skill {
  id: string;
  name: string;
  branchId: string;
  description: string;
  xp: number; // total accumulated XP
  level: number;
  currentStreak: number;
  bestStreak: number;
  totalSessions: number;
  lastPracticedDate: string | null; // ISO 8601 date string or null
  priority: SkillPriority;
  frequency: SkillFrequency;
  reminder: ReminderConfig | null;
  isActive: boolean;
  gridPosition?: GridPosition; // Dynamic grid position for this skill
  parentId?: string; // ID of parent skill (for hierarchical skills)
}

// ─── Branch ──────────────────────────────────────────────────────────────────

export interface Branch {
  id: string;
  name: string;
  color: string; // CSS color / hex
  glowColor: string; // lighter version for glow effects
  icon: string; // emoji or icon identifier
  skillIds: string[];
  gridPosition?: GridPosition; // Dynamic grid position for this branch
  parentId?: string; // ID of parent branch/node (null for root-level branches)
}

// ─── Grid Position ────────────────────────────────────────────────────────────

export interface GridPosition {
  layer: number; // 0 = root level (branches), 1 = first level skills, 2 = second level skills, etc.
  index: number; // Position within the layer (0, 1, 2, ...)
  angle?: number; // For circular arrangement at root level
}

export interface NodePosition {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage, where 0 is bottom and 100 is top
}

// ─── Rogue Node ───────────────────────────────────────────────────────────────

export interface RogueNode {
  id: string;
  name: string;
  description: string;
  isDragging: boolean;
  createdAt: string; // ISO 8601
}

// ─── App Settings ────────────────────────────────────────────────────────────

export interface AppSettings {
  theme: 'dark' | 'light';
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  notificationPermission: NotificationPermission | 'default';
}

// ─── Aggregate State ─────────────────────────────────────────────────────────

export interface SkillTreeState {
  branches: Branch[];
  skills: Record<string, Skill>;
  todos: Record<string, Todo>;
  sessions: PracticeSession[];
  settings: AppSettings;
  rogueNodes: Record<string, RogueNode>;
}
