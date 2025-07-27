import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDTO {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
  accessToken: string;
}
