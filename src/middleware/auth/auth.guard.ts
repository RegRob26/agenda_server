import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService,
				private reflector: Reflector
	) {}

	async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
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
					secret: jwtConstants.JWT_SECRET
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