import { Request, Response } from 'express';
import { userService } from '../services/UserService.js';
import { UserRole } from '../models/User.js';

export class UserController {
  async createUser(req: Request, res: Response) {
    const { email, username, password, role } = req.body;
    const user = await userService.createUser(email, username, password, role);
    res.status(201).json({
      status: 201,
      message: 'User created successfully',
      data: user,
    });
  }

  async getUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json({
      status: 200,
      message: 'User retrieved successfully',
      data: user,
    });
  }

  async listUsers(req: Request, res: Response) {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);
    const result = await userService.listUsers(limit, offset);
    res.status(200).json({
      status: 200,
      message: 'Users retrieved successfully',
      data: result,
    });
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { role, status } = req.body;
    const user = await userService.updateUser(id, { role, status });
    res.status(200).json({
      status: 200,
      message: 'User updated successfully',
      data: user,
    });
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(200).json({
      status: 200,
      message: 'User deleted successfully',
    });
  }

  async getUserPermissions(req: Request, res: Response) {
    const { id } = req.params;
    const permissions = await userService.getUserPermissions(id);
    res.status(200).json({
      status: 200,
      message: 'User permissions retrieved successfully',
      data: permissions,
    });
  }

  async getAvailableRoles(req: Request, res: Response) {
    const roles = await userService.getAvailableRoles();
    res.status(200).json({
      status: 200,
      message: 'Available roles retrieved successfully',
      data: roles,
    });
  }
}

export const userController = new UserController();
