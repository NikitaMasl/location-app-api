import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument, Document } from 'mongoose';
import { LOCATION_TO_DTO, Location } from '../../locations/schema/location.schema';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

export enum USER_TO_DTO {
    WITHOUT_LOCATION = 'withoutLocation',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User extends Document {
    @ApiProperty({ example: 'Username', description: 'Unique username' })
    @Prop({ required: true, unique: true })
    userName: string;

    @ApiProperty({ example: '92.23213', description: 'User current latitude' })
    @Prop()
    latitude: string;

    @ApiProperty({ example: '123.21332', description: 'User current longitude' })
    @Prop()
    longitude: string;

    @ApiProperty({ example: ['6426a9e2f1f40d7deb9321e'], description: 'Locations objects array(list)' })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Location' }] })
    locations: Location[];

    toDto: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toDto = function (toDto?: USER_TO_DTO): Record<string, unknown> {
    if (toDto === USER_TO_DTO.WITHOUT_LOCATION) {
        return {
            id: this._id,
            userName: this.userName,
            latitude: this.latitude,
            longitude: this.longitude,
            updated_at: this.updated_at,
            created_at: this.created_at,
        };
    }

    return {
        id: this._id,
        userName: this.userName,
        latitude: this.latitude,
        longitude: this.longitude,
        updated_at: this.updated_at,
        created_at: this.created_at,
        locations: this.locations.map((l: any) => l.toDto(LOCATION_TO_DTO.WITHOUT_USER)),
    };
};
