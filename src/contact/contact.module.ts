import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { EmailsModule } from './emails/emails.module';
import { PhonesModule } from './phones/phones.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), PhonesModule, EmailsModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
