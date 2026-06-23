export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'Overdue' | 'Pending' | 'Paid';
  category: 'tuition' | 'transport' | 'lab' | 'activity' | 'library';
}

export interface Transaction {
  id: string;
  date: string;
  month: string;
  day: string;
  description: string;
  amount: number;
  status: 'Paid';
}

export interface SubjectGrade {
  subject: string;
  grade: string;
  marks: number;
  icon: string;
}

export interface UpcomingExam {
  id: string;
  date: string;
  month: string;
  subject: string;
  details: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  studentId: string; // Activated upon teacher approval
  status: 'pending' | 'approved';
  academicGrades: SubjectGrade[];
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
  upcomingExams: UpcomingExam[];
  outstandingBalance: number;
  annualTotal: number;
  feeItems: FeeItem[];
  transactions: Transaction[];
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'Urgent' | 'General' | 'Event';
}

export interface UserRole {
  role: 'parent' | 'teacher';
  userId?: string;
  phone?: string;
  email?: string;
}
