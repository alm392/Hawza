import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function ensureTable() {
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
}

export async function POST(request) {
  const body = await request.json();
  const { first_name, last_name, email, phone, age, gender, message } = body;

  try {
    await ensureTable();
    await sql`
      INSERT INTO enrollments (first_name, last_name, email, phone, age, gender, message)
      VALUES (${first_name || ''}, ${last_name || ''}, ${email || ''}, ${phone || ''}, ${age || ''}, ${gender || ''}, ${message || ''})
    `;
    return Response.json({ ok: true });
  } catch (err) {
    console.error('DB error:', err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
