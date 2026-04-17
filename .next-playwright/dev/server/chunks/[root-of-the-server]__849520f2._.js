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
"[project]/src/app/api/v1/example/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Example API Route Handler
 * 
 * Demonstrates the standard pattern for API endpoints:
 * 1. Validate input with Zod
 * 2. Call service layer
 * 3. Serialize output
 * 4. Return consistent response
 * 
 * This is a reference implementation. Delete or modify as needed.
 */ __turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/http/responses.ts [app-route] (ecmascript)");
;
;
// Input validation schema
const querySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('World')
});
async function GET(request) {
    try {
        // 1. Parse and validate input
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        const validationResult = querySchema.safeParse(searchParams);
        if (!validationResult.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validationErrorResponse"])('Invalid query parameters', validationResult.error.format());
        }
        const { name } = validationResult.data;
        // 2. Call service (in a real app, this would be in server/services/)
        const greeting = `Hello, ${name}!`;
        const timestamp = new Date().toISOString();
        // 3. Serialize response (in a real app, use server/serializers/)
        const data = {
            message: greeting,
            timestamp
        };
        // 4. Return consistent response
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(data);
    } catch (error) {
        // Centralized error handling
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(error);
    }
}
async function POST(request) {
    try {
        // 1. Parse and validate body
        const body = await request.json();
        const bodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Message is required')
        });
        const validationResult = bodySchema.safeParse(body);
        if (!validationResult.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validationErrorResponse"])('Invalid request body', validationResult.error.format());
        }
        const { message } = validationResult.data;
        // 2. Process (service layer in real app)
        const echo = {
            received: message,
            length: message.length,
            timestamp: new Date().toISOString()
        };
        // 3. Return response
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(echo, undefined, 201);
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$http$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(error);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__849520f2._.js.map