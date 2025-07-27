import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserWithPasswordDTO } from './models';
import { RegisterDTO } from '../auth/models';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByUsername(
    username: string
  ): Promise<UserWithPasswordDTO | null> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      return null;
    }
    return new UserWithPasswordDTO(user);
  }
  async create(userData: RegisterDTO): Promise<UserWithPasswordDTO> {
    const user = await this.prismaService.user.create({
      data: userData,
    });
    return new UserWithPasswordDTO(user);
  }
}
