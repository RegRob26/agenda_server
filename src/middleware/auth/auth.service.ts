import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
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
        console.log('user', user);

        const payload = { sub: user.user_id, email: createAuthDto.email };
        console.log(payload);
        const access_token = await this.jwtService.signAsync(payload);
        return {
          ...user,
          access_token: access_token,
        };
      }
      return user;
    }
    catch (error) {
      console.log('error');
      return error;
    }
  }
}
