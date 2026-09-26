import React, { useState } from 'react';
import { Search, Trash2, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react';

export const AttendanceTable = ({ records, onDeleteRecord, onViewFile, currentMeetingFilter = 'ALL', onMeetingFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
const [prodiFilter, setProdiFilter] = useState('ALL');
  const [verifiedMap, setVerifiedMap] = useState({});

  // Mapping of program abbreviations to their official codes
  const prodiCodeMap = {
    AB: 'AB 18131',
    KA: 'KA 18231',
    HM: 'HM 18331',
    MI: 'MI 18431',
    ABI: 'ABI 18541',
    BD: 'BD 18641',
  };

  // Toggle verification for a specific record
  const toggleVerification = (id) => {
    setVerifiedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter records
  const filteredRecords = (records || []).filter(item => {
    if (!item) return false;
    const matchesSearch =
      (item.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.nim || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.kelas || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.matakuliah || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.meeting || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || (item.status || '').toUpperCase() === statusFilter.toUpperCase();
    const matchesProdi = prodiFilter === 'ALL' ||
      item.kelas === prodiFilter ||
      prodiCodeMap[item.kelas] === prodiFilter ||
      (prodiFilter && item.kelas && prodiFilter.startsWith(item.kelas));

    return matchesSearch && matchesStatus && matchesProdi;
  });

  return (
    <div>
      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        {/* Search input */}
        <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.3rem', fontSize: '0.875rem' }}
            placeholder="Cari Nama, NIM, Kelas, atau Sesi Meeting..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Meeting Filter Dropdown */}
        {onMeetingFilterChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} style={{ color: 'var(--text-subtle)' }} />
            <select
              className="form-select"
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', width: 'auto', background: 'var(--lp3i-teal)', color: '#fff', fontWeight: 600 }}
              value={currentMeetingFilter}
              onChange={(e) => onMeetingFilterChange(e.target.value)}
            >
              <option value="ALL">Semua Sesi Meeting</option>
              <option value="Meeting 1">Meeting 1</option>
              <option value="Meeting 2">Meeting 2</option>
              <option value="Meeting 3">Meeting 3</option>
              <option value="Meeting 4">Meeting 4</option>
              <option value="Meeting 5">Meeting 5</option>
              <option value="Meeting 6">Meeting 6</option>
              <option value="Meeting 7">Meeting 7</option>
            </select>
          </div>
        )}

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn-secondary ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
            style={{
              borderColor: statusFilter === 'ALL' ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: statusFilter === 'ALL' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              fontSize: '0.8rem'
            }}
          >
            Semua ({records.length})
          </button>
          <button
            className="btn-secondary"
            onClick={() => setStatusFilter('HADIR')}
            style={{
              borderColor: statusFilter === 'HADIR' ? 'var(--status-hadir)' : 'var(--border-glass)',
              background: statusFilter === 'HADIR' ? 'var(--status-hadir-bg)' : 'transparent',
              color: statusFilter === 'HADIR' ? 'var(--status-hadir)' : 'var(--text-muted)',
              fontSize: '0.8rem'
            }}
          >
            Hadir ({records.filter(r => r.status === 'Hadir').length})
          </button>
          <button
            className="btn-secondary"
            onClick={() => setStatusFilter('SAKIT')}
            style={{
              borderColor: statusFilter === 'SAKIT' ? 'var(--status-sakit)' : 'var(--border-glass)',
              background: statusFilter === 'SAKIT' ? 'var(--status-sakit-bg)' : 'transparent',
              color: statusFilter === 'SAKIT' ? 'var(--status-sakit)' : 'var(--text-muted)',
              fontSize: '0.8rem'
            }}
          >
            Sakit ({records.filter(r => r.status === 'Sakit').length})
          </button>
          <button
            className="btn-secondary"
            onClick={() => setStatusFilter('IZIN')}
            style={{
              borderColor: statusFilter === 'IZIN' ? 'var(--status-izin)' : 'var(--border-glass)',
              background: statusFilter === 'IZIN' ? 'var(--status-izin-bg)' : 'transparent',
              color: statusFilter === 'IZIN' ? 'var(--status-izin)' : 'var(--text-muted)',
              fontSize: '0.8rem'
            }}
          >
            Izin ({records.filter(r => r.status === 'Izin').length})
          </button>
        </div>
      </div>

      {/* Table Component */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID Presensi</th>
              <th>Nama Mahasiswa</th>
              <th>NIM</th>
              <th>Kelas / Matkul</th>
              <th>Status</th>
              <th>Validasi Dokumen</th>
              <th>Waktu Presensi</th>
              <th>Bukti File</th>
              <th>Catatan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Tidak ada data rekapan kehadiran yang sesuai.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => {
                const isVerified = verifiedMap[item.id] ?? (item.status === 'Hadir');

                return (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                      {item.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.nama || '-'}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {item.nim || '-'}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.matakuliah || 'TOEIC Enrichment'} {item.meeting ? `(${item.meeting})` : ''}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{prodiCodeMap[item.kelas] || item.kelas}</div>
                    </td>
                    <td>
                      <span className={`badge ${item.status.toLowerCase()}`}>
                        {item.status === 'Hadir' && <CheckCircle2 size={12} />}
                        {item.status === 'Sakit' && <AlertCircle size={12} />}
                        {item.status === 'Izin' && <Clock size={12} />}
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() => toggleVerification(item.id)}
                        title="Klik untuk mengubah status verifikasi dokumen admin"
                        style={{
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.72rem',
                          borderColor: isVerified ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
                          background: isVerified ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: isVerified ? '#10b981' : '#f59e0b',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {isVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {isVerified ? 'Tervalidasi' : 'Perlu Validasi'}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.waktu ? new Date(item.waktu).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </td>
                    <td>
                      {item.fileProof ? (
                        <button
                          className="btn-secondary"
                          onClick={() => onViewFile(item.fileProof, item.nama)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--accent-secondary)', borderColor: 'rgba(6, 182, 212, 0.3)' }}
                        >
                          {item.fileProof.type?.includes('pdf') ? <FileText size={13} /> : <ImageIcon size={13} />}
                          Lihat Bukti
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>-</span>
                      )}
                    </td>
                    <td style={{ maxWidth: '180px', fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.catatan}>
                      {item.catatan || '-'}
                    </td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => onDeleteRecord(item.id)}
                        title="Hapus Rekod"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

