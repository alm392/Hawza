import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { neon } from '@neondatabase/serverless';

function isAuthed() {
  const jar = cookies();
  const adminTok = jar.get('admin_token')?.value;
  const studentTok = jar.get('student_token')?.value;
  const adminExpected = createHash('sha256')
    .update(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}:hawza-admin`)
    .digest('hex');
  const studentExpected = createHash('sha256')
    .update(`hawza-student:${process.env.STUDENT_PASS}`)
    .digest('hex');
  return adminTok === adminExpected || studentTok === studentExpected;
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS portal_files (
      id            SERIAL PRIMARY KEY,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      lesson_number INTEGER NOT NULL,
      subject       TEXT NOT NULL,
      title         TEXT NOT NULL,
      file_url      TEXT NOT NULL,
      file_type     TEXT NOT NULL,
      file_name     TEXT
    )
  `;
}

export async function POST(request) {
  if (!isAuthed()) return Response.json({ ok: false }, { status: 403 });

  const { url, lessonNumber, subject, title, mimeType, fileName, fileType: explicitFileType } = await request.json();

  if (!url || !lessonNumber || !subject || !title) {
    return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
  }

  const fileType = explicitFileType || (
    mimeType?.startsWith('audio/') ? 'audio'
    : mimeType?.startsWith('video/') ? 'video'
    : mimeType?.startsWith('image/') ? 'image'
    : 'pdf'
  );

  const sql = neon(process.env.DATABASE_URL);
  await ensureTable(sql);
  await sql`
    INSERT INTO portal_files (lesson_number, subject, title, file_url, file_type, file_name)
    VALUES (${lessonNumber}, ${subject}, ${title}, ${url}, ${fileType}, ${fileName ?? null})
  `;

  return Response.json({ ok: true });
}
