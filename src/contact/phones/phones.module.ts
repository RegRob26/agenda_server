import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';

@Module({
  controllers: [],
  providers: [PhonesService],
    exports: [PhonesService],
})
export class PhonesModule {}
