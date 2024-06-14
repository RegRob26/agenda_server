import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePhoneDto } from '../phones/dto/create-phone.dto';
import { UpdateEmailDto } from '../emails/dto/update-email.dto';
import { UpdatePhoneDto } from '../phones/dto/update-phone.dto';

//exclude phones from the CreateContactDto


class BaseUpdate extends PickType(CreateContactDto, ['user_id', 'first_name', 'last_name', 'middle_name',
				'second_last_name']) {}

export class UpdateContactDto extends PartialType(BaseUpdate) {
	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => UpdatePhoneDto)
	phones: UpdatePhoneDto[];

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => UpdateEmailDto)
	emails: UpdateEmailDto[];
}
