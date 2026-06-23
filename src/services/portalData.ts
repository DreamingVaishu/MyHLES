import { AccessRequest, Role, Student, Transaction } from '../types';
import { Student as ParentStudent, FeeItem, SubjectGrade } from '../components/ParentMobile/types';
import { requireSupabase } from '../supabaseClient';

const toRequestRole = (role: AccessRequest['role']) => role === 'Student' ? 'Parent' : role;
const today = () => new Date().toISOString().split('T')[0];

const calculateLetterGrade = (marks: number) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 35) return 'D';
  return 'F';
};

export const signInParentWithGoogle = async () => {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/parent`
    }
  });

  if (error) throw error;
};

export const createAccessRequest = async (request: AccessRequest) => {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('access_requests').insert({
    role: toRequestRole(request.role),
    status: request.status,
    name: request.name,
    email: request.email,
    employee_id: request.employeeId,
    requested_password_hash: request.requestedPassword,
    standards: request.gradesRequested || [],
    divisions: request.divisionsRequested || [],
    student_name: request.linkedStudentName,
    standard: request.gradeRequested,
    division: request.divisionRequested,
    garden_number: request.gardenNumber
  }).select('*').single();

  if (error) throw error;
  return data;
};

export const fetchAccessRequests = async (): Promise<AccessRequest[]> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('access_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    employeeId: row.employee_id,
    requestedPassword: row.requested_password_hash,
    gradesRequested: row.standards || [],
    divisionsRequested: row.divisions || [],
    linkedStudentId: row.student_id,
    linkedStudentName: row.student_name,
    gradeRequested: row.standard,
    divisionRequested: row.division,
    gardenNumber: row.garden_number,
    requestDate: (row.created_at || today()).split('T')[0],
    status: row.status,
    rejectionCategory: row.rejection_category,
    rejectionReason: row.rejection_reason
  }));
};

export const fetchStudents = async (): Promise<Student[]> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('students')
    .select('*, student_marks(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    grade: row.standard,
    division: row.division,
    guardianName: row.guardian_name,
    guardianContact: row.guardian_contact,
    guardianEmail: row.guardian_email || '',
    gardenNumber: row.garden_number,
    feeStatus: row.fee_status,
    outstandingBalance: Number(row.outstanding_balance || 0),
    totalAnnualFee: Number(row.total_annual_fee || 0),
    attendanceHistory: [],
    grades: (row.student_marks || []).map((mark: any) => ({
      subject: mark.subject,
      marksSecured: Number(mark.marks_secured || 0),
      maxMarks: Number(mark.max_marks || 100),
      grade: mark.grade || calculateLetterGrade(Number(mark.marks_secured || 0))
    }))
  }));
};

export const approveAccessRequest = async (request: AccessRequest, approverRole: Role) => {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from('access_requests')
    .update({
      status: 'Approved',
      approved_at: new Date().toISOString()
    })
    .eq('id', request.id);

  if (error) throw error;

  if (request.role === 'Parent' && request.linkedStudentName) {
    const { error: studentError } = await supabase.from('students').insert({
      name: request.linkedStudentName,
      standard: request.gradeRequested,
      division: request.divisionRequested,
      garden_number: request.gardenNumber,
      guardian_name: request.name,
      guardian_contact: request.email,
      guardian_email: request.email.includes('@') ? request.email : null,
      access_status: 'Approved'
    });
    if (studentError) throw studentError;
  }

  await supabase.from('activity_logs').insert({
    actor_name: approverRole,
    actor_role: approverRole,
    action: 'Approved Access Request',
    target: `${request.role}: ${request.name}`
  });
};

export const rejectAccessRequest = async (id: string, category: string, reason: string, actorRole: Role) => {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from('access_requests')
    .update({
      status: 'Rejected',
      rejection_category: category,
      rejection_reason: reason
    })
    .eq('id', id);

  if (error) throw error;

  await supabase.from('activity_logs').insert({
    actor_name: actorRole,
    actor_role: actorRole,
    action: 'Rejected Access Request',
    target: `${category}: ${reason || 'No reason provided'}`
  });
};

export const recordLoginEvent = async (role: Role | 'Parent', email: string, provider = 'password') => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('login_events').insert({
    role,
    email,
    provider
  });

  if (error) throw error;
};

export const updateStudentRecord = async (student: Student) => {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from('students')
    .update({
      name: student.name,
      standard: student.grade,
      division: student.division,
      garden_number: student.gardenNumber,
      guardian_name: student.guardianName,
      guardian_contact: student.guardianContact,
      guardian_email: student.guardianEmail,
      fee_status: student.feeStatus,
      outstanding_balance: student.outstandingBalance,
      total_annual_fee: student.totalAnnualFee
    })
    .eq('id', student.id);

  if (error) throw error;
};

export const saveStudentMark = async (studentId: string, subject: string, marks: number) => {
  const supabase = requireSupabase();
  const grade = calculateLetterGrade(marks);
  const { data: existing, error: lookupError } = await supabase
    .from('student_marks')
    .select('id')
    .eq('student_id', studentId)
    .eq('subject', subject)
    .maybeSingle();

  if (lookupError) throw lookupError;

  const payload = {
    student_id: studentId,
    subject,
    marks_secured: marks,
    max_marks: 100,
    grade,
    updated_at: new Date().toISOString()
  };

  const query = existing
    ? supabase.from('student_marks').update(payload).eq('id', existing.id)
    : supabase.from('student_marks').insert(payload);

  const { error } = await query;
  if (error) throw error;
};

export const upsertParentProfileFromSession = async () => {
  const supabase = requireSupabase();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  const user = sessionData.session?.user;
  if (!user?.email) return null;

  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
  const { data, error } = await supabase
    .from('parent_profiles')
    .upsert({
      auth_user_id: user.id,
      name,
      email: user.email
    }, { onConflict: 'email' })
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const fetchParentChildren = async (email: string): Promise<ParentStudent[]> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('students')
    .select('*, student_marks(*), fee_items(*), fee_transactions(*)')
    .or(`guardian_email.eq.${email},guardian_contact.eq.${email}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => {
    const feeItems: FeeItem[] = (row.fee_items || []).map((fee: any) => ({
      id: fee.id,
      name: fee.name,
      amount: Number(fee.amount || 0),
      dueDate: fee.due_date || '',
      status: fee.status,
      category: fee.category || 'tuition'
    }));

    const marks: SubjectGrade[] = (row.student_marks || []).map((mark: any) => ({
      subject: mark.subject,
      marks: Number(mark.marks_secured || 0),
      grade: mark.grade || calculateLetterGrade(Number(mark.marks_secured || 0)),
      icon: 'book-open'
    }));

    return {
      id: row.id,
      name: row.name,
      grade: `Grade ${row.standard}`,
      section: row.division,
      guardianName: row.guardian_name,
      guardianPhone: row.guardian_contact,
      gardenNumber: row.garden_number,
      studentId: row.student_code || row.id,
      status: row.access_status === 'Approved' ? 'approved' : 'pending',
      academicGrades: marks,
      attendance: { present: 0, total: 0, percentage: 0 },
      upcomingExams: [],
      outstandingBalance: Number(row.outstanding_balance || 0),
      annualTotal: Number(row.total_annual_fee || 0),
      feeItems,
      transactions: (row.fee_transactions || []).map((txn: any) => {
        const recordedDate = new Date(txn.recorded_at || Date.now());
        return {
          id: txn.id,
          date: String(recordedDate.getDate()).padStart(2, '0'),
          month: recordedDate.toLocaleDateString('en-US', { month: 'short' }),
          day: String(recordedDate.getDate()),
          description: txn.notes || `${txn.method} payment`,
          amount: Number(txn.amount || 0),
          status: 'Paid'
        };
      })
    };
  });
};

export const fetchPendingParentRequests = async (email: string): Promise<ParentStudent[]> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('access_requests')
    .select('*')
    .eq('role', 'Parent')
    .eq('email', email)
    .eq('status', 'Pending')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.student_name,
    grade: `Grade ${row.standard}`,
    section: row.division,
    guardianName: row.name,
    guardianPhone: row.email,
    gardenNumber: row.garden_number,
    studentId: '',
    status: 'pending',
    academicGrades: [],
    attendance: { present: 0, total: 0, percentage: 0 },
    upcomingExams: [],
    outstandingBalance: 0,
    annualTotal: 0,
    feeItems: [],
    transactions: []
  }));
};

export const recordCashPayment = async (transaction: Transaction) => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('fee_transactions').insert({
    student_id: transaction.studentId,
    amount: transaction.amount,
    method: transaction.method,
    notes: transaction.notes,
    receipt_sent: transaction.receiptSent,
    status: transaction.status
  });

  if (error) throw error;
};
