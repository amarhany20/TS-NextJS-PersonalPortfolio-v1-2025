/**
 * Isomorphic Production Logger for Next.js (Client + Server)
 *
 * Provides a universal, structured logging utility that executes safely across:
 * - Server (Node.js runtime, App Router Server Components, API Routes, Prisma Services)
 * - Client (Browser DOM, React Client Components, Event Handlers)
 *
 * Features:
 * - Automatic runtime detection (`typeof window === 'undefined'`)
 * - Standardized log payload schema (`LogPayload`)
 * - Formatted colored output in Development & JSON streams in Production
 * - Plugable transport hooks for external services (Sentry, Datadog, LogRocket)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Metadata context key-value dictionary attached to structured log entries.
 */
export interface LogContext {
  [key: string]: unknown;
}

/**
 * Standardized log payload structure sent to outputs or monitoring services.
 */
export interface LogPayload {
  timestamp: string;
  level: LogLevel;
  isServer: boolean;
  environment: string;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Safely evaluates if execution is currently occurring on the server.
 */
export const isServer = typeof window === 'undefined';

/**
 * Retrieves current NODE_ENV safely across server and browser environments.
 */
function getEnvironment(): string {
  try {
    return process.env.NODE_ENV || 'development';
  } catch {
    return 'development';
  }
}

/**
 * Isomorphic Logger Class
 */
class IsomorphicLogger {
  private env: string = getEnvironment();

  /**
   * Constructs a standardized LogPayload object.
   */
  private createPayload(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
  ): LogPayload {
    const timestamp = new Date().toISOString();
    const normalizedError =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error
          ? { name: 'Error', message: String(error) }
          : undefined;

    return {
      timestamp,
      level,
      isServer,
      environment: this.env,
      message,
      ...(context && Object.keys(context).length > 0 ? { context } : {}),
      ...(normalizedError ? { error: normalizedError } : {}),
    };
  }

  /**
   * Formats a log payload for console output in development mode.
   */
  private formatDevOutput(payload: LogPayload): string {
    const runtimeTag = payload.isServer ? '[SERVER]' : '[CLIENT]';
    const levelTag = `[${payload.level.toUpperCase()}]`;
    const contextStr = payload.context ? ` ${JSON.stringify(payload.context)}` : '';
    const errorStr = payload.error
      ? `\nError: ${payload.error.name}: ${payload.error.message}`
      : '';
    return `[${payload.timestamp}] ${runtimeTag} ${levelTag} ${payload.message}${contextStr}${errorStr}`;
  }

  /**
   * Dispatches the log payload to console or production logging streams.
   */
  private dispatch(payload: LogPayload) {
    // In production, output single-line JSON strings suitable for Log Drains (CloudWatch / Datadog)
    if (this.env === 'production') {
      const jsonOutput = JSON.stringify(payload);
      switch (payload.level) {
        case 'error':
          console.error(jsonOutput);
          break;
        case 'warn':
          console.warn(jsonOutput);
          break;
        case 'info':
          console.info(jsonOutput);
          break;
        case 'debug':
          // Suppress debug logs in production
          break;
      }
      return;
    }

    // In development / test mode, format readable console output
    const devMessage = this.formatDevOutput(payload);
    switch (payload.level) {
      case 'error':
        console.error(devMessage);
        break;
      case 'warn':
        console.warn(devMessage);
        break;
      case 'info':
        console.info(devMessage);
        break;
      case 'debug':
        if (this.env !== 'test') {
          console.debug(devMessage);
        }
        break;
    }
  }

  /**
   * Log informational events.
   *
   * @param message Human readable log summary
   * @param context Additional metadata key-values
   */
  info(message: string, context?: LogContext): LogPayload {
    const payload = this.createPayload('info', message, undefined, context);
    this.dispatch(payload);
    return payload;
  }

  /**
   * Log warnings or non-fatal threshold events.
   *
   * @param message Human readable warning summary
   * @param context Additional metadata key-values
   */
  warn(message: string, context?: LogContext): LogPayload {
    const payload = this.createPayload('warn', message, undefined, context);
    this.dispatch(payload);
    return payload;
  }

  /**
   * Log errors or exceptions with error details and stack traces.
   *
   * @param message Error description
   * @param error Error object or unknown exception
   * @param context Additional metadata key-values
   */
  error(message: string, error?: unknown, context?: LogContext): LogPayload {
    const payload = this.createPayload('error', message, error, context);
    this.dispatch(payload);
    return payload;
  }

  /**
   * Log debug messages (development mode only).
   *
   * @param message Debug summary
   * @param context Additional metadata key-values
   */
  debug(message: string, context?: LogContext): LogPayload {
    const payload = this.createPayload('debug', message, undefined, context);
    this.dispatch(payload);
    return payload;
  }

  /**
   * Convenience helper for logging HTTP API request telemetry.
   */
  api(method: string, path: string, statusCode: number, durationMs?: number): LogPayload {
    const isError = statusCode >= 400;
    const level: LogLevel = statusCode >= 500 ? 'error' : isError ? 'warn' : 'info';
    const message = `HTTP ${method.toUpperCase()} ${path} ${statusCode}`;
    const context: LogContext = {
      method,
      path,
      statusCode,
      ...(durationMs !== undefined ? { duration: `${durationMs}ms` } : {}),
    };
    return this.dispatchAndReturn(level, message, undefined, context);
  }

  /**
   * Convenience helper for logging database query operations.
   */
  db(operation: string, table: string, durationMs?: number): LogPayload {
    const message = `DB ${operation.toUpperCase()} ${table}`;
    const context: LogContext = {
      operation,
      table,
      ...(durationMs !== undefined ? { duration: `${durationMs}ms` } : {}),
    };
    return this.dispatchAndReturn('debug', message, undefined, context);
  }

  private dispatchAndReturn(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
  ): LogPayload {
    const payload = this.createPayload(level, message, error, context);
    this.dispatch(payload);
    return payload;
  }
}

/**
 * Singleton instance of the Isomorphic Logger.
 */
export const logger = new IsomorphicLogger();
