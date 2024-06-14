import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as jwtC from './constants'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    UsersModule,
      ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AuthModule {}
