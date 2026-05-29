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

function parseYoutubeId(url) {
  try {
    const u = new URL(url.trim());
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
    if (u.hostname === 'youtube.com' || u.hostname === 'www.youtube.com') {
      if (u.searchParams.has('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/\/(?:embed|v|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[1];
    }
  } catch {}
  return null;
}

function UploadPanel({ defaultWeek, defaultSubject, onUploaded }) {
  const [week, setWeek] = useState(String(defaultWeek || 1));
  const [subject, setSubject] = useState(defaultSubject || SUBJECTS[0]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadType, setUploadType] = useState('file');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const formRef = useRef(null);

  useEffect(() => { setWeek(String(defaultWeek || 1)); }, [defaultWeek]);
  useEffect(() => { setSubject(defaultSubject || SUBJECTS[0]); }, [defaultSubject]);

  function switchType(t) {
    setUploadType(t);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (uploadType === 'youtube') {
      const videoId = parseYoutubeId(youtubeUrl);
      if (!videoId) {
        setError('Invalid YouTube URL. Paste a link like youtube.com/watch?v=... or youtu.be/...');
        return;
      }
      setUploading(true);
      try {
        const res = await fetch('/api/portal/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: `https://www.youtube-nocookie.com/embed/${videoId}`,
            lessonNumber: Number(week),
            subject,
            title,
            fileType: 'youtube',
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setSuccess('Video added!');
          setTitle('');
          setYoutubeUrl('');
          formRef.current?.reset();
          onUploaded({ week: Number(week), subject });
        } else {
          setError(data.error || 'Could not save video.');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setUploading(false);
      }
      return;
    }

    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/portal/upload',
        multipart: true,
        onUploadProgress: ({ percentage }) => {
          setProgress(Math.min(99, Math.round(percentage)));
        },
      });

      const res = await fetch('/api/portal/save', {
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
      const data = await res.json();

      if (data.ok) {
        setProgress(100);
        setTimeout(() => {
          setSuccess('Uploaded successfully!');
          setUploading(false);
          setProgress(0);
          setTitle('');
          setFile(null);
          formRef.current?.reset();
          onUploaded({ week: Number(week), subject });
        }, 400);
      } else {
        setError(data.error || 'Upload succeeded but could not save the record.');
        setUploading(false);
        setProgress(0);
      }
    } catch (err) {
      let msg = err?.message || 'Upload failed.';
      if (msg.includes('NetworkError') || msg.includes('fetch failed') || msg.includes('Failed to fetch')) {
        msg = 'Network error — check your connection and try again.';
      } else if (msg.includes('maximum') || msg.includes('too large') || msg.includes('413')) {
        msg = 'File is too large to upload.';
      } else if (msg.includes('403') || msg.includes('401') || msg.includes('Forbidden')) {
        msg = 'Not authorised — please log in again.';
      }
      setError(msg);
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="portal-upload-panel">
      <div className="portal-upload-type-toggle">
        <button type="button" className={`portal-toggle-btn${uploadType === 'file' ? ' active' : ''}`} onClick={() => switchType('file')}>
          Upload File
        </button>
        <button type="button" className={`portal-toggle-btn${uploadType === 'youtube' ? ' active' : ''}`} onClick={() => switchType('youtube')}>
          YouTube Video
        </button>
      </div>

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

      {uploadType === 'file' ? (
        <div className="portal-upload-field">
          <label>File (PDF, Image, MP3, MP4, M4A, WAV, MOV)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp3,.mp4,.m4a,.wav,.mov,.aac,.webm"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />
        </div>
      ) : (
        <div className="portal-upload-field">
          <label>YouTube URL</label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
      )}

      {error && <p className="portal-upload-error">{error}</p>}
      {success && <p className="portal-upload-success">{success}</p>}

      {uploading ? (
        uploadType === 'file' ? (
          <div className="portal-upload-progress">
            <div className="portal-upload-progress-label">
              <span className="portal-upload-spinner" />
              <span>Uploading {(file.size / 1024 / 1024).toFixed(1)} MB — {progress}%</span>
            </div>
            <div className="portal-progress-bar">
              <div className="portal-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="portal-upload-progress">
            <div className="portal-upload-progress-label">
              <span className="portal-upload-spinner" />
              <span>Saving…</span>
            </div>
          </div>
        )
      ) : (
        <button type="submit" className="btn btn-primary btn-sm">
          {uploadType === 'youtube' ? 'Add Video' : 'Upload File'}
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

  const icon = f.file_type === 'pdf' ? '📄'
    : f.file_type === 'audio' ? '🎵'
    : f.file_type === 'image' ? '🖼️'
    : f.file_type === 'youtube' ? '▶️'
    : '🎬';

  const canExpand = f.file_type === 'pdf' || f.file_type === 'image' || f.file_type === 'youtube';
  const expandLabel = expanded ? 'Close' : f.file_type === 'youtube' ? 'Play' : 'View';

  return (
    <div className="portal-file-item">
      <div className="portal-file-meta">
        <span className="portal-file-icon">{icon}</span>
        <span className="portal-file-name">{f.title}</span>
      </div>
      <div className="portal-file-actions">
        {canExpand && (
          <button className="portal-action-btn" onClick={() => setExpanded((v) => !v)}>
            {expandLabel}
          </button>
        )}
        {f.file_type !== 'youtube' && (
          <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="portal-action-btn portal-action-dl">
            Download
          </a>
        )}
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
      {f.file_type === 'youtube' && expanded && (
        <div className="portal-youtube-embed">
          <iframe
            src={f.file_url}
            title={f.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="portal-youtube-iframe"
          />
        </div>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const recordings = subjectFiles.filter((f) => f.file_type === 'audio' || f.file_type === 'video' || f.file_type === 'youtube');

  return (
    <>
      <div className="portal-header">
        <div className="portal-header-inner container">
          <div className="portal-header-brand">
            <button
              className={`portal-hamburger${sidebarOpen ? ' open' : ''}`}
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <span className="portal-hamburger-line" />
              <span className="portal-hamburger-line" />
              <span className="portal-hamburger-line" />
            </button>
            <div>
              <div className="portal-logo-arabic">إدارة جعفرية</div>
              <h2 className="portal-heading">Student Portal</h2>
              <p className="portal-subheading">Idarah-e-Jafaria Melbourne Hawza</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Log Out</button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="portal-layout">
          {sidebarOpen && (
            <div className="portal-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          )}
          {/* ── Sidebar ── */}
          <aside className={`portal-sidebar${sidebarOpen ? ' open' : ''}`}>
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
                                onClick={() => { setActiveSubject(s); setSidebarOpen(false); }}
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

            <button className="portal-view-header" onClick={() => setSidebarOpen(true)}>
              <span className="portal-view-week">Week {activeWeek}</span>
              <span className="portal-view-sep">›</span>
              <span className="portal-view-subject">
                {SUBJECT_META[activeSubject].icon} {activeSubject}
              </span>
              <span className="portal-view-nav-hint">☰</span>
            </button>

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
