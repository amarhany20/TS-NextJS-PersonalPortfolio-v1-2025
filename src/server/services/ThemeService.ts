import { BadRequestError, NotFoundError } from '@/server/http/errors';
import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import {
  DEFAULT_THEME_ID,
  getThemeById,
  getThemeSummary,
  listThemeSummaries,
  type ThemeSummary,
} from '@/themes';

interface ThemeListResponse {
  activeThemeId: string;
  themes: Array<ThemeSummary & { isActive: boolean }>;
}

export const ThemeService = {
  async listThemes(): Promise<ThemeListResponse> {
    const settings = await SettingsRepository.get();
    const activeThemeId = settings?.theme ?? DEFAULT_THEME_ID;

    const themes = listThemeSummaries().map((theme) => ({
      ...theme,
      isActive: theme.id === activeThemeId,
    }));

    return {
      activeThemeId,
      themes,
    };
  },

  async applyTheme(themeId: string): Promise<ThemeSummary> {
    const theme = getThemeById(themeId);
    if (!theme) {
      throw new NotFoundError('Theme not found');
    }

    const settings = await SettingsRepository.get();
    if (!settings) {
      throw new BadRequestError('Site settings have not been initialised. Run the setup wizard or seed script.');
    }

    await SettingsRepository.setTheme(theme.id);
    return getThemeSummary(theme.id);
  },
};
