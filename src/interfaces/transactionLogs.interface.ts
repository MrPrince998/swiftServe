export interface TransactionLogs {
    id: string;
    branchId: string;
    tableId: string;
    transactionMethod: TransactionMethod;
    totalAmount: number;
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum TransactionMethod {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
}

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}