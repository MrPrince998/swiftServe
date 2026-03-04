export interface Employee {
    id: string;
    shift: Date;
    branchId: string;
    employeeCode: string;
    employeeJoiningDate: Date;
    employeeLeavingDate: Date;
    isOnDuty: boolean;
    createdAt: Date;
    updatedAt: Date;
}