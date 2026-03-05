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
  Req,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import {
  UserDeleteResponseDto,
  PasswordChangeResponseDto,
  ProfileUpdateResponseDto,
} from './dto/common-responses.dto';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';
import { RolesGuard } from 'src/strategy/role/role.guard';
import { Roles } from 'src/strategy/role/role.decorators';
import { userRole } from 'src/shared/interfaces/user.interface';
import { Request } from 'express';

interface JwtUser {
  sub: string;
  id: string; // Add id as backup
  email: string;
  roles?: userRole[];
  iat?: number;
  exp?: number;
}

interface AuthenticatedRequest extends Request {
  user: JwtUser;
}

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or email already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions (requires SUPER_ADMIN or ADMIN role)',
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const ownerId = req.user?.sub;

    if (!ownerId) {
      throw new BadRequestException('User ID not found in token');
    }

    return this.userService.createStaff(createUserDto, ownerId);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions (requires SUPER_ADMIN or ADMIN role)',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getProfile(@Req() req: AuthenticatedRequest): Promise<UserResponseDto> {
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    return this.userService.getProfile(userId);
  }

  @Patch('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileUpdateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProfileUpdateResponseDto> {
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException(
        'User ID not found in token. Please re-authenticate.',
      );
    }

    const updatedUser = await this.userService.update(userId, updateProfileDto);
    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: PasswordChangeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid current password or password validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PasswordChangeResponseDto> {
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    await this.userService.changePassword(userId, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (Admin/Manager only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions (requires SUPER_ADMIN, ADMIN, or MANAGER role)',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions (requires SUPER_ADMIN or ADMIN role)',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserDeleteResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions (requires SUPER_ADMIN or ADMIN role)',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserDeleteResponseDto> {
    return this.userService.softDelete(id);
  }
}
