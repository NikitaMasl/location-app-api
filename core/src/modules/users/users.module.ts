import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserExistingCheckRule } from 'src/validator/users/userExistingCheck';
import { Location, LocationSchema } from '../locations/schema/location.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Location.name, schema: LocationSchema },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService, UserExistingCheckRule],
    exports: [UsersService],
})
export class UsersModule {}
