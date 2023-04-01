import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { userErrors } from 'src/const/errors/users.errors';
import { USER_PROPS } from 'src/const/users/USER_PROPS';
import { FindBy, UserExistingCheck } from 'src/validator/users/userExistingCheck';

export class CreateUserDto {
    @IsNotEmpty({
        message: userErrors.userNameIsReuired,
    })
    @MinLength(USER_PROPS.MIN_USER_NAME_LENGTH)
    @MaxLength(USER_PROPS.MAX_USER_NAME_LENGTH)
    @UserExistingCheck({ field: FindBy.USER_NAME, shoulExists: false, error: userErrors.userShouldNotExists })
    @ApiProperty({
        example: 'Username',
        description: `Unique username, min - ${USER_PROPS.MIN_USER_NAME_LENGTH}, max ${USER_PROPS.MAX_USER_NAME_LENGTH}`,
    })
    readonly userName: string;
}

export class FindOneParamsDto {
    @IsNotEmpty({
        message: userErrors.userNameIsReuired,
    })
    @ApiProperty({ example: 'Username', description: 'Unique username' })
    userName: string;
}

export class FindByUserNameDto {
    readonly userName: string;
}
