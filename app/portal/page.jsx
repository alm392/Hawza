import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import StudentLoginForm from '@/components/StudentLoginForm';
import StudentPortal from '@/components/StudentPortal';

function getAuth() {
  const jar = cookies();
  const studentTok = jar.get('student_token')?.value;
  const adminTok = jar.get('admin_token')?.value;
  const studentExpected = createHash('sha256')
    .update(`hawza-student:${process.env.STUDENT_PASS}`)
    .digest('hex');
  const adminExpected = createHash('sha256')
    .update(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}:hawza-admin`)
    .digest('hex');
  const isAdmin = adminTok === adminExpected;
  const isStudent = studentTok === studentExpected;
  return { authed: isAdmin || isStudent, isAdmin };
}

export const metadata = { title: 'Student Portal | Idarah-e-Jafaria' };

export default function PortalPage() {
  const { authed, isAdmin } = getAuth();
  return (
    <div className="portal-page">
      {authed ? <StudentPortal isAdmin={isAdmin} /> : <StudentLoginForm />}
    </div>
  );
}
