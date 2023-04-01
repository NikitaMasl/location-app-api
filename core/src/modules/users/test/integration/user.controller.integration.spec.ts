import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { userErrors } from 'src/const/errors/users.errors';
import { USER_PROPS } from 'src/const/users/USER_PROPS';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

describe('UserController', () => {
    let dbConnection: Connection;
    let httpServer: any;
    let app: any;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        useContainer(app.select(AppModule), { fallbackOnErrors: true });

        await app.init();

        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();

        httpServer = app.getHttpServer();
    });

    describe('create', () => {
        it('Endpoint should create user', async () => {
            const TEST_USER_NAME = 'user-creation-test';

            const response = await request(httpServer).post('/users').send({
                userName: TEST_USER_NAME,
            });

            expect(response.status).toBe(201);
            expect(response.body.userName).toEqual(TEST_USER_NAME);
        });

        it('Endpoint should throw error if user already exusts', async () => {
            const TEST_USER_NAME = 'user-creation-test-1';

            await dbConnection.collection('users').insertOne({
                userName: TEST_USER_NAME,
            });

            const response = await request(httpServer).post('/users').send({
                userName: TEST_USER_NAME,
            });

            expect(response.status).toBe(400);
        });

        it(`Endpoint should return error, if userName shorter then ${USER_PROPS.MIN_USER_NAME_LENGTH}`, async () => {
            const response = await request(httpServer)
                .post('/users')
                .send({
                    userName: Array.from(Array(USER_PROPS.MIN_USER_NAME_LENGTH - 1).keys()).join(''),
                });

            expect(response.status).toBe(400);
        });

        it(`Endpoint should return error, if userName longer then ${USER_PROPS.MAX_USER_NAME_LENGTH}`, async () => {
            const response = await request(httpServer)
                .post('/users')
                .send({
                    userName: Array.from(Array(USER_PROPS.MAX_USER_NAME_LENGTH - 1).keys()).join(''),
                });

            expect(response.status).toBe(400);
        });
    });

    describe('getUser by userName', () => {
        const TEST_USER_NAME = 'integration-test-user';

        it('Endpoint should return user with certain username', async () => {
            await dbConnection.collection('users').insertOne({
                userName: TEST_USER_NAME,
            });

            const response = await request(httpServer).get('/users/integration-test-user');

            expect(response.status).toBe(200);
            expect(response.body.userName).toEqual(TEST_USER_NAME);
        });

        it('Endpoint should return not found, if not existed name provided', async () => {
            const response = await request(httpServer).get('/users/integration-test-not-existed-user');

            expect(response.status).toBe(404);
            expect(response.body.message).toEqual(userErrors.userDoesntExists);
        });

        it('Endpoint should return not found, if no name provided', async () => {
            const response = await request(httpServer).get('/users/');

            expect(response.status).toBe(404);
        });
    });

    afterAll(async () => {
        await dbConnection.collection('users').deleteMany({});
        await app.close();
    });
});
