import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { SigninUserDto } from '../../users/dto/signin-user.dto';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signin')
  @Public()
  signIn(@Body() signInDto: SigninUserDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signup')
  @Public()
  signUp(@Body() createUserDto: CreateUserDto){
    return this.authService.signUp(createUserDto);
  }
}
