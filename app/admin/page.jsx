import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';

function makeToken() {
  return createHash('sha256')
    .update(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}:hawza-admin`)
    .digest('hex');
}

function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token === makeToken();
}

function getEnrollments() {
  const file = join(process.cwd(), 'data', 'enrollments.json');
  if (!existsSync(file)) return [];
  try {
    return JSON.parse(readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

export const metadata = { title: 'Admin | Idarah-e-Jafaria' };

export default function AdminPage() {
  const auth = isAuthenticated();

  return (
    <div className="admin-page">
      {auth ? (
        <AdminDashboard enrollments={getEnrollments()} />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
