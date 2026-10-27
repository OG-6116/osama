// Color palette for processes with high contrast, dark mode vibrance, and clean pastels
export const PROCESS_COLORS = [
  { bg: '#3B82F6', border: '#2563EB', light: '#DBEAFE', text: '#FFFFFF', darkText: '#1D4ED8', glow: 'rgba(59, 130, 246, 0.4)' }, // Blue
  { bg: '#10B981', border: '#059669', light: '#D1FAE5', text: '#FFFFFF', darkText: '#047857', glow: 'rgba(16, 185, 129, 0.4)' }, // Emerald
  { bg: '#8B5CF6', border: '#7C3AED', light: '#EDE9FE', text: '#FFFFFF', darkText: '#6D28D9', glow: 'rgba(139, 92, 246, 0.4)' }, // Purple
  { bg: '#F59E0B', border: '#D97706', light: '#FEF3C7', text: '#FFFFFF', darkText: '#B45309', glow: 'rgba(245, 158, 11, 0.4)' }, // Amber
  { bg: '#EC4899', border: '#DB2777', light: '#FCE7F3', text: '#FFFFFF', darkText: '#BE185D', glow: 'rgba(236, 72, 153, 0.4)' }, // Pink
  { bg: '#06B6D4', border: '#0891B2', light: '#CFFAFE', text: '#FFFFFF', darkText: '#0E7490', glow: 'rgba(6, 182, 212, 0.4)' }, // Cyan
  { bg: '#F97316', border: '#EA580C', light: '#FFEDD5', text: '#FFFFFF', darkText: '#C2410C', glow: 'rgba(249, 115, 22, 0.4)' }, // Orange
  { bg: '#14B8A6', border: '#0D9488', light: '#CCFBF1', text: '#FFFFFF', darkText: '#0F766E', glow: 'rgba(20, 184, 166, 0.4)' }, // Teal
  { bg: '#A855F7', border: '#9333EA', light: '#F3E8FF', text: '#FFFFFF', darkText: '#7E22CE', glow: 'rgba(168, 85, 247, 0.4)' }, // Violet
  { bg: '#84CC16', border: '#65A30D', light: '#ECFCCB', text: '#FFFFFF', darkText: '#4D7C0F', glow: 'rgba(132, 204, 22, 0.4)' }, // Lime
  { bg: '#E11D48', border: '#BE123C', light: '#FFE4E6', text: '#FFFFFF', darkText: '#9F1239', glow: 'rgba(225, 29, 72, 0.4)' }, // Rose
  { bg: '#6366F1', border: '#4F46E5', light: '#E0E7FF', text: '#FFFFFF', darkText: '#3730A3', glow: 'rgba(99, 102, 241, 0.4)' }, // Indigo
];

export const IDLE_COLOR = {
  bg: '#334155',
  border: '#475569',
  light: '#E2E8F0',
  text: '#94A3B8',
  darkText: '#64748B',
  glow: 'rgba(71, 85, 105, 0.2)'
};

const processColorMap = new Map();

/**
 * Returns a consistent color object for a given process ID
 */
export function getProcessColor(processId) {
  if (!processId || processId === 'IDLE' || processId === 'Idle') {
    return IDLE_COLOR;
  }

  if (processColorMap.has(processId)) {
    return processColorMap.get(processId);
  }

  // Extract trailing digits if any, e.g. "P3" -> index 2
  const match = processId.match(/\d+/);
  let index;
  if (match) {
    index = (parseInt(match[0], 10) - 1) % PROCESS_COLORS.length;
    if (index < 0) index = 0;
  } else {
    // Hash string if no number
    let hash = 0;
    for (let i = 0; i < processId.length; i++) {
      hash = (hash << 5) - hash + processId.charCodeAt(i);
      hash |= 0;
    }
    index = Math.abs(hash) % PROCESS_COLORS.length;
  }

  const color = PROCESS_COLORS[index];
  processColorMap.set(processId, color);
  return color;
}
