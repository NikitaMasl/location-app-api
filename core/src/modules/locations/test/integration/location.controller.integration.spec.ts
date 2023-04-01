import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { userErrors } from 'src/const/errors/users.errors';
import { USER_PROPS } from 'src/const/users/USER_PROPS';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

describe('LocationController', () => {
    let dbConnection: Connection;
    let httpServer: any;
    let app: any;
    let fakeUserId: string = '';

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        useContainer(app.select(AppModule), { fallbackOnErrors: true });

        await app.init();

        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();

        const fakeUser = await dbConnection.collection('users').insertOne({
            userName: 'location-test-user',
        });

        fakeUserId = fakeUser.insertedId.toString();

        httpServer = app.getHttpServer();
    });

    describe('create', () => {
        it('Endpoint should create new location', async () => {
            const TEST_LOCATION = {
                coords: { horizontal: '98.321213213', vertical: '128.321213213' },
                user: fakeUserId,
            };

            const response = await request(httpServer).post('/locations').send(TEST_LOCATION);

            expect(response.status).toBe(201);
            expect(JSON.stringify(response.body.coords)).toEqual(JSON.stringify(TEST_LOCATION.coords));
        });

        it('Endpoint should return error, if no coords provided', async () => {
            const TEST_LOCATION = {
                user: fakeUserId,
            };

            const response = await request(httpServer).post('/locations').send(TEST_LOCATION);

            expect(response.status).toBe(400);
        });

        it('Endpoint should return error, if no user provided', async () => {
            const TEST_LOCATION = {
                coords: { horizontal: '98.321213213', vertical: '128.321213213' },
            };

            const response = await request(httpServer).post('/locations').send(TEST_LOCATION);

            expect(response.status).toBe(400);
        });

        it('Endpoint should return error, if not existing user provided', async () => {
            const TEST_LOCATION = {
                coords: { horizontal: '98.321213213', vertical: '128.321213213' },
                user: '6426a9e2f1f40d7deb95ad1f',
            };

            const response = await request(httpServer).post('/locations').send(TEST_LOCATION);

            expect(response.status).toBe(400);
        });

        it('Endpoint should return error, if wrong user id provided', async () => {
            const TEST_LOCATION = {
                coords: { horizontal: '98.321213213', vertical: '128.321213213' },
                user: '6426a9e2f1',
            };

            const response = await request(httpServer).post('/locations').send(TEST_LOCATION);

            expect(response.status).toBe(400);
        });
    });

    describe('getLocations', () => {
        it('Endpoint should return locations list', async () => {
            const fakeLocation = {
                coords: { horizontal: '98.321213213', vertical: '128.321213213' },
                user: fakeUserId,
            };

            await dbConnection.collection('locations').deleteMany({});
            await dbConnection.collection('locations').insertOne(fakeLocation);

            const response = await request(httpServer).get('/locations');

            const location = response.body[0];

            expect(response.status).toBe(200);
            expect(location.coords).toEqual(fakeLocation.coords);
            expect(location.user._id).toEqual(fakeUserId);
        });
    });

    afterAll(async () => {
        await dbConnection.collection('locations').deleteMany({});
        await dbConnection.collection('users').deleteMany({});
        await app.close();
    });
});
