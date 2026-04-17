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
"[project]/src/server/repositories/UserRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserRepository",
    ()=>UserRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/prisma.ts [app-route] (ecmascript)");
;
function mapUser(record) {
    if (!record) {
        return null;
    }
    return {
        id: record.id,
        username: record.username,
        email: record.email,
        displayName: record.displayName,
        passwordHash: record.passwordHash,
        role: record.role,
        status: record.status,
        bio: record.bio,
        avatarUrl: record.avatarUrl,
        lastLoginAt: record.lastLoginAt,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
    };
}
const UserRepository = {
    async findByUsername (username) {
        const record = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
            where: {
                username
            }
        });
        return mapUser(record);
    },
    async findById (id) {
        const record = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
            where: {
                id
            }
        });
        return mapUser(record);
    },
    async recordLogin (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.update({
            where: {
                id
            },
            data: {
                lastLoginAt: new Date()
            }
        });
    }
};
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/server/security/password.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
const DEFAULT_SALT_ROUNDS = Number(process.env.AUTH_SALT_ROUNDS ?? 12);
async function hashPassword(plainText) {
    if (!plainText) {
        throw new Error('Password must be provided for hashing.');
    }
    const salt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["genSalt"])(DEFAULT_SALT_ROUNDS);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hash"])(plainText, salt);
}
async function verifyPassword(plainText, passwordHash) {
    if (!plainText || !passwordHash) {
        return false;
    }
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compare"])(plainText, passwordHash);
    } catch (error) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('Failed to verify password hash', error);
        }
        return false;
    }
}
}),
"[project]/src/server/services/AuthService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthService",
    ()=>AuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/http/errors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$UserRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/repositories/UserRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$security$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/security/password.ts [app-route] (ecmascript)");
;
;
;
const AuthService = {
    async authenticate (username, password) {
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$UserRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UserRepository"].findByUsername(username.trim().toLowerCase());
        if (!user || user.status !== 'active') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UnauthorizedError"]('Invalid username or password');
        }
        const passwordValid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$security$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"])(password, user.passwordHash);
        if (!passwordValid) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UnauthorizedError"]('Invalid username or password');
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$repositories$2f$UserRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UserRepository"].recordLogin(user.id);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            role: user.role
        };
    }
};
}),
"[project]/src/server/security/rateLimit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enforceRateLimit",
    ()=>enforceRateLimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/http/errors.ts [app-route] (ecmascript)");
;
const DEFAULT_CONFIG = {
    limit: 5,
    windowMs: 60_000
};
const buckets = new Map();
function enforceRateLimit(key, config = {}) {
    const { limit, windowMs } = {
        ...DEFAULT_CONFIG,
        ...config
    };
    const now = Date.now();
    const state = buckets.get(key);
    if (state && state.expiresAt > now) {
        if (state.count >= limit) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RateLimitError"]('Too many requests. Please try again later.');
        }
        state.count += 1;
        buckets.set(key, state);
        return;
    }
    buckets.set(key, {
        count: 1,
        expiresAt: now + windowMs
    });
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
"[project]/src/app/api/v1/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/http/responses.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$AuthService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/AuthService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$security$2f$rateLimit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/security/rateLimit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$security$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/security/session.ts [app-route] (ecmascript)");
;
;
;
;
;
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    username: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Username is required'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Password is required')
});
function getClientIdentifier(request) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }
    return 'unknown';
}
async function POST(request) {
    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validationErrorResponse"])('Invalid request body', validation.error.format());
        }
        const clientId = getClientIdentifier(request);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$security$2f$rateLimit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enforceRateLimit"])(`auth:login:${clientId}`, {
            limit: 5,
            windowMs: 60_000
        });
        const { username, password } = validation.data;
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$AuthService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AuthService"].authenticate(username, password);
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$security$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        session.user = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            role: user.role
        };
        session.lastActiveAt = Date.now();
        await session.save();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])({
            user
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__42705a05._.js.map