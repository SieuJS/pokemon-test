import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDTO } from '../../user';

export class LoginDTO extends PickType(UserDTO, ['username']){
    @ApiProperty({
        description: 'Password of the user',
        example: 'securepassword123',
    })
    password: string;
}
