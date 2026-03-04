import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { RestaurantTenent } from 'src/modules/tenent/entities/tenent.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { InternalAccessMiddleware } from './InternalAccessMiddleware';
import { UserModule } from 'src/modules/user/user.module';
import { TenentModule } from 'src/modules/tenent/tenent.module';
import { QueueModule } from 'src/shared/Queue/queue.module';
import { EmailModule } from 'src/shared/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RestaurantTenent]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    UserModule,
    QueueModule,
    EmailModule,
    TenentModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InternalAccessMiddleware).forRoutes('auth');
  }
}
