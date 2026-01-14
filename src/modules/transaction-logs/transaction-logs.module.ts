import { Module } from '@nestjs/common';
import { TransactionLogsService } from './transaction-logs.service';
import { TransactionLogsController } from './transaction-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';
import { TransactionLogs } from './entities/transactionLogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionLogs, RestaurantBranch])],
  controllers: [TransactionLogsController],
  providers: [TransactionLogsService],
})
export class TransactionLogsModule {}
