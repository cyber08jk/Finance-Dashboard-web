import { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, username, password, role } = req.body;
    const result = await authService.register(email, username, password, role);
    res.status(201).json({
      status: 201,
      message: 'User registered successfully',
      data: result,
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      status: 200,
      message: 'Login successful',
      data: result,
    });
  }

  async getProfile(req: Request, res: Response) {
    const userId = req.user!.userId;
    const user = await authService.getCurrentUser(userId);
    res.status(200).json({
      status: 200,
      message: 'Profile retrieved successfully',
      data: user,
    });
  }
}

export const authController = new AuthController();
