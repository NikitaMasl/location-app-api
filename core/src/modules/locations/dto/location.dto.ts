import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';
import { locationErrors } from 'src/const/errors/location.errors';
import { userErrors } from 'src/const/errors/users.errors';
import { IsMongoObjectId } from 'src/validator/common/IsMongoObjectId';
import { FindBy as FindLocationBy, LocationExistingCheck } from 'src/validator/locations/locationExistingCheck';
import { FindBy, UserExistingCheck } from 'src/validator/users/userExistingCheck';

export class CreateLocationDto {
    @IsNotEmpty({
        message: locationErrors.latitudeShouldExists,
    })
    @ApiProperty({
        example: '98.321213213',
        description: 'User latitude coordinat',
    })
    readonly latitude: string;

    @IsNotEmpty({
        message: locationErrors.longitudeShouldExists,
    })
    @ApiProperty({
        example: '128.321213213',
        description: 'User longitude coordinat',
    })
    readonly longitude: string;

    @IsNotEmpty()
    @ApiProperty({
        example: '128.321213213',
        description: 'Location dateTime',
    })
    readonly dateTime: String;

    @IsNotEmpty({
        message: userErrors.userIdIsRequired,
    })
    @IsMongoObjectId()
    @UserExistingCheck({ field: FindBy.USER_ID, shoulExists: true, error: userErrors.userDoesntExists })
    @ApiProperty({ example: '6426a9e2f1f40d7deb9321e', description: 'User id to connect location and user' })
    readonly user: string;
}

export class RemoveLocationById {
    @IsNotEmpty()
    @IsMongoObjectId()
    @LocationExistingCheck({
        field: FindLocationBy.LOCATION_ID,
        shoulExists: true,
        error: locationErrors.locationShouldExists,
    })
    @ApiProperty({ example: '6426a9e2f1f40d7deb9321e', description: 'Location id' })
    readonly id: string;
}
