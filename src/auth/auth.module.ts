import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { RolesGuard } from './config/guard/roles.guard';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './config/constants/constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './config/strategy/local.strategy';
import { JwtStrategy } from './config/strategy/jwt.strategy';

@Module({
  imports: [
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, RolesGuard],
})
export class AuthModule {}
