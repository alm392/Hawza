import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import StudentLoginForm from '@/components/StudentLoginForm';
import StudentPortal from '@/components/StudentPortal';

function isAuthenticated() {
  const jar = cookies();
  const studentTok = jar.get('student_token')?.value;
  const adminTok = jar.get('admin_token')?.value;
  const studentExpected = createHash('sha256')
    .update(`hawza-student:${process.env.STUDENT_PASS}`)
    .digest('hex');
  const adminExpected = createHash('sha256')
    .update(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}:hawza-admin`)
    .digest('hex');
  return studentTok === studentExpected || adminTok === adminExpected;
}

export const metadata = { title: 'Student Portal | Idarah-e-Jafaria' };

export default function PortalPage() {
  const auth = isAuthenticated();
  return (
    <div className="portal-page">
      {auth ? <StudentPortal /> : <StudentLoginForm />}
    </div>
  );
}
