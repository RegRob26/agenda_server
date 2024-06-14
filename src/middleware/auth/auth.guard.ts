import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.decorator';
import * as process from 'node:process';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService,
				private reflector: Reflector
	) {}

	async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
		console.log('AuthGuard: canActivate', process.env.JWT_SECRET);
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(token,
				{
					secret: process.env.JWT_SECRET
				}
			);
			console.log('Payload: ', payload);
			request.user = payload;
		} catch {
			throw new UnauthorizedException();
		}
		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		try {
			const [type, token] = request.headers['authorization'].split(' ') ?? [];
			return type === 'Bearer' ? token : undefined;
		} catch (e) {
			return undefined
		}
	}

}