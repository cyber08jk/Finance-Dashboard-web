import { userRepository } from '../repositories/UserRepository.js';
import { hashPassword, comparePassword, generateToken, JWTPayload } from '../utils/auth.js';
import { ConflictError, AuthenticationError } from '../utils/errors.js';
import { UserRole, UserStatus } from '../models/User.js';

export class AuthService {
  async register(
    email: string,
    username: string,
    password: string,
    role: UserRole = UserRole.VIEWER
  ) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with provided role (defaults to viewer)
    const user = await userRepository.create(email, username, passwordHash, role);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AuthenticationError('Account is inactive. Contact an administrator');
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
      },
      token,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AuthenticationError('Account is inactive. Contact an administrator');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

export const authService = new AuthService();
