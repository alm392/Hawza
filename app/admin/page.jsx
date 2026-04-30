import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { neon } from '@neondatabase/serverless';
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

async function getEnrollments() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id        SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        first_name TEXT,
        last_name  TEXT,
        email      TEXT,
        phone      TEXT,
        age        TEXT,
        gender     TEXT,
        message    TEXT
      )
    `;
    const rows = await sql`SELECT * FROM enrollments ORDER BY timestamp ASC`;
    return rows;
  } catch (err) {
    console.error('DB read error:', err);
    return [];
  }
}

export const metadata = { title: 'Admin | Idarah-e-Jafaria' };

export default async function AdminPage() {
  const auth = isAuthenticated();

  return (
    <div className="admin-page">
      {auth ? (
        <AdminDashboard enrollments={await getEnrollments()} />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
