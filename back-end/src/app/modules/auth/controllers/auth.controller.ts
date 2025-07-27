import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoginDTO, RegisterDTO } from '../models';
import { UserDTO } from '../../user';
import { AccessTokenDTO } from '../models/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AccessTokenDTO,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    type: LoginDTO,
  })
  @UseGuards(AuthGuard('local'))
  login(
    @Req()
    req: Request & {
      user: UserDTO;
    }
  ): Promise<AccessTokenDTO> {
    const user = req.user;
    const accessToken = this.authService.login(user);
    return accessToken;
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: AccessTokenDTO,
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiBody({
    type: RegisterDTO,
  })
  async register(@Body() registerDto: RegisterDTO): Promise<AccessTokenDTO> {
    const user = await this.authService.register(registerDto);
    const token = await this.authService.login(user);
    return token;
  }

  @Get('validate')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Validate user token' })
  async validate(@Req() req: Request & { user: UserDTO }): Promise<UserDTO> {
    return req.user;
  }
}
