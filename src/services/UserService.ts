import { userRepository } from '../repositories/UserRepository.js';
import { hashPassword } from '../utils/auth.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';
import { UserRole, UserStatus } from '../models/User.js';
import { rolePermissions } from '../config/permissions.js';

export class UserService {
  async createUser(email: string, username: string, password: string, role: UserRole) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await userRepository.create(email, username, passwordHash, role);

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

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
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

  async listUsers(limit: number = 20, offset: number = 0) {
    const { users, total } = await userRepository.findAll(limit, offset);

    return {
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      })),
      pagination: {
        limit,
        offset,
        total,
        has_more: offset + limit < total,
      },
    };
  }

  async updateUser(id: string, updates: { role?: UserRole; status?: UserStatus }) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    const updated = await userRepository.update(id, updates);
    if (!updated) {
      throw new NotFoundError('User');
    }

    return {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      role: updated.role,
      status: updated.status,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };
  }

  async deleteUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    await userRepository.softDelete(id);
  }

  async getUserPermissions(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    return {
      user_id: user.id,
      role: user.role,
      permissions: rolePermissions[user.role],
    };
  }

  async getAvailableRoles() {
    return [
      {
        name: 'viewer',
        description: 'Can only view dashboard data and records',
        permissions: rolePermissions[UserRole.VIEWER],
      },
      {
        name: 'analyst',
        description: 'Can view records, create and update records, and access insights',
        permissions: rolePermissions[UserRole.ANALYST],
      },
      {
        name: 'admin',
        description: 'Full management access including users, records, and system configuration',
        permissions: rolePermissions[UserRole.ADMIN],
      },
    ];
  }
}

export const userService = new UserService();
