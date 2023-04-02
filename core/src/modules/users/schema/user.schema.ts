import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument, Document } from 'mongoose';
import { Location } from '../../locations/schema/location.schema';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class CurrentLocation extends Document {
    @Prop({ required: true })
    horizontal: string;

    @Prop()
    vertical: string;
}

export const CurrentLocationSchema = SchemaFactory.createForClass(CurrentLocation);

@Schema()
export class User extends Document {
    @ApiProperty({ example: 'Username', description: 'Unique username' })
    @Prop({ required: true, unique: true })
    userName: string;

    @ApiProperty({ example: { horizontal: '92.23213', vertical: '123.21332' }, description: 'User current location' })
    @Prop({ type: CurrentLocation })
    currentLocation: CurrentLocation;

    @ApiProperty({ example: ['6426a9e2f1f40d7deb9321e'], description: 'Locations objects array(list)' })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Location' }] })
    locations: Location[];
}

export const UserSchema = SchemaFactory.createForClass(User);
