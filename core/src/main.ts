import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import vars from './common/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

const { port } = vars;

async function start() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const config = new DocumentBuilder()
        .setTitle('Location-app api documentation')
        .setDescription('It is REST api documentation for location app')
        .setVersion('0.0.1')
        .addTag('location-app-api')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/docs', app, document);

    await app.listen(port, () => {
        console.log(`Core service started on port ${port}`);
    });
}

start();
