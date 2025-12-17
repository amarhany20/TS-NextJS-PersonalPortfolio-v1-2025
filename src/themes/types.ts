export interface ThemeTokens {
  background: string;
  foreground: string;
  sidebar: string;
  accentPrimary: string;
  accentSecondary: string;
  accentMuted: string;
  textSecondary: string;
  cardBg: string;
  border: string;
  success: string;
  danger: string;
  warning: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  tags: string[];
  accent: string;
  previewGradient: string;
  tokens: ThemeTokens;
}

export interface ThemeSummary {
  id: string;
  name: string;
  description: string;
  accent: string;
  previewGradient: string;
  version: string;
  tags: string[];
}
