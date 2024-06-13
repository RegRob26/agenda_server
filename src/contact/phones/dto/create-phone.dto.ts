import { IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { ConstantsLabels } from '../entities/phone.entity';

export class CreatePhoneDto {
	@IsString()
	@IsNotEmpty()
	phone_number: string;

	@IsEnum(ConstantsLabels)
	phone_type: string;

	@IsNumber()
	@IsNotEmpty()
	contact_id: number;
}
