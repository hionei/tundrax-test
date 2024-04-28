import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import UserEntity from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { ConfigModule } from '../config/config.module';
import { AdminAccessTokenStrategy } from './strategies/admin-access-token.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({}), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, AdminAccessTokenStrategy],
})
export class AuthModule {}
