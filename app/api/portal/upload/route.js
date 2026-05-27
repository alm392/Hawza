import { handleUpload } from '@vercel/blob/client';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

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

// This route only handles the client-token handshake.
// The actual file never passes through this server — it goes directly to Vercel Blob CDN.
// After upload, the client posts metadata to /api/portal/save.
export async function POST(request) {
  const body = await request.json();

  if (body.type === 'blob.generate-client-token' && !isAuthed()) {
    return Response.json({ ok: false }, { status: 403 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'application/pdf',
          'audio/*',
          'video/*',
          'image/*',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ],
        maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
      }),
      onUploadCompleted: async () => {},
    });
    return Response.json(jsonResponse);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
