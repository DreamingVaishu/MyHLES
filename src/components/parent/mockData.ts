import { Student, Notice } from './types';

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Annual Sports Meet',
    date: 'Oct 20',
    content: 'Join us for a day of athletic excellence and school spirit. Registration forms are due by Friday. Sports uniforms are mandatory for all participants.',
    category: 'Event'
  },
  {
    id: 'n2',
    title: 'Parent-Teacher Meeting',
    date: 'Oct 25',
    content: 'Individual academic progress reviews for Term 1 will take place in the main auditorium. Please reserve your specific time slot using the online portal.',
    category: 'Urgent'
  },
  {
    id: 'n3',
    title: 'Winter Uniform Update',
    date: 'Oct 18',
    content: 'Transition to winter uniforms begins next Monday. Blazers and woollen trousers can be gathered from the campus store from 9:00 AM onwards.',
    category: 'General'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Alex Thompson',
    grade: 'Grade 5',
    section: 'A',
    guardianName: 'Michael Thompson',
    guardianPhone: '+10000000000',
    studentId: 'STD-2026-618',
    status: 'approved',
    academicGrades: [
      { subject: 'Science', grade: 'A+', marks: 96, icon: 'beaker' },
      { subject: 'History', grade: 'B+', marks: 87, icon: 'book-open' },
      { subject: 'Mathematics', grade: 'A', marks: 92, icon: 'plus-minus' },
      { subject: 'English', grade: 'A-', marks: 90, icon: 'languages' }
    ],
    attendance: {
      present: 42,
      total: 45,
      percentage: 93.3
    },
    upcomingExams: [
      { id: 'e1', date: '12', month: 'OCT', subject: 'Mathematics', details: 'Term 2 Finals • 09:00 AM' },
      { id: 'e2', date: '15', month: 'OCT', subject: 'English Literature', details: 'Project Submission' }
    ],
    outstandingBalance: 1250,
    annualTotal: 3650,
    feeItems: [
      { id: 'f1', name: 'Tuition (Term 2)', amount: 3200, dueDate: '15 Sep 2026', status: 'Paid', category: 'tuition' },
      { id: 'f2', name: 'Transport (Oct)', amount: 150, dueDate: '05 Oct 2026', status: 'Overdue', category: 'transport' },
      { id: 'f3', name: 'Lab Fees', amount: 300, dueDate: '15 Oct 2026', status: 'Pending', category: 'lab' },
      { id: 'f4', name: 'Activity Fee', amount: 800, dueDate: '30 Oct 2026', status: 'Pending', category: 'activity' }
    ],
    transactions: [
      { id: 't1', date: '24', month: 'Aug', day: '24', description: 'Tuition (Term 1)', amount: 3200, status: 'Paid' },
      { id: 't2', date: '02', month: 'Aug', day: '02', description: 'Activity Fee', amount: 450, status: 'Paid' }
    ]
  },
  {
    id: 's2',
    name: 'Sarah Thompson',
    grade: 'Grade 3',
    section: 'B',
    guardianName: 'Michael Thompson',
    guardianPhone: '+10000000000',
    studentId: 'STD-2026-921',
    status: 'approved',
    academicGrades: [
      { subject: 'Science', grade: 'A', marks: 93, icon: 'beaker' },
      { subject: 'History', grade: 'A', marks: 94, icon: 'book-open' },
      { subject: 'Mathematics', grade: 'A+', marks: 98, icon: 'plus-minus' },
      { subject: 'English', grade: 'B+', marks: 88, icon: 'languages' }
    ],
    attendance: {
      present: 44,
      total: 45,
      percentage: 97.7
    },
    upcomingExams: [
      { id: 'e3', date: '13', month: 'OCT', subject: 'Science Practical', details: 'Chemistry Lab • 10:30 AM' },
      { id: 'e4', date: '22', month: 'OCT', subject: 'History Quiz', details: 'Ancient Civilizations' }
    ],
    outstandingBalance: 400,
    annualTotal: 3650,
    feeItems: [
      { id: 'f5', name: 'Tuition (Term 2)', amount: 3200, dueDate: '15 Sep 2026', status: 'Paid', category: 'tuition' },
      { id: 'f6', name: 'Library Fee', amount: 200, dueDate: '10 Oct 2026', status: 'Overdue', category: 'library' },
      { id: 'f7', name: 'Computer Lab Access', amount: 200, dueDate: '20 Oct 2026', status: 'Pending', category: 'lab' }
    ],
    transactions: [
      { id: 't3', date: '25', month: 'Aug', day: '25', description: 'Tuition (Term 1)', amount: 3200, status: 'Paid' },
      { id: 't4', date: '10', month: 'Aug', day: '10', description: 'Sports Kit Fee', amount: 450, status: 'Paid' }
    ]
  }
];

export const MOCK_SUBJECTS_POOL = [
  { subject: 'Mathematics', baseMark: 85, icon: 'plus-minus' },
  { subject: 'Science', baseMark: 82, icon: 'beaker' },
  { subject: 'History', baseMark: 78, icon: 'book-open' },
  { subject: 'English', baseMark: 80, icon: 'languages' },
  { subject: 'Geography', baseMark: 84, icon: 'globe' },
  { subject: 'Arts & Design', baseMark: 90, icon: 'palette' }
];

export const calculateGrade = (marks: number): string => {
  if (marks >= 95) return 'A+';
  if (marks >= 90) return 'A';
  if (marks >= 85) return 'A-';
  if (marks >= 80) return 'B+';
  if (marks >= 75) return 'B';
  if (marks >= 70) return 'B-';
  if (marks >= 60) return 'C';
  return 'D';
};
