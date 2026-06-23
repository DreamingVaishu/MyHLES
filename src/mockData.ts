import { Student, AccessRequest, Notice, Transaction, FeeStructureItem, ActivityLog, SchoolConfig } from './types';

export const INITIAL_SCHOOL: SchoolConfig = {
  name: "MyHLES Academy",
  address: "St. Xavier's Campus, Road 4, Sector 15, Mumbai, Maharashtra 400001",
  establishedYear: "2012"
};

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_REQUESTS: AccessRequest[] = [];

export const INITIAL_NOTICES: Notice[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_FEES: FeeStructureItem[] = [];

export const INITIAL_LOGS: ActivityLog[] = [];
