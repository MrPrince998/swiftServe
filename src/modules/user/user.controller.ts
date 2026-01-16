import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';
import { RolesGuard } from 'src/strategy/role/role.guard';
import { Roles } from 'src/strategy/role/role.decorators';
import { userRole } from 'src/interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Delete(':id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.softDelete(id);
  }
}
