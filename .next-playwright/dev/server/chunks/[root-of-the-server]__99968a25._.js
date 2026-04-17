module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/server/http/errors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * HTTP Error Classes and Mapping
 * 
 * Centralized error handling for API routes.
 * All domain errors map to HTTP status codes here.
 * 
 * Usage in controllers:
 *   throw new NotFoundError('User not found');
 *   throw new ValidationError('Invalid email format');
 */ __turbopack_context__.s([
    "AppError",
    ()=>AppError,
    "BadRequestError",
    ()=>BadRequestError,
    "ConflictError",
    ()=>ConflictError,
    "ForbiddenError",
    ()=>ForbiddenError,
    "NotFoundError",
    ()=>NotFoundError,
    "RateLimitError",
    ()=>RateLimitError,
    "SetupRequiredError",
    ()=>SetupRequiredError,
    "UnauthorizedError",
    ()=>UnauthorizedError,
    "ValidationError",
    ()=>ValidationError,
    "errorToResponse",
    ()=>errorToResponse,
    "toAppError",
    ()=>toAppError
]);
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details){
        super(message), this.statusCode = statusCode, this.code = code, this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
class ValidationError extends AppError {
    constructor(message, details){
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}
class NotFoundError extends AppError {
    constructor(message = 'Resource not found'){
        super(message, 404, 'NOT_FOUND');
    }
}
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized'){
        super(message, 401, 'UNAUTHORIZED');
    }
}
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden'){
        super(message, 403, 'FORBIDDEN');
    }
}
class ConflictError extends AppError {
    constructor(message = 'Resource already exists'){
        super(message, 409, 'CONFLICT');
    }
}
class RateLimitError extends AppError {
    constructor(message = 'Too many requests'){
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}
class BadRequestError extends AppError {
    constructor(message, details){
        super(message, 400, 'BAD_REQUEST', details);
    }
}
class SetupRequiredError extends AppError {
    constructor(message, details){
        super(message, 503, 'SETUP_REQUIRED', details);
    }
}
function toAppError(error) {
    if (error instanceof AppError) {
        return error;
    }
    if (error instanceof Error) {
        return new AppError(error.message);
    }
    return new AppError('An unexpected error occurred');
}
function errorToResponse(error) {
    return {
        success: false,
        error: {
            code: error.code,
            message: error.message,
            details: error.details
        }
    };
}
}),
"[project]/src/server/http/responses.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorResponse",
    ()=>errorResponse,
    "jsonResponse",
    ()=>jsonResponse,
    "notFoundResponse",
    ()=>notFoundResponse,
    "successResponse",
    ()=>successResponse,
    "unauthorizedResponse",
    ()=>unauthorizedResponse,
    "validationErrorResponse",
    ()=>validationErrorResponse
]);
/**
 * HTTP Response Helpers
 * 
 * Consistent response formatting for API routes.
 * All route handlers should use these helpers.
 * 
 * Usage:
 *   return jsonResponse({ user: userData }, 200);
 *   return successResponse(data, { page: 1, total: 100 });
 *   return errorResponse(error);
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/http/errors.ts [app-route] (ecmascript)");
;
;
function jsonResponse(data, status = 200, headers) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}
function successResponse(data, meta, status = 200) {
    return jsonResponse({
        success: true,
        data,
        ...meta && {
            meta
        }
    }, status);
}
function errorResponse(error) {
    const appError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toAppError"])(error);
    const response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorToResponse"])(appError);
    return jsonResponse(response, appError.statusCode);
}
function notFoundResponse(message = 'Resource not found') {
    return jsonResponse({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message
        }
    }, 404);
}
function unauthorizedResponse(message = 'Unauthorized') {
    return jsonResponse({
        success: false,
        error: {
            code: 'UNAUTHORIZED',
            message
        }
    }, 401);
}
function validationErrorResponse(message, details) {
    return jsonResponse({
        success: false,
        error: {
            code: 'VALIDATION_ERROR',
            message,
            details
        }
    }, 400);
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/server/security/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "destroySession",
    ()=>destroySession,
    "getSession",
    ()=>getSession,
    "requireAuth",
    ()=>requireAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/iron-session/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/http/errors.ts [app-route] (ecmascript)");
;
;
;
const COOKIE_NAME = 'portfolio_session';
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
let cachedOptions = null;
function resolveSessionOptions() {
    if (cachedOptions) {
        return cachedOptions;
    }
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('AUTH_SECRET environment variable must be set to a 32+ character string.');
    }
    cachedOptions = {
        cookieName: COOKIE_NAME,
        password: secret,
        ttl: DEFAULT_TTL_SECONDS,
        cookieOptions: {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'lax',
            path: '/'
        }
    };
    return cachedOptions;
}
async function getSession(store) {
    const cookieStore = store ?? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(cookieStore, resolveSessionOptions());
}
async function requireAuth(store) {
    const session = await getSession(store);
    if (!session.user) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UnauthorizedError"]('Authentication required');
    }
    return session;
}
async function destroySession(session) {
    await session.destroy();
}
}),
"[project]/src/server/db/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
/**
 * Prisma Client Singleton
 *
 * Provides a single Prisma client instance across the app.
 * Safe to import in both server actions and route handlers.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'warn',
        'error'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
const __TURBOPACK__default__export__ = prisma;
}),
"[project]/src/server/server-utils/json.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Safe JSON parsing helpers for string-backed columns.
 */ __turbopack_context__.s([
    "parseJson",
    ()=>parseJson
]);
function parseJson(value, fallback) {
    if (!value) {
        return fallback;
    }
    try {
        return JSON.parse(value);
    } catch (error) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('Failed to parse JSON column', error);
        }
        return fallback;
    }
}
}),
"[project]/src/server/repositories/SettingsRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsRepository",
    ()=>SettingsRepository
]);
/**
 * SettingsRepository
 *
 * Provides access to the singleton settings row.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client/runtime/library [external] (@prisma/client/runtime/library, cjs, [project]/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/server-utils/json.ts [app-route] (ecmascript)");
;
;
;
const SETTINGS_ID = 'settings-singleton';
const SettingsRepository = {
    async getStatus () {
        try {
            const record = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].settings.findUnique({
                where: {
                    id: SETTINGS_ID
                }
            });
            if (!record) {
                return {
                    status: 'missing_record'
                };
            }
            const settings = {
                id: record.id,
                siteTitle: record.siteTitle,
                siteSubtitle: record.siteSubtitle,
                heroGreeting: record.heroGreeting,
                heroSubtitle: record.heroSubtitle,
                heroDescription: record.heroDescription,
                primaryEmail: record.primaryEmail,
                secondaryEmail: record.secondaryEmail,
                location: record.location,
                timezone: record.timezone,
                theme: record.theme,
                maintenanceMode: record.maintenanceMode,
                maintenanceMessage: record.maintenanceMessage,
                socialLinks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(record.socialLinks, []),
                heroButtons: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(record.heroButtons, null),
                contactConfig: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(record.contactConfig, null),
                seoDefaults: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(record.seoDefaults, null),
                setupCompletedAt: record.setupCompletedAt,
                setupVersion: record.setupVersion,
                databaseProvider: record.databaseProvider,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt
            };
            return {
                status: 'ready',
                settings
            };
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClientKnownRequestError"] && error.code === 'P2021') {
                console.warn('Settings table missing. Run `npx prisma migrate dev` (local) or `npx prisma migrate deploy` (prod) to initialise the database.');
                return {
                    status: 'missing_table'
                };
            }
            throw error;
        }
    },
    async get () {
        let record;
        try {
            record = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].settings.findUnique({
                where: {
                    id: SETTINGS_ID
                }
            });
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClientKnownRequestError"] && error.code === 'P2021') {
                console.warn('Settings table missing. Run `npx prisma db push` or migrations to initialise the database.');
                return null;
            }
            throw error;
        }
        if (!record) {
            return null;
        }
        return {
            id: record.id,
            siteTitle: record.siteTitle,
            siteSubtitle: record.siteSubtitle,
            heroGreeting: record.heroGreeting,
            heroSubtitle: record.heroSubtitle,
            heroDescription: record.heroDescription,
            primaryEmail: record.primaryEmail,
            secondaryEmail: record.secondaryEmail,
            location: record.location,
            timezone: record.timezone,
            theme: record.theme,
            maintenanceMode: record.maintenanceMode,
            maintenanceMessage: record.maintenanceMessage,
            socialLinks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(record.socialLinks, []),
            heroButtons: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(record.heroButtons, null),
            contactConfig: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(record.contactConfig, null),
            seoDefaults: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$server$2d$utils$2f$json$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseJson"])(record.seoDefaults, null),
            setupCompletedAt: record.setupCompletedAt,
            setupVersion: record.setupVersion,
            databaseProvider: record.databaseProvider,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt
        };
    },
    async setTheme (themeId) {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].settings.update({
                where: {
                    id: SETTINGS_ID
                },
                data: {
                    theme: themeId
                }
            });
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClientKnownRequestError"] && error.code === 'P2025') {
                throw new Error('Settings record not initialised. Ensure .env bootstrap has run and database is migrated.');
            }
            throw error;
        }
    }
};
}),
"[project]/src/themes/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_THEME_ID",
    ()=>DEFAULT_THEME_ID,
    "getThemeById",
    ()=>getThemeById,
    "getThemeSummary",
    ()=>getThemeSummary,
    "listThemeSummaries",
    ()=>listThemeSummaries,
    "listThemes",
    ()=>listThemes,
    "toSummary",
    ()=>toSummary
]);
const professionalDark = {
    id: 'professional-dark',
    name: 'Professional Dark',
    description: 'High-contrast dark theme tuned for dashboards and hero copy.',
    author: 'Ammar Hany',
    version: '1.0.0',
    tags: [
        'dark',
        'professional',
        'default'
    ],
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
        warning: '#fcc419'
    }
};
const modernGradient = {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Vibrant purples, punchy blues, and glass panels for bold campaigns.',
    author: 'Ammar Hany',
    version: '1.0.0',
    tags: [
        'gradient',
        'vibrant'
    ],
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
        warning: '#ffd166'
    }
};
const minimalLight = {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Clean light surfaces with gentle blues for case studies and resumes.',
    author: 'Ammar Hany',
    version: '1.0.0',
    tags: [
        'light',
        'minimal'
    ],
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
        warning: '#f59e0b'
    }
};
const oceanBlue = {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Cool blues and teals with a modern, calming aesthetic.',
    author: 'Ammar Hany',
    version: '1.0.0',
    tags: [
        'blue',
        'ocean',
        'cool',
        'modern'
    ],
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
        warning: '#f59e0b'
    }
};
const THEME_REGISTRY = [
    professionalDark,
    modernGradient,
    minimalLight,
    oceanBlue
];
const DEFAULT_THEME_ID = professionalDark.id;
function listThemes() {
    return [
        ...THEME_REGISTRY
    ];
}
function getThemeById(themeId) {
    if (!themeId) {
        return undefined;
    }
    return THEME_REGISTRY.find((theme)=>theme.id === themeId);
}
function getThemeSummary(themeId) {
    const theme = getThemeById(themeId) ?? THEME_REGISTRY[0];
    return toSummary(theme);
}
function toSummary(theme) {
    return {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        accent: theme.accent,
        previewGradient: theme.previewGradient,
        version: theme.version,
        tags: theme.tags
    };
}
function listThemeSummaries() {
    return THEME_REGISTRY.map(toSummary);
}
}),
"[project]/src/server/services/ThemeService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeService",
    ()=>ThemeService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/http/errors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$SettingsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/repositories/SettingsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$themes$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/themes/index.ts [app-route] (ecmascript)");
;
;
;
const ThemeService = {
    async listThemes () {
        const settings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$SettingsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SettingsRepository"].get();
        const activeThemeId = settings?.theme ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$themes$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_THEME_ID"];
        const themes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$themes$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listThemeSummaries"])().map((theme)=>({
                ...theme,
                isActive: theme.id === activeThemeId
            }));
        return {
            activeThemeId,
            themes
        };
    },
    async applyTheme (themeId) {
        const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$themes$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getThemeById"])(themeId);
        if (!theme) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NotFoundError"]('Theme not found');
        }
        const settings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$SettingsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SettingsRepository"].get();
        if (!settings) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BadRequestError"]('Site settings have not been initialised. Configure environment variables and bootstrap or seed the database.');
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$SettingsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SettingsRepository"].setTheme(theme.id);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$themes$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getThemeSummary"])(theme.id);
    }
};
}),
"[project]/src/app/api/v1/themes/apply/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/http/responses.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$security$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/security/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$ThemeService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/ThemeService.ts [app-route] (ecmascript)");
;
;
;
;
;
const applyThemeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    themeId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'themeId is required')
});
async function POST(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$security$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])();
        const body = await request.json();
        const result = applyThemeSchema.safeParse(body);
        if (!result.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validationErrorResponse"])('Invalid request body', result.error.format());
        }
        const theme = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$ThemeService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ThemeService"].applyTheme(result.data.themeId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revalidatePath"])('/', 'layout');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])({
            theme
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__99968a25._.js.map