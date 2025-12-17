/**
 * Logging utility for server-side logging.
 * 
 * This provides a structured logging interface that can be extended
 * to integrate with logging services like Sentry, LogRocket, or Datadog.
 * 
 * For v1, logs to console. In production, this can be extended to
 * send logs to external services.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };
    console.error(this.formatMessage('error', message, errorContext));
  }
}

export const logger = new Logger();

/**
 * Log API request
 */
export function logRequest(method: string, path: string, statusCode: number, duration?: number) {
  logger.info('API request', {
    method,
    path,
    statusCode,
    duration: duration ? `${duration}ms` : undefined,
  });
}

/**
 * Log API error
 */
export function logError(error: Error, context?: LogContext) {
  logger.error('API error', error, context);
}

/**
 * Log database operation
 */
export function logDatabase(operation: string, table: string, duration?: number) {
  logger.debug('Database operation', {
    operation,
    table,
    duration: duration ? `${duration}ms` : undefined,
  });
}

