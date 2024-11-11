import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(
      private readonly prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const checkUser = await this.getSingleUser(createUserDto.email);
    if (checkUser) throw new HttpException(`User with email ${createUserDto.email} already exist`, HttpStatus.BAD_REQUEST);

    const createdUser = await this.prisma.users.create({data: createUserDto})
    return {message: 'User created successfully', data: createdUser};
  }

  async findAll() {
    return this.prisma.users.findMany({include: {role: true}});
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({where: {user_id: id}, include: {role: true}});
    if (!user) throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);

    const checkUser = await this.getSingleUser(updateUserDto.email);
    if (checkUser) delete updateUserDto.email;

    const updatedUser = await this.prisma.users.update({where: {user_id: id}, data: updateUserDto});
    return {message: 'User updated successfully', data: updatedUser};
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);

    await this.prisma.users.delete({where: {user_id: id}});
    return {message: `User with id ${id} deleted successfully`};
  }

  verifyCredentials(email: string, password: string) {
    return this.prisma.users.findFirst({where: {email: email, password: password}, include: {role: true}});
  }

  private async getSingleUser(email: string) {
    return this.prisma.users.findFirst({
      where: {email: email},
      include: {role: true}
    });
  }
}
