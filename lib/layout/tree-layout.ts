export interface NodePosition {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage, where 0 is bottom and 100 is top
}

export interface SkillLayout {
  [skillId: string]: {
    pos: NodePosition;
    parents: string[]; // IDs of parent nodes (for drawing lines)
  };
}

export const TREE_LAYOUT: SkillLayout = {
  // --- Character Branch (Right-ish) ---
  'consistency': {
    pos: { x: 65, y: 20 },
    parents: ['root'], // Connects to the central root
  },
  'discipline': {
    pos: { x: 75, y: 35 },
    parents: ['consistency'],
  },

  // --- Engineering Branch (Left side) ---
  'computer-science': {
    pos: { x: 30, y: 25 },
    parents: ['root'],
  },
  'software-engineering': {
    pos: { x: 20, y: 40 },
    parents: ['computer-science'],
  },
  'typescript': {
    pos: { x: 10, y: 60 },
    parents: ['software-engineering'],
  },
  'react': {
    pos: { x: 30, y: 60 },
    parents: ['software-engineering'],
  },

  // --- Thinking Branch (Center-Left) ---
  'decision-making': {
    pos: { x: 45, y: 45 },
    parents: ['root'],
  },
  'deep-work': {
    pos: { x: 45, y: 70 },
    parents: ['decision-making'],
  },

  // --- Communication Branch (Far Right side) ---
  'verbal-communication': {
    pos: { x: 85, y: 25 },
    parents: ['root'],
  },
  'writing': {
    pos: { x: 90, y: 50 },
    parents: ['verbal-communication'],
  },
};
