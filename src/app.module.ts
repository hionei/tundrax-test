import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [DatabaseModule, CoreModule, CatsModule, AuthModule, UsersModule],
})
export class AppModule {}
