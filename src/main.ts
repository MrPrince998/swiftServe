import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import * as fs from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const uploadDirs = [
    join(process.cwd(), 'public'),
    join(process.cwd(), "public", "images"),
    join(process.cwd(), "public", "files")
  ];
  
  uploadDirs.forEach((dir) => {
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir, {recursive: true});
    }
  })
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // const activityLogService = app.get(ActivityLogService)
  const configService = app.get(ConfigService)
  const NODE_ENV= configService.get('NODE_ENV')

  app.use(cookieParser(), {
    prefix: "/",
    index: false,
  })
  const ALLOWED_ORIGIN = [
    "http://localhost:3000",
    "https://swiftserve.com"
  ]

  app.enableCors({
    origin: (origin, callback) => {
      if(!origin || ALLOWED_ORIGIN.includes(origin)) {
        callback(null, true);
      }else {
        console.warn('Blocked by CORS: ', origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization', 
      'Accept',
      'Origin',
    ],
    optionsSuccessStatus: 204
  })

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true, 
      forbidNonWhitelisted: true,
      validationError: {target: false, value: false},
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  app.setGlobalPrefix('api/')

  const publicPath = join(process.cwd(), 'public');

  app.useStaticAssets(publicPath);

  const PORT = configService.get<number>('PORT')

  app.listen(PORT!, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
}
bootstrap();
