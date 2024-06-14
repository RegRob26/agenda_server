import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneDto } from './create-phone.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdatePhoneDto extends PartialType(CreatePhoneDto) {
	@IsNumber()
	@IsNotEmpty()
	phone_id: number;

	@IsBoolean()
	is_primary: boolean;

}
