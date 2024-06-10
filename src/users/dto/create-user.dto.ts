import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class CreateUserDto {

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

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    phone: string;
}
