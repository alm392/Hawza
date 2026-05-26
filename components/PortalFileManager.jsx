'use client';
import { useState, useEffect, useRef } from 'react';

const SUBJECTS = ['Aqaid', 'Ahkam', 'Arabic', 'Quran', 'Akhlaq', 'Seerah', 'Other'];

export default function PortalFileManager() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [lesson, setLesson] = useState('1');
  const [subject, setSubject] = useState('Aqaid');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const formRef = useRef(null);

  async function loadFiles() {
    const res = await fetch('/api/portal/files');
    const data = await res.json();
    if (data.ok) setFiles(data.files);
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('lessonNumber', lesson);
    fd.append('subject', subject);
    fd.append('title', title);

    const res = await fetch('/api/portal/upload', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.ok) {
      setSuccess('File uploaded successfully!');
      setTitle('');
      setFile(null);
      formRef.current?.reset();
      loadFiles();
    } else {
      setError(
        data.error ||
          'Upload failed. Make sure BLOB_READ_WRITE_TOKEN is set in your Vercel environment.'
      );
    }
    setUploading(false);
  }

  async function handleDelete(id, fileUrl) {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    await fetch('/api/portal/files', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, fileUrl }),
    });
    loadFiles();
  }

  // Group files by lesson+subject for display
  const groups = {};
  for (const f of files) {
    const key = `Lesson ${f.lesson_number} — ${f.subject}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(f);
  }

  const typeIcon = { pdf: '📄', audio: '🎵', video: '🎬' };

  return (
    <div className="portal-manager">
      <form ref={formRef} onSubmit={handleUpload} className="portal-upload-form">
        <h3 className="portal-manager-section-title">Upload New File</h3>
        <div className="portal-upload-row">
          <div className="admin-field">
            <label>Lesson #</label>
            <input
              type="number"
              min="1"
              max="99"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label>Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="admin-field" style={{ flex: 2 }}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Week 1 — Introduction to Aqaid"
              required
            />
          </div>
        </div>
        <div className="admin-field">
          <label>File (PDF, MP3, MP4, M4A, WAV, MOV)</label>
          <input
            type="file"
            accept=".pdf,.mp3,.mp4,.m4a,.wav,.mov,.aac,.webm"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />
        </div>
        {error && <p className="admin-error">{error}</p>}
        {success && <p className="portal-upload-success">{success}</p>}
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Upload File'}
        </button>
      </form>

      <div className="portal-files-admin">
        <h3 className="portal-manager-section-title">
          Uploaded Files ({files.length})
        </h3>
        {Object.keys(groups).length === 0 ? (
          <p className="portal-no-files">No files uploaded yet.</p>
        ) : (
          Object.entries(groups).map(([group, groupFiles]) => (
            <div key={group} className="portal-group">
              <div className="portal-group-label">{group}</div>
              {groupFiles.map((f) => (
                <div key={f.id} className="portal-admin-file-row">
                  <span className="portal-type-icon">{typeIcon[f.file_type] || '📎'}</span>
                  <span className="portal-admin-file-title">{f.title}</span>
                  <span className="portal-admin-file-name">{f.file_name}</span>
                  <button
                    onClick={() => handleDelete(f.id, f.file_url)}
                    className="portal-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
