'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SUBJECTS = ['Quran', 'Aqaid', 'Fiqh (Ahkam)', 'Akhlaq', 'Tarikh', 'Hadith'];

const SUBJECT_META = {
  'Quran':        { icon: '📖' },
  'Aqaid':        { icon: '🌙' },
  'Fiqh (Ahkam)': { icon: '⚖️' },
  'Akhlaq':       { icon: '💎' },
  'Tarikh':       { icon: '📜' },
  'Hadith':       { icon: '📝' },
};

function UploadPanel({ defaultWeek, onUploaded }) {
  const [week, setWeek] = useState(String(defaultWeek || 1));
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const formRef = useRef(null);

  useEffect(() => { setWeek(String(defaultWeek || 1)); }, [defaultWeek]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('lessonNumber', week);
    fd.append('subject', subject);
    fd.append('title', title);

    const res = await fetch('/api/portal/upload', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.ok) {
      setSuccess('Uploaded successfully!');
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
          <label>Week</label>
          <input
            type="number" min="1" max="52"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
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
            placeholder="e.g. Introduction to Tawhid"
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
          <button className="portal-action-btn" onClick={() => setExpanded((v) => !v)}>
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
          <iframe
            src={f.file_url}
            title={f.title}
            width="100%"
            height="640px"
            style={{ border: 'none', borderRadius: '8px' }}
          />
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

function LoadingSkeleton() {
  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-skeleton portal-skeleton-btn" />
        <div className="portal-skeleton portal-skeleton-nav-label" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="portal-skeleton portal-skeleton-week"
            style={{ animationDelay: `${i * 0.07}s` }}
          />
        ))}
      </aside>
      <main className="portal-main">
        <div className="portal-skeleton portal-skeleton-heading" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="portal-skeleton-subject-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="portal-skeleton portal-skeleton-subject-head" />
            <div className="portal-skeleton portal-skeleton-file" />
            <div className="portal-skeleton portal-skeleton-file" style={{ width: '75%' }} />
          </div>
        ))}
      </main>
    </div>
  );
}

export default function StudentPortal({ isAdmin }) {
  const [files, setFiles] = useState([]);
  const [activeWeek, setActiveWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  async function loadFiles() {
    const res = await fetch('/api/portal/files');
    const data = await res.json();
    if (data.ok) {
      setFiles(data.files);
      if (activeWeek === null && data.files.length > 0) {
        setActiveWeek(data.files[0].lesson_number);
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

  const weeks = [...new Set(files.map((f) => f.lesson_number))].sort((a, b) => a - b);
  const weekFiles = files.filter((f) => f.lesson_number === activeWeek);

  return (
    <>
      <div className="portal-header">
        <div className="portal-header-inner container">
          <div>
            <div className="portal-logo-arabic">إدارة جعفرية</div>
            <h2 className="portal-heading">Student Portal</h2>
            <p className="portal-subheading">Idarah-e-Jafaria Melbourne Hawza</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Log Out</button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="portal-layout">
          <aside className="portal-sidebar">
            <button
              className={`portal-add-btn${showUpload ? ' active' : ''}`}
              onClick={() => setShowUpload((v) => !v)}
            >
              {showUpload ? '✕ Close' : '+ Add Resources'}
            </button>

            {weeks.length > 0 && (
              <nav className="portal-week-nav">
                <p className="portal-nav-label">Weeks</p>
                <div className="portal-week-list">
                  {weeks.map((w) => (
                    <button
                      key={w}
                      className={`portal-week-btn${activeWeek === w ? ' active' : ''}`}
                      onClick={() => { setActiveWeek(w); setShowUpload(false); }}
                    >
                      Week {w}
                    </button>
                  ))}
                </div>
              </nav>
            )}
          </aside>

          <main className="portal-main">
            {showUpload && (
              <div className="portal-upload-card">
                <h3 className="portal-upload-bar-title">Upload Resource</h3>
                <UploadPanel
                  defaultWeek={activeWeek || 1}
                  onUploaded={() => { loadFiles(); setShowUpload(false); }}
                />
              </div>
            )}

            {weeks.length === 0 ? (
              <div className="portal-empty">
                No materials uploaded yet. Click "+ Add Resources" to get started.
              </div>
            ) : activeWeek === null ? (
              <div className="portal-empty">Select a week from the sidebar.</div>
            ) : (
              <>
                <h2 className="portal-week-heading">Week {activeWeek}</h2>
                <div className="portal-subjects">
                  {SUBJECTS.map((subject) => {
                    const subjectFiles = weekFiles.filter((f) => f.subject === subject);
                    const notes = subjectFiles.filter((f) => f.file_type === 'pdf');
                    const recordings = subjectFiles.filter((f) => f.file_type === 'audio' || f.file_type === 'video');
                    const { icon } = SUBJECT_META[subject];
                    return (
                      <div key={subject} className="portal-subject-section">
                        <div className="portal-subject-header">
                          <span className="portal-subject-icon">{icon}</span>
                          <h3 className="portal-subject-name">{subject}</h3>
                          <span className="portal-subject-count">
                            {subjectFiles.length > 0
                              ? `${subjectFiles.length} file${subjectFiles.length !== 1 ? 's' : ''}`
                              : 'No files yet'}
                          </span>
                        </div>
                        {subjectFiles.length === 0 ? (
                          <p className="portal-subject-empty">No resources uploaded for this subject yet.</p>
                        ) : (
                          <div className="portal-subject-body">
                            {notes.length > 0 && (
                              <div className="portal-section">
                                <p className="portal-section-title">Notes</p>
                                <div className="portal-files-list">
                                  {notes.map((f) => (
                                    <FileRow key={f.id} f={f} isAdmin={isAdmin} onDeleted={loadFiles} />
                                  ))}
                                </div>
                              </div>
                            )}
                            {recordings.length > 0 && (
                              <div className="portal-section">
                                <p className="portal-section-title">Recordings</p>
                                <div className="portal-files-list">
                                  {recordings.map((f) => (
                                    <FileRow key={f.id} f={f} isAdmin={isAdmin} onDeleted={loadFiles} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </>
  );
}
