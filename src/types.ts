export type Role = 'Admin' | 'Teacher' | 'Accounts';

export interface Student {
  id: string; // e.g., STU-2026-089
  name: string;
  grade: string; // e.g., "10"
  division: string; // e.g., "A"
  guardianName: string;
  guardianContact: string;
  guardianEmail: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  outstandingBalance: number;
  totalAnnualFee: number;
  attendanceHistory: {
    date: string;
    status: 'Present' | 'Absent' | 'Late';
  }[];
  grades: {
    subject: string;
    marksSecured: number;
    maxMarks: number;
    grade: string; // e.g., "A+", "A", "B", "B+"
  }[];
}

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  role: 'Parent' | 'Student' | 'Teacher';
  specializationDept?: string; // for teachers
  linkedStudentId?: string; // for parents
  linkedStudentName?: string; // for parents
  gradeRequested?: string; // "10"
  divisionRequested?: string; // "A"
  gradesRequested?: string[]; // Multiple grades for Teacher portal request
  divisionsRequested?: string[]; // Multiple divisions for Teacher portal request
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  rejectionCategory?: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  date: string;
  sentBy: string;
  senderRole: string;
  audienceType: 'All' | 'Class';
  targetGrade?: string;
  targetDivision?: string;
}

export interface Transaction {
  id: string; // TXN-9821
  studentId: string;
  studentName: string;
  grade: string;
  division: string;
  amount: number;
  date: string;
  method: 'Cash' | 'Cheque' | 'Transfer';
  notes?: string;
  receiptSent: boolean;
  status: 'Recorded' | 'Voided';
  voidReason?: string;
  timestamp: string; // for human readable e.g. "12 mins ago"
}

export interface FeeStructureItem {
  id: string;
  grade: string; // "All" or a specific grade like "10"
  feeName: string; // e.g. "Tuition Term 2"
  amount: number;
  dueDate: string; // "15 Sep 2026"
}

export interface ActivityLog {
  id: string;
  timestamp: string; // UTC ISO or human readable
  actor: string;
  role: Role;
  action: string;
  target: string;
  time?: string;
  ip?: string;
  user?: string;
}

export interface SchoolConfig {
  name: string;
  address: string;
  logoUrl?: string;
  establishedYear: string;
  currentTerm?: string;
  systemWideAlert?: string;
}
