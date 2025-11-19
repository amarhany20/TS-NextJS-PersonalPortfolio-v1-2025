import { UnauthorizedError } from '@/server/http/errors';
import { UserRepository } from '@/server/repositories/UserRepository';
import { verifyPassword } from '@/server/security/password';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
}

export const AuthService = {
  async authenticate(username: string, password: string): Promise<AuthenticatedUser> {
    const user = await UserRepository.findByUsername(username.trim().toLowerCase());

    if (!user || user.status !== 'active') {
      throw new UnauthorizedError('Invalid username or password');
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedError('Invalid username or password');
    }

    await UserRepository.recordLogin(user.id);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    };
  },
};
