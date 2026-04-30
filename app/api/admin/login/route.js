import { createHash } from 'crypto';

export function makeToken() {
  return createHash('sha256')
    .update(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}:hawza-admin`)
    .digest('hex');
}

export async function POST(request) {
  const { username, password } = await request.json();

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const res = Response.json({ ok: true });
    res.headers.set(
      'Set-Cookie',
      `admin_token=${makeToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
    );
    return res;
  }

  return Response.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
}
