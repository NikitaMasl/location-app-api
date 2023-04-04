import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument, Document } from 'mongoose';
import { USER_TO_DTO, User } from '../../users/schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export type LocationDocument = HydratedDocument<Location>;

export enum LOCATION_TO_DTO {
    WITHOUT_USER = 'withoutUser',
}

@Schema()
export class Location extends Document {
    @ApiProperty({ example: '92.23213', description: 'Location latitude' })
    @Prop()
    latitude: string;

    @ApiProperty({ example: '123.21332', description: 'Location longitude' })
    @Prop()
    longitude: string;

    @ApiProperty({ example: new Date(), description: 'User current longitude' })
    @Prop({ type: Date, required: true })
    dateTime: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: User;

    toDto: Function;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.methods.toDto = function (toDto?: LOCATION_TO_DTO): Record<string, unknown> {
    if (toDto === LOCATION_TO_DTO.WITHOUT_USER) {
        return {
            id: this._id,
            latitude: this.latitude,
            longitude: this.longitude,
            dateTime: this.dateTime,
        };
    }

    return {
        id: this._id,
        latitude: this.latitude,
        longitude: this.longitude,
        dateTime: this.dateTime,
        user: this.user.toDto(USER_TO_DTO.WITHOUT_LOCATION),
    };
};
