import { ApiProperty, OmitType} from "@nestjs/swagger";
import { UserDTO } from "../../user";

export class RegisterDTO extends OmitType(UserDTO, ['id']) {
    @ApiProperty({
        description: 'Password of the user',
        example: 'securepassword123',
    })
    password: string;
}
