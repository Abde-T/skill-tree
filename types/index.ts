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
}

// ─── Branch ──────────────────────────────────────────────────────────────────

export interface Branch {
  id: string;
  name: string;
  color: string; // CSS color / hex
  glowColor: string; // lighter version for glow effects
  icon: string; // emoji or icon identifier
  skillIds: string[];
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
  sessions: PracticeSession[];
  settings: AppSettings;
}
