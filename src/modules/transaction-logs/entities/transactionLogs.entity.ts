import {
  TransactionMethod,
  TransactionStatus,
} from '@interfaces/transactionLogs.interface';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';
import { Table } from '@modules/table/entities/table.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RestaurantBranch, (branch) => branch.id)
  branch: RestaurantBranch;

  @ManyToOne(() => Table, (table) => table.transactionLogs)
  table: Table;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column()
  transactionType: TransactionMethod;

  @Column()
  transactionStatus: TransactionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
