import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {MessagePattern} from "@nestjs/microservices";
import {AuthGuard} from "../guards/auth/auth.guard";
import {RolesGuard} from "../guards/roles/roles.guard";

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SetMetadata('roles', ['admin'])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @SetMetadata('roles', ['admin', 'user'])
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @SetMetadata('roles', ['admin', 'user'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @SetMetadata('roles', ['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @SetMetadata('roles', ['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @MessagePattern({cmd: 'user-check'})
  async validateUser(payload: { email: string, password: string }){
    return this.userService.verifyCredentials(payload.email, payload.password);
  }
}
