import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { isObjectIdOrHexString } from 'mongoose';
import { locationErrors } from 'src/const/errors/location.errors';
import { userErrors } from 'src/const/errors/users.errors';
import { IsMongoObjectId } from 'src/validator/common/IsMongoObjectId';
import { FindBy, UserExistingCheck } from 'src/validator/users/userExistingCheck';

export class CreateLocationCoordsDto {
    @IsNotEmpty({
        message: locationErrors.horizontalShouldExists,
    })
    @ApiProperty({
        example: '98.321213213',
        description: 'User horizontal coordinat',
    })
    readonly horizontal: string;

    @IsNotEmpty({
        message: locationErrors.verticalShouldExists,
    })
    @ApiProperty({
        example: '128.321213213',
        description: 'User vertical coordinat',
    })
    readonly vertical: string;
}

export class CreateLocationDto {
    @IsNotEmpty({
        message: locationErrors.coordShouldExists,
    })
    @ApiProperty({
        example: { horizontal: '98.321213213', vertical: '128.321213213' },
        description: 'User location coordinates',
    })
    readonly coords: CreateLocationCoordsDto;

    @IsNotEmpty({
        message: userErrors.userIdIsRequired,
    })
    @IsMongoObjectId()
    @UserExistingCheck({ field: FindBy.USER_ID, shoulExists: true, error: userErrors.userDoesntExists })
    @ApiProperty({ example: '6426a9e2f1f40d7deb9321e', description: 'User id to connect location and user' })
    readonly user: string;
}
