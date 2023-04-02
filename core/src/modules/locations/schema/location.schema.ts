import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument, Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location extends Document {
    @Prop(
        raw({
            horizontal: { type: String },
            vertical: { type: String },
        }),
    )
    coords: Record<string, unknown>;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
