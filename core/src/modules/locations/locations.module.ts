import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from './schema/location.schema';
import { UserExistingCheckRule } from 'src/validator/users/userExistingCheck';
import { User, UserSchema } from 'src/modules/users/schema/user.schema';
import { UsersService } from 'src/modules/users/users.service';
import { ValidMongoIdCheckRule } from 'src/validator/common/IsMongoObjectId';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [LocationsController],
    providers: [LocationsService, UsersService, UserExistingCheckRule, ValidMongoIdCheckRule],
})
export class LocationsModule {}
