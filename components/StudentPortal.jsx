'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentPortal() {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPdf, setExpandedPdf] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/portal/files')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setFiles(data.files);
          if (data.files.length > 0) {
            const f = data.files[0];
            setActiveTab(`${f.lesson_number}-${f.subject}`);
          }
        }
        setLoading(false);
      });
  }, []);

  async function handleLogout() {
    await fetch('/api/student/logout', { method: 'POST' });
    router.refresh();
  }

  // Build ordered tab list from files
  const tabs = [];
  const seen = new Set();
  for (const f of files) {
    const key = `${f.lesson_number}-${f.subject}`;
    if (!seen.has(key)) {
      seen.add(key);
      tabs.push({ key, lessonNumber: f.lesson_number, subject: f.subject });
    }
  }

  const tabFiles = files.filter(
    (f) => `${f.lesson_number}-${f.subject}` === activeTab
  );
  const notes = tabFiles.filter((f) => f.file_type === 'pdf');
  const recordings = tabFiles.filter(
    (f) => f.file_type === 'audio' || f.file_type === 'video'
  );

  return (
    <>
      <div className="portal-header">
        <div className="portal-header-inner container">
          <div>
            <div className="portal-logo-arabic">إدارة جعفرية</div>
            <h2 className="portal-heading">Student Portal</h2>
            <p className="portal-subheading">Idarah-e-Jafaria Melbourne Hawza</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            Log Out
          </button>
        </div>
      </div>

      <div className="portal-body container">
        {loading ? (
          <div className="portal-loading">Loading your materials…</div>
        ) : tabs.length === 0 ? (
          <div className="portal-empty">
            <p>No lesson materials have been uploaded yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="portal-tabs-wrap">
              <div className="portal-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`portal-tab${activeTab === tab.key ? ' active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setExpandedPdf(null);
                    }}
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
                      <div key={f.id} className="portal-file-item">
                        <div className="portal-file-meta">
                          <span className="portal-file-icon">📄</span>
                          <span className="portal-file-name">{f.title}</span>
                        </div>
                        <div className="portal-file-actions">
                          <button
                            className="portal-action-btn"
                            onClick={() =>
                              setExpandedPdf(expandedPdf === f.id ? null : f.id)
                            }
                          >
                            {expandedPdf === f.id ? 'Close' : 'View'}
                          </button>
                          <a
                            href={f.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portal-action-btn portal-action-dl"
                          >
                            Download
                          </a>
                        </div>
                        {expandedPdf === f.id && (
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recordings.length > 0 && (
                <div className="portal-section">
                  <h3 className="portal-section-title">Recordings</h3>
                  <div className="portal-files-list">
                    {recordings.map((f) => (
                      <div key={f.id} className="portal-file-item portal-recording">
                        <div className="portal-file-meta">
                          <span className="portal-file-icon">
                            {f.file_type === 'audio' ? '🎵' : '🎬'}
                          </span>
                          <span className="portal-file-name">{f.title}</span>
                        </div>
                        {f.file_type === 'audio' ? (
                          <audio
                            controls
                            src={f.file_url}
                            preload="none"
                            className="portal-audio"
                          >
                            Your browser does not support audio playback.
                          </audio>
                        ) : (
                          <video
                            controls
                            src={f.file_url}
                            preload="none"
                            className="portal-video"
                          >
                            Your browser does not support video playback.
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tabFiles.length === 0 && (
                <div className="portal-empty">
                  No files have been uploaded for this lesson yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
