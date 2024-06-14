import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreatePhoneDto } from '../phones/dto/create-phone.dto';
import { CreateEmailDto } from '../emails/dto/create-email.dto';

export class CreateContactDto {

	@IsNotEmpty()
	@IsNumber()
	@Transform((value) => parseInt(value.value))
	user_id: number;

	@IsNotEmpty()
	@IsString()
	first_name: string;

	@IsOptional()
	@IsString()
	middle_name: string;

	@IsNotEmpty()
	@IsString()
	last_name: string;

	@IsOptional()
	@IsString()
	second_last_name: string;

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreatePhoneDto)
	phones: CreatePhoneDto[];

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreateEmailDto)
	emails:  CreateEmailDto[];
}
