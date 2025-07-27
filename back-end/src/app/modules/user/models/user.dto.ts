import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
export class UserDTO {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-42661417400',
  })
  id: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  username: string;
  constructor(instance: Prisma.UserGetPayload<true>) {
    this.id = instance.id;
    this.username = instance.username;
  }
}

export class UserWithPasswordDTO extends UserDTO {
  @ApiProperty({
    description: 'Password of the user',
    example: 'securepassword123',
  })
  password: string;

  constructor(instance: Prisma.UserGetPayload<true>) {
    super(instance);
    this.password = instance.password;
  }
}
