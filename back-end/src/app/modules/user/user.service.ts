import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    // TODO: Implement logic
    return [];
  }

  async findOne(id: string) {
    // TODO: Implement logic
    return null;
  }

  async create(userData: any) {
    // TODO: Implement logic
    return null;
  }

  async update(id: string, userData: any) {
    // TODO: Implement logic
    return null;
  }

  async remove(id: string) {
    // TODO: Implement logic
    return null;
  }
}
