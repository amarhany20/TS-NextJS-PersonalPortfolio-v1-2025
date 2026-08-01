import type { ThemeDefinition, ThemeSummary } from './types';

const professionalDark: ThemeDefinition = {
  id: 'professional-dark',
  name: 'Professional Dark',
  description: 'High-contrast dark theme tuned for dashboards and hero copy.',
  author: 'Portfolio Template',
  version: '1.0.0',
  tags: ['dark', 'professional', 'default'],
  accent: '#ffd600',
  previewGradient: 'linear-gradient(135deg, #14171f 0%, #0f1118 65%, #272b38 100%)',
  tokens: {
    background: '#111216',
    foreground: '#f5f5f7',
    sidebar: '#181a1b',
    accentPrimary: '#ffd600',
    accentSecondary: '#058ddb',
    accentMuted: '#22242b',
    textSecondary: '#bdbdbd',
    cardBg: '#22242b',
    border: '#242424',
    success: '#38d996',
    danger: '#fa5252',
    warning: '#fcc419',
  },
};

const modernGradient: ThemeDefinition = {
  id: 'modern-gradient',
  name: 'Modern Gradient',
  description: 'Vibrant purples, punchy blues, and glass panels for bold campaigns.',
  author: 'Portfolio Template',
  version: '1.0.0',
  tags: ['gradient', 'vibrant'],
  accent: '#8b5dff',
  previewGradient: 'linear-gradient(135deg, #2d1b69 0%, #0f8bd8 55%, #f44f9c 100%)',
  tokens: {
    background: '#050818',
    foreground: '#fdf4ff',
    sidebar: '#080c1f',
    accentPrimary: '#905CFF',
    accentSecondary: '#FF6EA9',
    accentMuted: '#111432',
    textSecondary: '#d9d6f0',
    cardBg: '#0f1733',
    border: '#1b1f3a',
    success: '#47e6b1',
    danger: '#ff5f87',
    warning: '#ffd166',
  },
};

const minimalLight: ThemeDefinition = {
  id: 'minimal-light',
  name: 'Minimal Light',
  description: 'Clean light surfaces with gentle blues for case studies and resumes.',
  author: 'Portfolio Template',
  version: '1.0.0',
  tags: ['light', 'minimal'],
  accent: '#0ea5e9',
  previewGradient: 'linear-gradient(145deg, #fefefe 0%, #d9e8ff 60%, #eef2ff 100%)',
  tokens: {
    background: '#f8fafc',
    foreground: '#0f172a',
    sidebar: '#ffffff',
    accentPrimary: '#0ea5e9',
    accentSecondary: '#6366f1',
    accentMuted: '#e2e8f0',
    textSecondary: '#64748b',
    cardBg: '#ffffff',
    border: '#d0d8e8',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
};

const oceanBlue: ThemeDefinition = {
  id: 'ocean-blue',
  name: 'Ocean Blue',
  description: 'Cool blues and teals with a modern, calming aesthetic.',
  author: 'Portfolio Template',
  version: '1.0.0',
  tags: ['blue', 'ocean', 'cool', 'modern'],
  accent: '#00d4ff',
  previewGradient: 'linear-gradient(135deg, #0a1929 0%, #0d4f7c 50%, #00d4ff 100%)',
  tokens: {
    background: '#0a1929',
    foreground: '#e8f4f8',
    sidebar: '#0f2338',
    accentPrimary: '#00d4ff',
    accentSecondary: '#14b8a6',
    accentMuted: '#1a3a52',
    textSecondary: '#94a3b8',
    cardBg: '#112240',
    border: '#1e3a5f',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
};

const sunsetEditorial: ThemeDefinition = {
  id: 'sunset-editorial',
  name: 'Sunset Editorial',
  description: 'Warm copper, ember, and ink tones for a premium editorial portfolio feel.',
  author: 'Portfolio Template',
  version: '1.0.0',
  tags: ['warm', 'editorial', 'premium'],
  accent: '#ff9f1c',
  previewGradient: 'linear-gradient(135deg, #2a1410 0%, #7a3b1f 52%, #ff9f1c 100%)',
  tokens: {
    background: '#120d0d',
    foreground: '#fff4e6',
    sidebar: '#1d1412',
    accentPrimary: '#ff9f1c',
    accentSecondary: '#ff5d3d',
    accentMuted: '#2c1f1b',
    textSecondary: '#d7c1af',
    cardBg: '#1f1715',
    border: '#3b2822',
    success: '#52d681',
    danger: '#ff6b6b',
    warning: '#ffd166',
  },
};

const forestNoir: ThemeDefinition = {
  id: 'forest-noir',
  name: 'Forest Noir',
  description: 'Deep woodland greens with brass accents for a focused, high-trust look.',
  author: 'Portfolio Template',
  version: '1.0.0',
  tags: ['dark', 'green', 'elegant'],
  accent: '#7ddf64',
  previewGradient: 'linear-gradient(135deg, #07130f 0%, #123728 52%, #7ddf64 100%)',
  tokens: {
    background: '#09110f',
    foreground: '#edf7ef',
    sidebar: '#0d1815',
    accentPrimary: '#7ddf64',
    accentSecondary: '#c4a35a',
    accentMuted: '#14221d',
    textSecondary: '#a9bbb1',
    cardBg: '#101a17',
    border: '#21332c',
    success: '#51d88a',
    danger: '#f87171',
    warning: '#fbbf24',
  },
};

const paperSlate: ThemeDefinition = {
  id: 'paper-slate',
  name: 'Paper Slate',
  description:
    'Editorial off-white surfaces with sharp slate contrast for a clean knowledge-first aesthetic.',
  author: 'Portfolio Template',
  version: '1.0.0',
  tags: ['light', 'editorial', 'clean'],
  accent: '#2563eb',
  previewGradient: 'linear-gradient(145deg, #fffdf7 0%, #e6ecf5 58%, #cdd7e6 100%)',
  tokens: {
    background: '#f7f4ed',
    foreground: '#16202a',
    sidebar: '#eef2f7',
    accentPrimary: '#2563eb',
    accentSecondary: '#0f766e',
    accentMuted: '#dce4ee',
    textSecondary: '#5b6878',
    cardBg: '#fffdf8',
    border: '#cfd8e3',
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#d97706',
  },
};

const THEME_REGISTRY: ThemeDefinition[] = [
  professionalDark,
  modernGradient,
  minimalLight,
  oceanBlue,
  sunsetEditorial,
  forestNoir,
  paperSlate,
];

export const DEFAULT_THEME_ID = professionalDark.id;

export function listThemes(): ThemeDefinition[] {
  return [...THEME_REGISTRY];
}

export function getThemeById(themeId?: string | null): ThemeDefinition | undefined {
  if (!themeId) {
    return undefined;
  }

  return THEME_REGISTRY.find((theme) => theme.id === themeId);
}

export function getThemeSummary(themeId?: string | null): ThemeSummary {
  const theme = getThemeById(themeId) ?? THEME_REGISTRY[0];
  return toSummary(theme);
}

export function toSummary(theme: ThemeDefinition): ThemeSummary {
  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    accent: theme.accent,
    previewGradient: theme.previewGradient,
    version: theme.version,
    tags: theme.tags,
  };
}

export function listThemeSummaries(): ThemeSummary[] {
  return THEME_REGISTRY.map(toSummary);
}

export type { ThemeDefinition, ThemeSummary, ThemeTokens } from './types';
