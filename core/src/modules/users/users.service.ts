import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangeUserLocationDto, CreateUserDto, FindByUserNameDto, UserWithoutLocations } from './dto/user.dto';
import { USER_TO_DTO, User } from './schema/user.schema';
import { Location } from '../locations/schema/location.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Location.name) private locationModel: Model<Location>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = await this.userModel.create(createUserDto);

        return createdUser?.toDto();
    }

    async getAll(): Promise<User[]> {
        const users = await this.userModel.find({});

        return Promise.all(users.map(async (u) => (await u.populate('locations')).toDto(USER_TO_DTO.WITHOUT_LOCATION)));
    }

    async findbyUserName({ userName }: FindByUserNameDto): Promise<User> {
        const user = await this.userModel.findOne({ userName }).exec();

        return (await user?.populate('locations')).toDto();
    }

    async getOneByField({ value, field }: { value: string; field: string }): Promise<User | null> {
        const user = await this.userModel.findOne({ [field]: value }).exec();

        return user?.toDto(USER_TO_DTO.WITHOUT_LOCATION);
    }

    async changeUserPosition({
        userName,
        latitude,
        longitude,
    }: ChangeUserLocationDto & FindByUserNameDto): Promise<User | null> {
        let updateObj: Record<string, string> = {};

        if (latitude) {
            updateObj['latitude'] = latitude;
        }

        if (longitude) {
            updateObj['longitude'] = longitude;
        }

        const user = await this.userModel.findOneAndUpdate(
            {
                userName,
            },
            updateObj,
            { new: true },
        );

        return user?.toDto(USER_TO_DTO.WITHOUT_LOCATION);
    }

    async deleteUser({ userName }: FindByUserNameDto): Promise<void> {
        const user = await this.userModel.findOne({ userName });

        if (!user) {
            return;
        }

        await this.locationModel.deleteMany({
            _id: { $in: user.locations || [] },
        });

        await this.userModel.deleteOne({
            userName,
        });
    }
}
