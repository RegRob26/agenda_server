import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SigninUserDto } from './dto/signin-user.dto';


@Injectable()
export class UsersService {

  constructor(    
    @InjectRepository(User) 
    private usersRepository: Repository<User> ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.usersRepository.findOne({where: {email: createUserDto.email}})
      if (userExists) {
        throw new ConflictException('El usuario ya existe')
      }

      createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
      const user = await this.usersRepository.create(createUserDto)
      await this.usersRepository.insert(user)
      return { message: 'Usuario creado con éxito', user_id: user.user_id, statusCode: 201}
    }
    catch (error) {
     throw error
    }
  }

  async signIn(signInUserDto: SigninUserDto) {
    try {
      const userFind = await this.usersRepository.findOne( {where: {email: signInUserDto.email}})
      if (!userFind?.email) {
        throw new NotFoundException('Usuario no encontrado')
      }
      const passwordMatch = await bcrypt.compare(signInUserDto.password, userFind.password)
      if (!passwordMatch) {
        throw new BadRequestException('Usuario o contraseña incorrectos')
      }
      //Add token here
      return { message: 'Usuario logueado con éxito', user_id: userFind.user_id, statusCode: 200}
    } catch (e) {
      throw e
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const query = await this.usersRepository.createQueryBuilder('user');
    query.where('user.user_id = :user_id', {user_id: id})
    query.select(['user.user_id', 'user.email', 'user.first_name', 'user.middle_name', 'user.last_name',
            'user.second_last_name', 'user.phone'])
    const user = await query.getOne()
    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }
    return {user, message: 'Usuario encontrado con éxito', statusCode: 200}
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
        await this.usersRepository.update(id, updateUserDto)
        return { message: 'Usuario actualizado con éxito', statusCode: 200}
    } catch (e) {
      throw e
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
