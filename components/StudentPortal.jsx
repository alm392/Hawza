'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SUBJECTS = ['Aqaid', 'Ahkam', 'Arabic', 'Quran', 'Akhlaq', 'Seerah', 'Other'];

function UploadPanel({ onUploaded }) {
  const [lesson, setLesson] = useState('1');
  const [subject, setSubject] = useState('Aqaid');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const formRef = useRef(null);

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
      setSuccess('Uploaded!');
      setTitle('');
      setFile(null);
      formRef.current?.reset();
      onUploaded();
    } else {
      setError(data.error || 'Upload failed.');
    }
    setUploading(false);
  }

  return (
    <form ref={formRef} onSubmit={handleUpload} className="portal-upload-panel">
      <div className="portal-upload-row">
        <div className="portal-upload-field">
          <label>Lesson #</label>
          <input
            type="number" min="1" max="99"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            required
          />
        </div>
        <div className="portal-upload-field">
          <label>Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="portal-upload-field portal-upload-field--wide">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Week 1 — Introduction"
            required
          />
        </div>
      </div>
      <div className="portal-upload-field">
        <label>File (PDF, MP3, MP4, M4A, WAV, MOV)</label>
        <input
          type="file"
          accept=".pdf,.mp3,.mp4,.m4a,.wav,.mov,.aac,.webm"
          onChange={(e) => setFile(e.target.files[0] || null)}
          required
        />
      </div>
      {error && <p className="portal-upload-error">{error}</p>}
      {success && <p className="portal-upload-success">{success}</p>}
      <button type="submit" className="btn btn-primary btn-sm" disabled={uploading}>
        {uploading ? 'Uploading…' : 'Upload File'}
      </button>
    </form>
  );
}

function FileRow({ f, isAdmin, onDeleted }) {
  const [expanded, setExpanded] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this file?')) return;
    await fetch('/api/portal/files', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: f.id, fileUrl: f.file_url }),
    });
    onDeleted();
  }

  return (
    <div className="portal-file-item">
      <div className="portal-file-meta">
        <span className="portal-file-icon">
          {f.file_type === 'pdf' ? '📄' : f.file_type === 'audio' ? '🎵' : '🎬'}
        </span>
        <span className="portal-file-name">{f.title}</span>
      </div>

      <div className="portal-file-actions">
        {f.file_type === 'pdf' && (
          <button
            className="portal-action-btn"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Close' : 'View'}
          </button>
        )}
        <a
          href={f.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="portal-action-btn portal-action-dl"
        >
          Download
        </a>
        {isAdmin && (
          <button className="portal-action-btn portal-action-delete" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      {f.file_type === 'pdf' && expanded && (
        <div className="portal-pdf-embed">
          <iframe src={f.file_url} title={f.title} width="100%" height="640px" style={{ border: 'none', borderRadius: '8px' }} />
        </div>
      )}
      {f.file_type === 'audio' && (
        <audio controls src={f.file_url} preload="none" className="portal-audio">
          Your browser does not support audio playback.
        </audio>
      )}
      {f.file_type === 'video' && (
        <video controls src={f.file_url} preload="none" className="portal-video">
          Your browser does not support video playback.
        </video>
      )}
    </div>
  );
}

export default function StudentPortal({ isAdmin }) {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  async function loadFiles() {
    const res = await fetch('/api/portal/files');
    const data = await res.json();
    if (data.ok) {
      setFiles(data.files);
      if (!activeTab && data.files.length > 0) {
        const f = data.files[0];
        setActiveTab(`${f.lesson_number}-${f.subject}`);
      }
    }
    setLoading(false);
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleLogout() {
    const route = isAdmin ? '/api/admin/logout' : '/api/student/logout';
    await fetch(route, { method: 'POST' });
    router.refresh();
  }

  // Build ordered tab list
  const tabs = [];
  const seen = new Set();
  for (const f of files) {
    const key = `${f.lesson_number}-${f.subject}`;
    if (!seen.has(key)) {
      seen.add(key);
      tabs.push({ key, lessonNumber: f.lesson_number, subject: f.subject });
    }
  }

  const tabFiles = files.filter((f) => `${f.lesson_number}-${f.subject}` === activeTab);
  const notes = tabFiles.filter((f) => f.file_type === 'pdf');
  const recordings = tabFiles.filter((f) => f.file_type === 'audio' || f.file_type === 'video');

  return (
    <>
      <div className="portal-header">
        <div className="portal-header-inner container">
          <div>
            <div className="portal-logo-arabic">إدارة جعفرية</div>
            <h2 className="portal-heading">Student Portal</h2>
            <p className="portal-subheading">Idarah-e-Jafaria Melbourne Hawza</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isAdmin && (
              <button
                className={`btn btn-sm${showUpload ? ' portal-btn-upload-active' : ' portal-btn-upload'}`}
                onClick={() => setShowUpload((v) => !v)}
              >
                {showUpload ? '✕ Close' : '+ Add Files'}
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Log Out</button>
          </div>
        </div>
      </div>

      {isAdmin && showUpload && (
        <div className="portal-upload-bar">
          <div className="container">
            <h3 className="portal-upload-bar-title">Upload New File</h3>
            <UploadPanel onUploaded={() => { loadFiles(); setShowUpload(false); }} />
          </div>
        </div>
      )}

      <div className="portal-body container">
        {loading ? (
          <div className="portal-loading">Loading your materials…</div>
        ) : tabs.length === 0 ? (
          <div className="portal-empty">
            {isAdmin
              ? 'No files uploaded yet. Use the "+ Add Files" button above to get started.'
              : 'No lesson materials have been uploaded yet. Check back soon.'}
          </div>
        ) : (
          <>
            <div className="portal-tabs-wrap">
              <div className="portal-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`portal-tab${activeTab === tab.key ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    Lesson {tab.lessonNumber} — {tab.subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="portal-content">
              {notes.length > 0 && (
                <div className="portal-section">
                  <h3 className="portal-section-title">Notes</h3>
                  <div className="portal-files-list">
                    {notes.map((f) => (
                      <FileRow key={f.id} f={f} isAdmin={isAdmin} onDeleted={loadFiles} />
                    ))}
                  </div>
                </div>
              )}

              {recordings.length > 0 && (
                <div className="portal-section">
                  <h3 className="portal-section-title">Recordings</h3>
                  <div className="portal-files-list">
                    {recordings.map((f) => (
                      <FileRow key={f.id} f={f} isAdmin={isAdmin} onDeleted={loadFiles} />
                    ))}
                  </div>
                </div>
              )}

              {tabFiles.length === 0 && (
                <div className="portal-empty">No files uploaded for this lesson yet.</div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
