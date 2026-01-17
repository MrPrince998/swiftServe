import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { RestaurantTenent } from '@modules/tenent/entities/tenent.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { InternalAccessMiddleware } from './InternalAccessMiddleware';
import { UserModule } from '@modules/user/user.module';
import { TenentModule } from '@modules/tenent/tenent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RestaurantTenent]),
    PassportModule,
    UserModule,
    TenentModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
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
