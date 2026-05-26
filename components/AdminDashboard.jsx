'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PortalFileManager from '@/components/PortalFileManager';

export default function AdminDashboard({ enrollments }) {
  const [tab, setTab] = useState('enrollments');
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  }

  return (
    <div className="admin-dash">
      <div className="admin-header">
        <div>
          <div className="admin-logo-arabic">إدارة جعفرية</div>
          <h2>Admin Dashboard</h2>
          <p>Idarah-e-Jafaria Melbourne</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline btn-sm">Log Out</button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab${tab === 'enrollments' ? ' active' : ''}`}
          onClick={() => setTab('enrollments')}
        >
          Enrollments ({enrollments.length})
        </button>
        <button
          className={`admin-tab${tab === 'portal' ? ' active' : ''}`}
          onClick={() => setTab('portal')}
        >
          Student Portal Files
        </button>
      </div>

      {tab === 'enrollments' && (
        enrollments.length === 0 ? (
          <div className="admin-empty">
            <p>No enrollments yet. Registrations will appear here once submitted.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Programs</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {[...enrollments].reverse().map((e, i) => (
                  <tr key={e.id || i}>
                    <td>{enrollments.length - i}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(e.timestamp).toLocaleDateString('en-AU', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {e.first_name} {e.last_name}
                    </td>
                    <td>
                      <a href={`mailto:${e.email}`} style={{ color: 'var(--green-400)' }}>{e.email}</a>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <a href={`tel:${e.phone}`} style={{ color: 'var(--green-400)' }}>{e.phone}</a>
                    </td>
                    <td>{e.age}</td>
                    <td>{e.gender}</td>
                    <td>
                      {(Array.isArray(e.programs) ? e.programs : [e.programs])
                        .filter(Boolean)
                        .map((p, j) => (
                          <span key={j} className="admin-tag">{p}</span>
                        ))}
                    </td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: '200px' }}>
                      {e.message || <em style={{ opacity: 0.5 }}>none</em>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'portal' && <PortalFileManager />}
    </div>
  );
}
