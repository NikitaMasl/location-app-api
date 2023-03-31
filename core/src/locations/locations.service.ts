import { Get, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { CreateLocationDto } from 'src/locations/dto/location.dto';
import { Location } from 'src/schemas/location.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class LocationsService {
    constructor(
        @InjectModel(Location.name) private locationModel: Model<Location>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        const createdLocation = new this.locationModel(createLocationDto);

        const { user } = createLocationDto;

        await this.userModel.updateOne(
            {
                _id: user,
            },
            {
                $push: {
                    locations: createdLocation._id,
                },
            },
        );

        return createdLocation.save();
    }

    async getAllLocations(): Promise<Location[]> {
        const locations = await this.locationModel.find({});

        return Promise.all(locations.map(async (location) => location.populate('user')));
    }
}
