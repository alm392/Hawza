import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR  = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'enrollments.json');

function readEnrollments() {
  if (!existsSync(DATA_FILE)) return [];
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

export async function POST(request) {
  const body = await request.json();
  const { first_name, last_name, email, phone, age, gender, programs, message } = body;

  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

    const enrollments = readEnrollments();
    enrollments.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      first_name:  first_name  || '',
      last_name:   last_name   || '',
      email:       email       || '',
      phone:       phone       || '',
      age:         age         || '',
      gender:      gender      || '',
      programs:    Array.isArray(programs) ? programs : [programs].filter(Boolean),
      message:     message     || '',
    });

    writeFileSync(DATA_FILE, JSON.stringify(enrollments, null, 2));
    return Response.json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
