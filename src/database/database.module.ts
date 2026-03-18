import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Default connection (for platform - User, Auth, BillingSubscription, etc.)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databasePublicUrl = configService.get<string>('DATABASE_PUBLIC_URL');

        return {
          type: 'postgres',
          ...(databasePublicUrl
            ? { url: databasePublicUrl }
            : {
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
              }),
          // entities: [],
          autoLoadEntities: true,
          synchronize: true, // development only
        };
      },
    }),
  ],
})
export class DatabaseModule {}
