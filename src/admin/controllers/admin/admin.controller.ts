/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
//import { Roles } from 'src/auth/config/decorator/roles.decorator';
//import { Role } from 'src/auth/config/enum/role.enum';
//import { JwtAuthGuard } from 'src/auth/config/guard/jwt-auth.guard';
//import { RolesGuard } from 'src/auth/config/guard/roles.guard';
import { IAdmin } from 'src/admin/models/admin/admin.model';
import { AdminService } from 'src/admin/services/admin/admin.service';
  
  @Controller('user')
  export class AdminController {
    constructor(private readonly adminService: AdminService) {}
  
    // Create a new user
    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(Role.Admin)
    @Post('create')
    async createAdmin(@Body() admin: IAdmin) {
      try {
        return await this.adminService.createAdmin(admin);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  
    // Find user by email
    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(Role.Admin)
    @Get('findByEmail/:email')
    async findAdminByEmail(@Param('email') email: string) {
      const admin = await this.adminService.findAdminByEmail(email);
      if (!admin) {
        throw new NotFoundException('User not found.');
      }
      return admin;
    }
  
    // Find user by ID
    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(Role.Admin)
    @Get('findById/:id')
    async findAdminById(@Param('id') id: string) {
        if (!id) {
            throw new BadRequestException('Admin ID is required.');
        }
        const admin = await this.adminService.findAdminById(id);
        if (!admin) {
            throw new NotFoundException('Admin not found.');
        }
        return admin;
    }

  
    // Update user
    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(Role.Admin)
    @Put('update/:id')
    async updateAdmin(
        @Param('id') id: string,
        @Body() admin: Partial<IAdmin>,
        @Body('password') password: string
    ) {
    try {
        const updatedAdmin = await this.adminService.updateAdmin(id, admin, password);
        if (!updatedAdmin) {
            throw new NotFoundException('Utilisateur non trouvé.');
        }
        return updatedAdmin;
    } catch (error) {
        if (error instanceof UnauthorizedException) {
            throw new UnauthorizedException(error.message);
        }
        throw new BadRequestException(error.message);
    }
}

  
    // Delete user
    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(Role.Admin)
    @Delete('delete/:id')
    async deleteAdmin(@Param('id') id: string) {
      try {
        await this.adminService.deleteAdmin(id);
        return { message: 'Admin deleted successfully' };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  
    
  }
  