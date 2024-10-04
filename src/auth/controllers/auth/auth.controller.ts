/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { IAdmin } from 'src/admin/models/admin/admin.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login route
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() admin: { email: string; password: string }) {
    try {
      const validatedAdmin = await this.authService.validateAdmin(admin.email, admin.password);
      return this.authService.login(validatedAdmin);
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  // Register route (Optional)
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() admin: IAdmin) {
    try {
      return await this.authService.register(admin);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
