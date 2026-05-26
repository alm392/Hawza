import { createHash } from 'crypto';

export async function POST(request) {
  const { password } = await request.json();

  if (password === process.env.STUDENT_PASS) {
    const token = createHash('sha256')
      .update(`hawza-student:${process.env.STUDENT_PASS}`)
      .digest('hex');
    const res = Response.json({ ok: true });
    res.headers.set(
      'Set-Cookie',
      `student_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
    );
    return res;
  }

  return Response.json({ ok: false, error: 'Incorrect password' }, { status: 401 });
}
