import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.js';
import { User, UserRole, UserStatus } from '../models/User.js';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(email: string, username: string, passwordHash: string, role: UserRole = UserRole.VIEWER): Promise<User> {
    const user = this.repository.create({
      email,
      username,
      password_hash: passwordHash,
      role,
      status: UserStatus.ACTIVE,
    });
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.repository.findAndCount({
      where: { status: UserStatus.ACTIVE },
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });
    return { users, total };
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.update(id, {
      status: UserStatus.INACTIVE,
      updated_at: new Date(),
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
