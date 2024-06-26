import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from '../../users/dto/signin-user.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signUp(createAuthDto: CreateUserDto) {
    return await this.usersService.create(createAuthDto);
  }

  async signIn(createAuthDto: SigninUserDto) {
    const user = await this.usersService.signIn(createAuthDto);
    try {
      if (user.user_id) {
        const payload = { sub: user.user_id, email: createAuthDto.email };
        const access_token = await this.jwtService.signAsync(payload);
        return {
          ...user,
          access_token: access_token,
        };
      }
      return user;
    }
    catch (error) {
      return error;
    }
  }
}
