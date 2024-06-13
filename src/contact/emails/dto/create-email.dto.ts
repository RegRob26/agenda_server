import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ConstantsLabels } from '../../phones/entities/phone.entity';

export class CreateEmailDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsEnum(ConstantsLabels)
	email_type: string;

	@IsNumber()
	@IsNotEmpty()
	contact_id: number;
}
