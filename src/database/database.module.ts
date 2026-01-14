import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Default connection (for platform - User, Auth, BillingSubscription, etc.)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // entities: [],
        autoLoadEntities: true,
        synchronize: true, // development only
      }),
    }),

    // Named connection for restaurant-specific data
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     name: 'restaurant_db',
    //     type: 'postgres',
    //     host:
    //       configService.get('RESTAURANT_DB_HOST') ||
    //       configService.get('DB_HOST'),
    //     port:
    //       configService.get('RESTAURANT_DB_PORT') ||
    //       configService.get('DB_PORT'),
    //     username:
    //       configService.get('RESTAURANT_DB_USERNAME') ||
    //       configService.get('DB_USERNAME'),
    //     password:
    //       configService.get('RESTAURANT_DB_PASSWORD') ||
    //       configService.get('DB_PASSWORD'),
    //     database:
    //       configService.get('RESTAURANT_DB_NAME') ||
    //       configService.get('DB_NAME'),
    //     autoLoadEntities: true,
    //     synchronize: true, // development only
    //   }),
    // }),
  ],
})
export class DatabaseModule {}
