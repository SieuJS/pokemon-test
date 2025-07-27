import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserService } from './user.service';

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

interface UpdateUserDto {
  username?: string;
  email?: string;
}

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  getAllUsers() {
    // TODO: Implement logic
    return [];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('id') id: string) {
    // TODO: Implement logic
    return null;
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'securePassword123' },
      },
      required: ['username', 'email', 'password'],
    },
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    // TODO: Implement logic
    return null;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // TODO: Implement logic
    return null;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id') id: string) {
    // TODO: Implement logic
    return { message: 'User deleted successfully' };
  }
}
