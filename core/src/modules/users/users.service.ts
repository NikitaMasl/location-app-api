import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangeUserLocationDto, CreateUserDto, FindByUserNameDto } from './dto/user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = await this.userModel.create(createUserDto);

        return createdUser;
    }

    async getAll(): Promise<User[]> {
        const users = await this.userModel.find({});

        return Promise.all(users.map(async (u) => u.populate('locations')));
    }

    async findbyUserName({ userName }: FindByUserNameDto): Promise<User> {
        const user = await this.userModel.findOne({ userName }).exec();

        return user?.populate({
            path: 'locations',
        });
    }

    async getOneByField({ value, field }: { value: string; field: string }): Promise<User | null> {
        return this.userModel.findOne({ [field]: value }).exec();
    }

    async changeUserPosition({
        userName,
        horizontal,
        vertical,
    }: ChangeUserLocationDto & FindByUserNameDto): Promise<User | null> {
        let updateObj: Record<string, string> = {};

        if (horizontal) {
            updateObj['currentLocation.horizontal'] = horizontal;
        }

        if (vertical) {
            updateObj['currentLocation.vertical'] = vertical;
        }

        const user = await this.userModel.findOneAndUpdate(
            {
                userName,
            },
            updateObj,
            { new: true },
        );

        return user;
    }
}
