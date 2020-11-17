import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';

import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import { ConfigModule } from './config/config.module';
import { CONFIG_TOKEN } from './config/constants';
import { AppProperties } from './config/app-properties.model';
import { AuthService } from './auth/auth.service';
import { Repository } from 'typeorm';
import { CUtilisateur } from './utilisateur/utilisateur.entity';


async function bootstrap() {
  const fs = require('fs');
  const nodeEnv = process.env.NODE_ENV || 'development';
  const propertiesFolder = path.resolve(process.cwd(), 'properties');
  const config: AppProperties = require(`${propertiesFolder}/${nodeEnv}.properties.json`);

  let option = {};
  if (config.ssl.key && config.ssl.cert) {
    const key = fs.readFileSync(config.ssl.key, 'utf8');
    const cert = fs.readFileSync(config.ssl.cert, 'utf8');
    option = {
      httpsOptions: {
        key: key,
        cert: cert,
        requestCert: false,
        rejectUnauthorized: false
      }
    }
  }

  const app: INestApplication = await NestFactory.create(AppModule, option);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.useGlobalPipes(new ValidationPipe());

  const authGuard = new AuthGuard(new AuthService(config,
    new Repository<CUtilisateur>())
    , new Reflector());
  app.useGlobalGuards(authGuard);

  const props: AppProperties = app.select(ConfigModule).get(CONFIG_TOKEN);
  app.use(cors(props.cors));


  if (process.env.NODE_ENV !== 'production') {

      const swaggerConfig = new DocumentBuilder()
          .addBearerAuth()
          .setTitle('AleaAC API')
          .setDescription('API REST du site AleaAC')
          .setVersion('1.0')
          .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api/swagger', app, swaggerDocument);
  }

  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 4242;

  await app.listen(port);
}

bootstrap();
