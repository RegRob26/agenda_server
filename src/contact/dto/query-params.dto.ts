import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryParamsDto{
	@IsOptional()
	@Type(() => Number)
	user_id: number;
}