import { Student, AccessRequest, Notice, Transaction, FeeStructureItem, ActivityLog, SchoolConfig } from './types';

export const INITIAL_SCHOOL: SchoolConfig = {
  name: "MyHLES Academy",
  address: "St. Xavier's Campus, Road 4, Sector 15, Mumbai, Maharashtra 400001",
  establishedYear: "2012"
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "STU-2026-001",
    name: "Alex Thompson",
    grade: "10",
    division: "A",
    guardianName: "Michael Thompson",
    guardianContact: "+91 98765 43210",
    guardianEmail: "m.thompson@gmail.com",
    feeStatus: "Pending",
    outstandingBalance: 1250,
    totalAnnualFee: 36500,
    attendanceHistory: [
      { date: "2026-06-18", status: "Present" },
      { date: "2026-06-19", status: "Present" },
      { date: "2026-06-20", status: "Late" }
    ],
    grades: [
      { subject: "Mathematics", marksSecured: 88, maxMarks: 100, grade: "A" },
      { subject: "Science", marksSecured: 95, maxMarks: 100, grade: "A+" },
      { subject: "English", marksSecured: 82, maxMarks: 100, grade: "A-" },
      { subject: "History", marksSecured: 78, maxMarks: 100, grade: "B+" }
    ]
  },
  {
    id: "STU-2026-002",
    name: "Sarah Miller",
    grade: "10",
    division: "B",
    guardianName: "David Miller",
    guardianContact: "+91 87654 32109",
    guardianEmail: "d.miller@outlook.com",
    feeStatus: "Paid",
    outstandingBalance: 0,
    totalAnnualFee: 36500,
    attendanceHistory: [
      { date: "2026-06-18", status: "Present" },
      { date: "2026-06-19", status: "Present" },
      { date: "2026-06-20", status: "Present" }
    ],
    grades: [
      { subject: "Mathematics", marksSecured: 92, maxMarks: 100, grade: "A+" },
      { subject: "Science", marksSecured: 90, maxMarks: 100, grade: "A" },
      { subject: "English", marksSecured: 88, maxMarks: 100, grade: "A" },
      { subject: "History", marksSecured: 85, maxMarks: 100, grade: "A-" }
    ]
  },
  {
    id: "STU-2026-003",
    name: "Jordan Davis",
    grade: "11",
    division: "A",
    guardianName: "Thomas Davis",
    guardianContact: "+91 76543 21098",
    guardianEmail: "t.davis@yahoo.com",
    feeStatus: "Overdue",
    outstandingBalance: 12400,
    totalAnnualFee: 42000,
    attendanceHistory: [
      { date: "2026-06-18", status: "Late" },
      { date: "2026-06-19", status: "Absent" },
      { date: "2026-06-20", status: "Present" }
    ],
    grades: [
      { subject: "Mathematics", marksSecured: 65, maxMarks: 100, grade: "C" },
      { subject: "Physics", marksSecured: 71, maxMarks: 100, grade: "B" },
      { subject: "Chemistry", marksSecured: 68, maxMarks: 100, grade: "B-" },
      { subject: "English", marksSecured: 84, maxMarks: 100, grade: "A-" }
    ]
  },
  {
    id: "STU-2026-004",
    name: "Maya Thompson",
    grade: "9",
    division: "A",
    guardianName: "David Thompson",
    guardianContact: "+91 65432 10987",
    guardianEmail: "d.thompson@work.com",
    feeStatus: "Paid",
    outstandingBalance: 0,
    totalAnnualFee: 32000,
    attendanceHistory: [
      { date: "2026-06-18", status: "Present" },
      { date: "2026-06-19", status: "Present" },
      { date: "2026-06-20", status: "Present" }
    ],
    grades: [
      { subject: "Mathematics", marksSecured: 94, maxMarks: 100, grade: "A+" },
      { subject: "Science", marksSecured: 91, maxMarks: 100, grade: "A" },
      { subject: "English", marksSecured: 89, maxMarks: 100, grade: "A" },
      { subject: "Social Science", marksSecured: 93, maxMarks: 100, grade: "A+" }
    ]
  },
  {
    id: "STU-2026-005",
    name: "Leon Richards",
    grade: "12",
    division: "A",
    guardianName: "Richard Miller",
    guardianContact: "+91 95432 12903",
    guardianEmail: "r.miller@corporate.com",
    feeStatus: "Paid",
    outstandingBalance: 0,
    totalAnnualFee: 45000,
    attendanceHistory: [
      { date: "2026-06-18", status: "Present" },
      { date: "2026-06-19", status: "Present" },
      { date: "2026-06-20", status: "Present" }
    ],
    grades: [
      { subject: "Mathematics", marksSecured: 99, maxMarks: 100, grade: "A+" },
      { subject: "Physics", marksSecured: 96, maxMarks: 100, grade: "A+" },
      { subject: "Chemistry", marksSecured: 98, maxMarks: 100, grade: "A+" },
      { subject: "English", marksSecured: 92, maxMarks: 100, grade: "A+" }
    ]
  },
  {
    id: "STU-2026-006",
    name: "Sophia Chen",
    grade: "10",
    division: "A",
    guardianName: "David Chen",
    guardianContact: "+91 99342 34567",
    guardianEmail: "david.chen@agency.com",
    feeStatus: "Paid",
    outstandingBalance: 0,
    totalAnnualFee: 36500,
    attendanceHistory: [
      { date: "2026-06-18", status: "Present" },
      { date: "2026-06-19", status: "Present" },
      { date: "2026-06-20", status: "Present" }
    ],
    grades: [
      { subject: "Mathematics", marksSecured: 91, maxMarks: 100, grade: "A" },
      { subject: "Science", marksSecured: 92, maxMarks: 100, grade: "A" },
      { subject: "English", marksSecured: 94, maxMarks: 100, grade: "A+" },
      { subject: "History", marksSecured: 89, maxMarks: 100, grade: "A-" }
    ]
  },
  {
    id: "STU-2026-007",
    name: "Elena Martinez",
    grade: "11",
    division: "A",
    guardianName: "Jorge Martinez",
    guardianContact: "+91 91234 56789",
    guardianEmail: "j.martinez@mumbai.in",
    feeStatus: "Pending",
    outstandingBalance: 3200,
    totalAnnualFee: 42000,
    attendanceHistory: [
      { date: "2026-06-18", status: "Present" },
      { date: "2026-06-19", status: "Late" },
      { date: "2026-06-20", status: "Present" }
    ],
    grades: [
      { subject: "Mathematics", marksSecured: 85, maxMarks: 100, grade: "A-" },
      { subject: "Physics", marksSecured: 89, maxMarks: 100, grade: "A-" },
      { subject: "Chemistry", marksSecured: 91, maxMarks: 100, grade: "A" },
      { subject: "English", marksSecured: 87, maxMarks: 100, grade: "B+" }
    ]
  }
];

export const INITIAL_REQUESTS: AccessRequest[] = [
  {
    id: "REQ-2026-001",
    name: "Alexander Mitchell",
    email: "a.mitchell@gmail.com",
    role: "Parent",
    linkedStudentId: "STU-2026-003",
    linkedStudentName: "Jordan Davis",
    gradeRequested: "11",
    divisionRequested: "A",
    requestDate: "2026-06-20",
    status: "Pending"
  },
  {
    id: "REQ-2026-002",
    name: "Sophia Chen",
    email: "s.chen.parent@gmail.com",
    role: "Parent",
    linkedStudentId: "STU-2026-006",
    linkedStudentName: "Sophia Chen",
    gradeRequested: "10",
    divisionRequested: "A",
    requestDate: "2026-06-20",
    status: "Pending"
  },
  {
    id: "REQ-2026-003",
    name: "Robert J. Harris",
    email: "robert.harris@mumbai.net",
    role: "Parent",
    linkedStudentId: "STU-2026-002",
    linkedStudentName: "Sarah Miller",
    gradeRequested: "10",
    divisionRequested: "B",
    requestDate: "2026-06-19",
    status: "Pending"
  },
  {
    id: "REQ-2026-004",
    name: "Dr. Rachel Green",
    email: "rachel.g@academy.edu",
    role: "Teacher",
    specializationDept: "Chemistry & Life Sciences",
    gradesRequested: ["10", "11", "12"],
    divisionsRequested: ["A", "B", "C"],
    requestDate: "2026-06-18",
    status: "Pending"
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "NTC-001",
    title: "Annual Sports Day Registration",
    message: "Registration for the Annual Sports Day events is open. Please contact your physical education coordinators with your chosen track-and-field events by Friday evening.",
    date: "2026-06-15",
    sentBy: "Principal's Office",
    senderRole: "Admin",
    audienceType: "All"
  },
  {
    id: "NTC-002",
    title: "Term 1 Feedback Portal Open",
    message: "Progress reports and qualitative feedback sheets for Term 1 have been released. Parents are requested to log into the mobile dashboard to sign off.",
    date: "2026-06-14",
    sentBy: "Administrative Office",
    senderRole: "Admin",
    audienceType: "All"
  },
  {
    id: "NTC-003",
    title: "Mathematics Revision Term 2",
    message: "Grade 10 students must submit their complete math revision worksheets for Calculus Basics by Monday afternoon. Graded scores will contribute to internal assessments.",
    date: "2026-06-18",
    sentBy: "Dr. Sarah Jenkins",
    senderRole: "Teacher",
    audienceType: "Class",
    targetGrade: "10",
    targetDivision: "A"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-2026-001",
    studentId: "STU-2026-004",
    studentName: "Maya Thompson",
    grade: "9",
    division: "A",
    amount: 14500,
    date: "2026-06-20",
    method: "Cash",
    notes: "Tuition Term 1 & Transport partial clearance",
    receiptSent: true,
    status: "Recorded",
    timestamp: "15 minutes ago"
  },
  {
    id: "TXN-2026-002",
    studentId: "STU-2026-005",
    studentName: "Leon Richards",
    grade: "12",
    division: "A",
    amount: 22000,
    date: "2026-06-20",
    method: "Cheque",
    notes: "Chq No: 882310, Clearing Bank: HDFC Bank",
    receiptSent: true,
    status: "Recorded",
    timestamp: "2 hours ago"
  },
  {
    id: "TXN-2026-003",
    studentId: "STU-2026-006",
    studentName: "Sophia Chen",
    grade: "10",
    division: "A",
    amount: 18500,
    date: "2026-06-20",
    method: "Cash",
    notes: "Received in Accounts office in full",
    receiptSent: true,
    status: "Recorded",
    timestamp: "4 hours ago"
  },
  {
    id: "TXN-2026-004",
    studentId: "STU-2026-002",
    studentName: "Sarah Miller",
    grade: "10",
    division: "B",
    amount: 36500,
    date: "2026-06-19",
    method: "Transfer",
    notes: "NEFT Transaction UTR: BARB2026061903",
    receiptSent: true,
    status: "Recorded",
    timestamp: "1 day ago"
  }
];

export const INITIAL_FEES: FeeStructureItem[] = [
  {
    id: "FEE-001",
    grade: "10",
    feeName: "Tuition Term 2",
    amount: 3200,
    dueDate: "2026-09-15"
  },
  {
    id: "FEE-002",
    grade: "10",
    feeName: "Laboratory Levy",
    amount: 750,
    dueDate: "2026-07-20"
  },
  {
    id: "FEE-003",
    grade: "11",
    feeName: "Tuition Term 2",
    amount: 3500,
    dueDate: "2026-09-15"
  },
  {
    id: "FEE-004",
    grade: "12",
    feeName: "Tuition Term 2",
    amount: 3800,
    dueDate: "2026-09-15"
  },
  {
    id: "FEE-005",
    grade: "All",
    feeName: "Operational Transport Levy",
    amount: 1500,
    dueDate: "2026-08-30"
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "LOG-001",
    timestamp: "2026-06-21T01:10:00-07:00",
    actor: "Admin Sarah",
    role: "Admin",
    action: "Approved Access Request",
    target: "Dr. Rachel Green (Teacher Access)"
  },
  {
    id: "LOG-002",
    timestamp: "2026-06-20T23:45:00-07:00",
    actor: "Accounts Desk",
    role: "Accounts",
    action: "Recorded Cash Transaction",
    target: "₹14,500 for student Maya Thompson"
  },
  {
    id: "LOG-003",
    timestamp: "2026-06-20T18:30:00-07:00",
    actor: "Dr. Sarah Jenkins",
    role: "Teacher",
    action: "Updated Chemistry Internal Scores",
    target: "Grade 10 - Division A"
  },
  {
    id: "LOG-004",
    timestamp: "2026-06-19T14:15:00-07:00",
    actor: "Principal's Office",
    role: "Admin",
    action: "Broadcasted Portal Announcement",
    target: "Annual Sports Day Notice"
  }
];
