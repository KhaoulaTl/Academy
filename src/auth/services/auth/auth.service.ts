/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/services/admin/admin.service';
import { IAdmin } from 'src/admin/models/admin/admin.model';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';


@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateAdmin(email: string, password: string): Promise<IAdmin> {
    const admin = await this.adminService.findAdminByEmail(email);
    if (admin && await bcrypt.compare(password, admin.password)) {
      // Exclude password and return the rest of the user details
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = omit(admin, ['password']);
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // Login user and generate JWT token
  async login(admin : any) {
    omit(admin, ['password']);
    const payload = {
      email: admin.email,
      sub: admin._id,
      roles: admin.role,
    };
    return {
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      access_token: this.jwtService.sign(payload),
    };
  }

  // Register new user (Optional)
  async register(admin: IAdmin) {
    // Registration logic (Optional, already in UserService)
    return this.adminService.createAdmin(admin);
  }
}
