import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri:
                    configService.get<string>('NODE_ENV') === 'test'
                        ? configService.get<string>('MONGO_TEST_URL')
                        : configService.get<string>('MONGO_URL'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
