import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLocationDto, RemoveLocationById } from 'src/modules/locations/dto/location.dto';
import { LOCATION_TO_DTO, Location } from './schema/location.schema';
import { User } from 'src/modules/users/schema/user.schema';

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
        createdLocation.save();

        return createdLocation.toDto(LOCATION_TO_DTO.WITHOUT_USER);
    }

    async getAllLocations(): Promise<Location[]> {
        const locations = await this.locationModel.find({});

        return Promise.all(locations.map(async (location) => (await location.populate('user')).toDto()));
    }

    async getOneByField({ value, field }: { value: string; field: string }): Promise<Location | null> {
        const location = await this.locationModel.findOne({ [field]: value }).exec();

        return location.toDto(LOCATION_TO_DTO.WITHOUT_USER);
    }

    async removeLocation({ id }: RemoveLocationById): Promise<void> {
        await this.locationModel.deleteOne({ _id: id });
    }
}
