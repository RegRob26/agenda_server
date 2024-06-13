import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateContactDto {

	@IsNotEmpty()
	@IsNumber()
	user_id: number;

/*	@IsNotEmpty()
	@IsString()
	image_link: string;*/

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
	@IsObject({ each: true })
	phones: Record<string, any>[];

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@IsObject({ each: true })
	emails:  Record<string, any>[];
}
