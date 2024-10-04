/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, UnauthorizedException,  } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IAdmin } from "src/admin/models/admin/admin.model";
import { Admin, AdminDocument } from "src/admin/schemas/admin/admin.schema";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

  async createAdmin(admin: IAdmin): Promise<Admin> {
    const existingAdmin = await this.findAdminByEmail(admin.email);
    if (existingAdmin) {
      throw new BadRequestException('Email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const newAdmin = new this.adminModel({ ...admin, password: hashedPassword });
    return await newAdmin.save();
  }

  async findAdminByEmail(email: string): Promise<Admin> {
    return await this.adminModel.findOne({ email });
  }

  async findAdminById(id: string): Promise<Admin> {
    if (!id) {
      throw new BadRequestException('Admin ID is required.');
    }
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Admin ID format.');
    }
    return await this.adminModel.findById(id);
  }
  

  async updateAdmin(id: string, admin: Partial<IAdmin>, password: string): Promise<Admin> {
    const existingAdmin = await this.findAdminById(id);
    if (!existingAdmin) {
        throw new BadRequestException('Utilisateur non trouvé.');
    }

    // Vérifier si le mot de passe actuel est fourni et correct
    if (!password) {
        throw new UnauthorizedException('Le mot de passe actuel est requis pour modifier les informations.');
    }

    const passwordIsCorrect = await bcrypt.compare(password, existingAdmin.password);
    if (!passwordIsCorrect) {
        throw new UnauthorizedException('Le mot de passe actuel est incorrect.');
    }

    // Hacher le nouveau mot de passe si fourni
    if (admin.newPassword) {
      admin.password = await bcrypt.hash(admin.newPassword, 10);
        delete admin.newPassword;
    } else {
        // Conserver le mot de passe actuel s'il n'est pas modifié
        admin.password = existingAdmin.password;
    }

    // Mettre à jour l'utilisateur
    return await this.adminModel.findByIdAndUpdate(id, admin, { new: true });
}



  async deleteAdmin(id: string): Promise<void> {
    await this.adminModel.findByIdAndDelete(id);
  }

 
}
