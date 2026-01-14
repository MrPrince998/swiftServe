import { BranchStatus } from '@interfaces/branch.interface';
import { TransactionLogs } from '@modules/transaction-logs/entities/transactionLogs.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tableNumber: number;

  @Column({ type: 'enum', enum: BranchStatus, default: BranchStatus.UNSEATED })
  tableStatus: BranchStatus;

  @OneToMany(() => TransactionLogs, (log) => log.table)
  transactionLogs: TransactionLogs[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
