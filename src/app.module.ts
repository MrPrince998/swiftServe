import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BillingSubscriptionModule } from './modules/billing-subscription/billing-subscription.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TenentModule } from './modules/tenent/tenent.module';
import { RestaurantBranchModule } from './modules/restaurant-branch/restaurant-branch.module';
import { FoodTagsModule } from './modules/food-tags/food-tags.module';
import { MenuItemModule } from './modules/menu-item/menu-item.module';
import { TableModule } from './modules/table/table.module';
import { TransactionLogsModule } from './modules/transaction-logs/transaction-logs.module';
import { InternalAccessMiddleware } from './modules/auth/InternalAccessMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    BillingSubscriptionModule,
    TenentModule,
    RestaurantBranchModule,
    FoodTagsModule,
    MenuItemModule,
    TableModule,
    TransactionLogsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InternalAccessMiddleware).forRoutes('*'); // Apply to all routes, middleware handles path-based limiting
  }
}
