import { logger, type LogContext } from '@/utils/logger';

export { logger, type LogContext, type LogLevel, type LogPayload, isServer } from '@/utils/logger';

/**
 * Backward-compatible helper for logging API requests.
 */
export function logRequest(method: string, path: string, statusCode: number, duration?: number) {
  return logger.api(method, path, statusCode, duration);
}

/**
 * Backward-compatible helper for logging server API errors.
 */
export function logError(error: Error | unknown, context?: LogContext) {
  return logger.error('API error', error, context);
}

/**
 * Backward-compatible helper for logging database operations.
 */
export function logDatabase(operation: string, table: string, duration?: number) {
  return logger.db(operation, table, duration);
}
