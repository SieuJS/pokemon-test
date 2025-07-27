import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserDTO, UserService } from '../../user';
import { AccessTokenDTO, LoginDTO, RegisterDTO } from '../models';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(userLogin: LoginDTO): Promise<UserDTO> {
    const user = await this.userService.getUserByUsername(userLogin.username);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await this.comparePasswords(
      userLogin.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashed);
  }

  async login(user: UserDTO): Promise<AccessTokenDTO> {
    const jwt = this.jwtService.sign({ id: user.id, username: user.username });
    return { accessToken: jwt };
  }

  async validateToken(token: string): Promise<UserDTO | null> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.getUserByUsername(decoded.username);
      return user;
    } catch (error) {
      return null; // Token is invalid or expired
    }
  }

  async register (user: RegisterDTO): Promise<UserDTO> {
    const existingUser = await this.userService.getUserByUsername(user.username);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    user.password = await this.hashPassword(user.password);
    return this.userService.create(user);
  }
}
