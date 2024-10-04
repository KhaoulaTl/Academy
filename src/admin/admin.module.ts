import { Module } from '@nestjs/common';
import { AdminService } from './services/admin/admin.service';
import { AdminController } from './controllers/admin/admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin/admin.schema';

@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
