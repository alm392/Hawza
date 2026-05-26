import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { neon } from '@neondatabase/serverless';
import { del } from '@vercel/blob';

function checkAuth() {
  const jar = cookies();
  const adminExpected = createHash('sha256')
    .update(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}:hawza-admin`)
    .digest('hex');
  const studentExpected = createHash('sha256')
    .update(`hawza-student:${process.env.STUDENT_PASS}`)
    .digest('hex');
  const adminTok = jar.get('admin_token')?.value;
  const studentTok = jar.get('student_token')?.value;
  return {
    isAdmin: adminTok === adminExpected,
    isAuthed: adminTok === adminExpected || studentTok === studentExpected,
  };
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS portal_files (
      id           SERIAL PRIMARY KEY,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      lesson_number INTEGER NOT NULL,
      subject      TEXT NOT NULL,
      title        TEXT NOT NULL,
      file_url     TEXT NOT NULL,
      file_type    TEXT NOT NULL,
      file_name    TEXT
    )
  `;
}

export async function GET() {
  const { isAuthed } = checkAuth();
  if (!isAuthed) return Response.json({ ok: false }, { status: 403 });

  const sql = neon(process.env.DATABASE_URL);
  await ensureTable(sql);
  const files = await sql`
    SELECT * FROM portal_files ORDER BY lesson_number ASC, subject ASC, created_at ASC
  `;
  return Response.json({ ok: true, files });
}

export async function DELETE(request) {
  const { isAdmin } = checkAuth();
  if (!isAdmin) return Response.json({ ok: false }, { status: 403 });

  const { id, fileUrl } = await request.json();
  const sql = neon(process.env.DATABASE_URL);
  await ensureTable(sql);

  try { await del(fileUrl); } catch (_) {}

  await sql`DELETE FROM portal_files WHERE id = ${id}`;
  return Response.json({ ok: true });
}
