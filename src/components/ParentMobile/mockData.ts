import { Student, Notice } from './types';

export const INITIAL_NOTICES: Notice[] = [];

export const INITIAL_STUDENTS: Student[] = [];

export const DEFAULT_SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Science'];

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
