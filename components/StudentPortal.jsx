'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';

const SUBJECTS = ['Quran', 'Aqaid', 'Fiqh (Ahkam)', 'Akhlaq', 'Tarikh', 'Hadith'];

const SUBJECT_META = {
  'Quran':        { icon: '📖' },
  'Aqaid':        { icon: '🌙' },
  'Fiqh (Ahkam)': { icon: '⚖️' },
  'Akhlaq':       { icon: '💎' },
  'Tarikh':       { icon: '📜' },
  'Hadith':       { icon: '📝' },
};

const DEFAULT_WEEKS = [1, 2, 3, 4, 5, 6];

function UploadPanel({ defaultWeek, defaultSubject, onUploaded }) {
  const [week, setWeek] = useState(String(defaultWeek || 1));
  const [subject, setSubject] = useState(defaultSubject || SUBJECTS[0]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadLabel, setUploadLabel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const formRef = useRef(null);

  useEffect(() => { setWeek(String(defaultWeek || 1)); }, [defaultWeek]);
  useEffect(() => { setSubject(defaultSubject || SUBJECTS[0]); }, [defaultSubject]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');

    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    setUploadLabel(`Uploading ${sizeMB} MB…`);

    try {
      // File goes directly from the browser to Vercel Blob CDN — no server bottleneck
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/portal/upload',
      });

      // Save metadata to DB in a tiny JSON request
      const saveRes = await fetch('/api/portal/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: blob.url,
          lessonNumber: Number(week),
          subject,
          title,
          mimeType: file.type,
          fileName: file.name,
        }),
      });
      const saveData = await saveRes.json();

      if (saveData.ok) {
        setSuccess('Uploaded successfully!');
        setTitle('');
        setFile(null);
        formRef.current?.reset();
        onUploaded({ week: Number(week), subject });
      } else {
        setError(saveData.error || 'Upload succeeded but could not save record.');
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
    }

    setUploading(false);
    setUploadLabel('');
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
        <label>File (PDF, Image, MP3, MP4, M4A, WAV, MOV)</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp3,.mp4,.m4a,.wav,.mov,.aac,.webm"
          onChange={(e) => setFile(e.target.files[0] || null)}
          required
        />
      </div>
      {error && <p className="portal-upload-error">{error}</p>}
      {success && <p className="portal-upload-success">{success}</p>}

      {uploading ? (
        <div className="portal-upload-progress">
          <div className="portal-upload-progress-label">
            <span className="portal-upload-spinner" />
            {uploadLabel}
          </div>
          <div className="portal-progress-bar">
            <div className="portal-progress-indeterminate" />
          </div>
        </div>
      ) : (
        <button type="submit" className="btn btn-primary btn-sm">
          Upload File
        </button>
      )}
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
          {f.file_type === 'pdf' ? '📄' : f.file_type === 'audio' ? '🎵' : f.file_type === 'image' ? '🖼️' : '🎬'}
        </span>
        <span className="portal-file-name">{f.title}</span>
      </div>
      <div className="portal-file-actions">
        {(f.file_type === 'pdf' || f.file_type === 'image') && (
          <button className="portal-action-btn" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Close' : 'View'}
          </button>
        )}
        <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="portal-action-btn portal-action-dl">
          Download
        </a>
        {isAdmin && (
          <button className="portal-action-btn portal-action-delete" onClick={handleDelete}>Delete</button>
        )}
      </div>
      {f.file_type === 'pdf' && expanded && (
        <div className="portal-pdf-embed">
          <iframe src={f.file_url} title={f.title} width="100%" height="640px" style={{ border: 'none', borderRadius: '8px' }} />
        </div>
      )}
      {f.file_type === 'image' && expanded && (
        <div className="portal-pdf-embed">
          <img src={f.file_url} alt={f.title} style={{ maxWidth: '100%', borderRadius: '8px', display: 'block' }} />
        </div>
      )}
      {f.file_type === 'audio' && (
        <audio controls src={f.file_url} preload="none" className="portal-audio" />
      )}
      {f.file_type === 'video' && (
        <video controls src={f.file_url} preload="none" className="portal-video" />
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
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="portal-skeleton portal-skeleton-week" style={{ animationDelay: `${i * 0.07}s` }} />
        ))}
      </aside>
      <main className="portal-main">
        <div className="portal-skeleton portal-skeleton-heading" style={{ width: 220, marginBottom: 28 }} />
        {[1, 2].map((i) => (
          <div key={i} className="portal-skeleton-subject-card">
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
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeSubject, setActiveSubject] = useState('Quran');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  async function loadFiles() {
    const res = await fetch('/api/portal/files');
    const data = await res.json();
    if (data.ok) setFiles(data.files);
    setLoading(false);
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleLogout() {
    const route = isAdmin ? '/api/admin/logout' : '/api/student/logout';
    await fetch(route, { method: 'POST' });
    router.refresh();
  }

  // Always show weeks 1–6 plus any extra weeks from uploaded files
  const weeks = [...new Set([...DEFAULT_WEEKS, ...files.map((f) => f.lesson_number)])].sort((a, b) => a - b);

  const subjectFiles = files.filter((f) => f.lesson_number === activeWeek && f.subject === activeSubject);
  const notes      = subjectFiles.filter((f) => f.file_type === 'pdf');
  const images     = subjectFiles.filter((f) => f.file_type === 'image');
  const recordings = subjectFiles.filter((f) => f.file_type === 'audio' || f.file_type === 'video');

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
          {/* ── Sidebar ── */}
          <aside className="portal-sidebar">
            <button
              className={`portal-add-btn${showUpload ? ' active' : ''}`}
              onClick={() => setShowUpload((v) => !v)}
            >
              {showUpload ? '✕ Close' : '+ Add Resources'}
            </button>

            <nav className="portal-week-nav">
              <p className="portal-nav-label">Weeks</p>
              <div className="portal-week-list">
                {weeks.map((w) => {
                  const isOpen = activeWeek === w;
                  return (
                    <div key={w} className="portal-week-group">
                      <button
                        className={`portal-week-btn${isOpen ? ' active' : ''}`}
                        onClick={() => setActiveWeek(w)}
                      >
                        <span>Week {w}</span>
                        <span className="portal-week-chevron">{isOpen ? '▾' : '▸'}</span>
                      </button>

                      {isOpen && (
                        <div className="portal-subject-list">
                          {SUBJECTS.map((s) => {
                            const count = files.filter((f) => f.lesson_number === w && f.subject === s).length;
                            return (
                              <button
                                key={s}
                                className={`portal-subject-btn${activeSubject === s ? ' active' : ''}`}
                                onClick={() => setActiveSubject(s)}
                              >
                                <span className="portal-subject-btn-icon">{SUBJECT_META[s].icon}</span>
                                <span className="portal-subject-btn-label">{s}</span>
                                {count > 0 && <span className="portal-subject-dot" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* ── Main content ── */}
          <main className="portal-main">
            {showUpload && (
              <div className="portal-upload-card">
                <h3 className="portal-upload-bar-title">Upload Resource</h3>
                <UploadPanel
                  defaultWeek={activeWeek}
                  defaultSubject={activeSubject}
                  onUploaded={({ week, subject }) => {
                    loadFiles();
                    setShowUpload(false);
                    setActiveWeek(week);
                    setActiveSubject(subject);
                  }}
                />
              </div>
            )}

            <div className="portal-view-header">
              <span className="portal-view-week">Week {activeWeek}</span>
              <span className="portal-view-sep">›</span>
              <span className="portal-view-subject">
                {SUBJECT_META[activeSubject].icon} {activeSubject}
              </span>
            </div>

            {subjectFiles.length === 0 ? (
              <div className="portal-empty">No resources uploaded for this subject yet.</div>
            ) : (
              <div className="portal-subject-body">
                {notes.length > 0 && (
                  <div className="portal-section">
                    <p className="portal-section-title">Notes</p>
                    <div className="portal-files-list">
                      {notes.map((f) => <FileRow key={f.id} f={f} isAdmin={isAdmin} onDeleted={loadFiles} />)}
                    </div>
                  </div>
                )}
                {images.length > 0 && (
                  <div className="portal-section">
                    <p className="portal-section-title">Images</p>
                    <div className="portal-files-list">
                      {images.map((f) => <FileRow key={f.id} f={f} isAdmin={isAdmin} onDeleted={loadFiles} />)}
                    </div>
                  </div>
                )}
                {recordings.length > 0 && (
                  <div className="portal-section">
                    <p className="portal-section-title">Recordings</p>
                    <div className="portal-files-list">
                      {recordings.map((f) => <FileRow key={f.id} f={f} isAdmin={isAdmin} onDeleted={loadFiles} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}
