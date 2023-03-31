import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { userErrors } from 'src/const/errors/users.errors';
import { FindBy, UserExistingCheck } from 'src/validator/users/userExistingCheck';

export class CreateUserDto {
    @IsNotEmpty({
        message: userErrors.userNameIsReuired,
    })
    @UserExistingCheck({ field: FindBy.USER_NAME, shoulExists: false, error: userErrors.userShouldNotExists })
    @ApiProperty({ example: 'Username', description: 'Unique username' })
    readonly userName: string;
}

export class FindByUserNameDto {
    readonly userName: string;
}
