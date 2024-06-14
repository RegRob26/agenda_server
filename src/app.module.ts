import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import {User} from "./users/entities/user.entity";
import { AuthModule } from './middleware/auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/entities/contact.entity';
import { Phone } from './contact/phones/entities/phone.entity';
import { Email } from './contact/emails/entities/email.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DATABASE_TYPE') === 'mysql' ? 'mysql' : 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PWD'),
        database: configService.get<string>('DATABASE_DATABASE'),
        entities: [User, Contact, Phone, Email],
        synchronize: true,
        logging: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
