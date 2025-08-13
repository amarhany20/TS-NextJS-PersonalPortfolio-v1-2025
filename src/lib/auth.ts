/**
 * Authentication Service
 * Secure authentication with bcrypt password hashing and JWT tokens
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/database";

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";
const BCRYPT_ROUNDS = 12;

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  isActive: boolean;
}

export interface AuthSession {
  id: string;
  user: AuthUser;
  token: string;
  expiresAt: Date;
}

// Validation schemas using Zod
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Password utilities
export class PasswordService {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validateStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return { isValid: errors.length === 0, errors };
  }
}

// JWT utilities
export class TokenService {
  static generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): { userId: string; timestamp: number } | Record<string, string | number> {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; timestamp: number };
    } catch {
      throw new Error("Invalid or expired token");
    }
  }

  static generateRefreshToken(): string {
    return jwt.sign({}, JWT_SECRET, { expiresIn: "30d" });
  }
}

// Validation service
export class ValidationService {
  static validateRegistration(data: { name: string; email: string; password: string }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate name
    if (!data.name || data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.push("Invalid email format");
    }

    // Validate password
    if (!data.password || data.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    return { isValid: errors.length === 0, errors };
  }
}

// Authentication service
export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<{ user: AuthUser; session: AuthSession }> {
    console.log("🔐 AuthService.login called with:", { email: credentials.email, hasPassword: !!credentials.password });

    // Validate input
    const validatedCredentials = loginSchema.parse(credentials);

    // Find user
    console.log("🔍 Looking for user:", validatedCredentials.email);
    const user = await prisma.user.findUnique({
      where: { email: validatedCredentials.email },
    });

    console.log("👤 User found:", !!user, user ? { id: user.id, email: user.email, isActive: user.isActive } : "none");

    if (!user?.isActive) {
      console.log("❌ User not found or inactive");
      throw new Error("Invalid email or password");
    }

    // Verify password
    console.log("🔐 Verifying password...");
    const isValidPassword = await PasswordService.verify(validatedCredentials.password, user.passwordHash);
    console.log("✅ Password valid:", isValidPassword);

    if (!isValidPassword) {
      console.log("❌ Invalid password");
      throw new Error("Invalid email or password");
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session
    const session = await this.createSession(user.id, ipAddress, userAgent);

    return {
      user: this.formatUser(user),
      session: session,
    };
  }

  /**
   * Create a new session
   */
  static async createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<AuthSession> {
    // Generate token
    const tokenPayload = { userId, timestamp: Date.now() };
    const token = TokenService.generateToken(tokenPayload);

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Create session in database
    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
        ipAddress,
        userAgent,
        status: "ACTIVE",
      },
      include: {
        user: true,
      },
    });

    return {
      id: session.id,
      user: this.formatUser(session.user),
      token: session.token,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Verify session token and return user
   */
  static async verifySession(token: string): Promise<AuthSession | null> {
    try {
      // Verify JWT token
      TokenService.verifyToken(token);

      // Find session in database
      const session = await prisma.session.findUnique({
        where: { token, status: "ACTIVE" },
        include: { user: true },
      });

      if (!session) {
        return null;
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        await this.expireSession(session.id);
        return null;
      }

      // Check if user is still active
      if (!session.user.isActive) {
        await this.expireSession(session.id);
        return null;
      }

      return {
        id: session.id,
        user: this.formatUser(session.user),
        token: session.token,
        expiresAt: session.expiresAt,
      };
    } catch {
      return null;
    }
  }

  /**
   * Logout user (expire session)
   */
  static async logout(token: string): Promise<boolean> {
    try {
      const session = await prisma.session.findUnique({
        where: { token },
      });

      if (session) {
        await this.expireSession(session.id);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Expire a session
   */
  static async expireSession(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "EXPIRED" },
    });
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    // Validate new password strength
    const validation = PasswordService.validateStrength(newPassword);
    if (!validation.isValid) {
      throw new Error(`Password validation failed: ${validation.errors.join(", ")}`);
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify old password
    const isValidOldPassword = await PasswordService.verify(oldPassword, user.passwordHash);
    if (!isValidOldPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const newPasswordHash = await PasswordService.hash(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Expire all existing sessions (force re-login)
    await prisma.session.updateMany({
      where: { userId, status: "ACTIVE" },
      data: { status: "REVOKED" },
    });

    return true;
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether user exists or not
      return "If an account with this email exists, a password reset link has been sent.";
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id, purpose: "password-reset" }, JWT_SECRET, { expiresIn: "1h" });

    // Set expiration time (1 hour from now)
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    // Save reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // TODO: Send email with reset token
    // For now, return the token (in production, this would be sent via email)
    return resetToken;
  }

  /**
   * Reset password using reset token
   */
  static async resetPassword(resetToken: string, newPassword: string): Promise<boolean> {
    try {
      // Verify reset token
      const payload = TokenService.verifyToken(resetToken);

      if (typeof payload === "object" && "purpose" in payload && payload.purpose !== "password-reset") {
        throw new Error("Invalid reset token");
      }

      // Find user with this reset token
      const user = await prisma.user.findFirst({
        where: {
          id: typeof payload === "object" && "userId" in payload ? (payload.userId as string) : "",
          resetPasswordToken: resetToken,
          resetPasswordExpires: { gt: new Date() },
        },
      });

      if (!user) {
        throw new Error("Invalid or expired reset token");
      }

      // Validate new password
      const validation = PasswordService.validateStrength(newPassword);
      if (!validation.isValid) {
        throw new Error(`Password validation failed: ${validation.errors.join(", ")}`);
      }

      // Hash new password
      const passwordHash = await PasswordService.hash(newPassword);

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      // Expire all sessions
      await prisma.session.updateMany({
        where: { userId: user.id, status: "ACTIVE" },
        data: { status: "REVOKED" },
      });

      return true;
    } catch {
      throw new Error("Password reset failed");
    }
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<number> {
    const result = await prisma.session.updateMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lt: new Date() },
      },
      data: { status: "EXPIRED" },
    });

    return result.count;
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string): Promise<AuthUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) return null;

      return this.formatUser(user);
    } catch {
      return null;
    }
  }

  /**
   * Create a new user
   */
  static async createUser(userData: { name: string; email: string; password: string }): Promise<AuthUser> {
    const { name, email, password } = userData;

    // Hash the password
    const passwordHash = await PasswordService.hash(password);

    // Split name into first and last name (simple approach)
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || null;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        isActive: true,
      },
    });

    return this.formatUser(user);
  }

  /**
   * Format user data for API responses (remove sensitive info)
   */
  private static formatUser(user: { id: string; email: string; firstName?: string | null; lastName?: string | null; avatar?: string | null; isActive: boolean }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isActive: user.isActive,
    };
  }
}

/**
 * Authorization helper functions
 */
export class AuthorizationService {
  static canAccessResource(user: AuthUser, resourceOwnerId?: string): boolean {
    // All authenticated users can access resources in a personal portfolio
    if (resourceOwnerId && user.id === resourceOwnerId) return true;

    // For a personal portfolio, authenticated user is the admin
    return true;
  }

  static isAuthenticated(user: AuthUser | null): boolean {
    return user?.isActive ?? false;
  }
}

/**
 * Rate limiting for auth endpoints
 */
import { RateLimiterMemory } from "rate-limiter-flexible";

export const authRateLimiter = new RateLimiterMemory({
  points: 5, // Number of attempts
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
});

export const loginRateLimiter = new RateLimiterMemory({
  points: 3, // Number of attempts
  duration: 300, // Per 5 minutes
  blockDuration: 600, // Block for 10 minutes
});
