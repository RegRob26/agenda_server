import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailDto } from './create-email.dto';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEmailDto extends PartialType(CreateEmailDto) {
	@IsNumber()
	@IsNotEmpty()
	email_id: number;

	@IsBoolean()
	is_primary: boolean;
}
