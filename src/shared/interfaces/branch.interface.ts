import { Address } from './address.interface';
import { User } from './user.interface';
import { TransactionLogs } from './transactionLogs.interface';

export interface Branch {
  id: string;
  branchCode: string;
  totalStaff: number;
  staff: User[];
  branchAddress: Address;
  totalRevenue: number;
  highestRevenue: number;
  totalTable: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  rating: number;
  tables: Table[];
  menuItem: MenuItem[];
  branchPhone: string;
  branchEmail: string;
  branchStatus: boolean;
  transactionLogs: TransactionLogs[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  tableNo: number;
  tableStatus: BranchStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: FoodTags[];
  totalOrders: number;
  lastMonthOrders: number;
  totalRevenue: number;
  lastMonthRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodTags {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum BranchStatus {
  UNSEATED = 'UNSEATED',
  SEATED = 'SEATED',
  WAITING = 'WAITING',
  ORDERED = 'ORDERED',
}
