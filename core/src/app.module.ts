import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';

@Module({
    imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URL), UsersModule, LocationsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
