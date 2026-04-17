/**
 * Maintenance mode utilities.
 *
 * Provides functions to check and handle maintenance mode state.
 */

import { SettingsRepository } from '@/server/repositories/SettingsRepository';

/**
 * Check whether maintenance mode is enabled.
 */
export async function isMaintenanceModeEnabled(): Promise<boolean> {
  try {
    const settings = await SettingsRepository.get();
    return settings?.maintenanceMode ?? false;
  } catch {
    // If settings can't be loaded, assume maintenance mode is off
    return false;
  }
}

/**
 * Read the maintenance message when maintenance mode is enabled.
 */
export async function getMaintenanceMessage(): Promise<string | null> {
  try {
    const settings = await SettingsRepository.get();
    return settings?.maintenanceMessage ?? null;
  } catch {
    return null;
  }
}

