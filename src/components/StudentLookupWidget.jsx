import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, Clock, FileText, Image as ImageIcon, Sparkles, UserCheck } from 'lucide-react';

export const StudentLookupWidget = ({ records, onViewFile }) => {
  const [searchNim, setSearchNim] = useState('');
  const [searchedRecords, setSearchedRecords] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchNim.trim()) {
      setSearchedRecords(null);
      return;
    }
    const matches = records.filter(
      r => r.nim.toLowerCase().includes(searchNim.trim().toLowerCase()) ||
           r.nama.toLowerCase().includes(searchNim.trim().toLowerCase())
    );
    setSearchedRecords(matches);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--lp3i-teal-light)', color: 'var(--lp3i-teal)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Cek Status & Riwayat Presensi Saya
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Masukkan NIM atau Nama Anda untuk melihat status catatan kehadiran.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Masukkan NIM Mahasiswa (contoh: 2201010045)..."
              value={searchNim}
              onChange={(e) => setSearchNim(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            <Search size={16} /> Cari Presensi
          </button>
        </form>
      </div>

      {/* Results View */}
      {searchedRecords !== null && (
        <div className="tab-content-anim">
          {searchedRecords.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <AlertCircle size={32} style={{ color: 'var(--lp3i-coral)', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Data Presensi Tidak Ditemukan</div>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Tidak ada data presensi yang sesuai dengan NIM "{searchNim}". Silakan isi formulir presensi jika belum.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Ditemukan {searchedRecords.length} Catatan Presensi:</span>
                <span style={{ color: 'var(--lp3i-teal)' }}>Politeknik LP3I Kampus Depok</span>
              </div>

              {searchedRecords.map(item => (
                <div key={item.id} className="glass-panel" style={{ padding: '1.25rem', borderLeft: `4px solid ${item.status === 'Hadir' ? '#10b981' : item.status === 'Sakit' ? '#ef4444' : '#f59e0b'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--lp3i-teal)', fontWeight: 700 }}>
                        {item.id}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                        {item.nama}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        NIM: {item.nim} • Kelas {item.kelas}
                      </div>
                    </div>
                    <span className={`badge ${item.status.toLowerCase()}`} style={{ padding: '0.4rem 0.8rem' }}>
                      {item.status === 'Hadir' && <CheckCircle2 size={13} />}
                      {item.status === 'Sakit' && <AlertCircle size={13} />}
                      {item.status === 'Izin' && <Clock size={13} />}
                      {item.status}
                    </span>
                  </div>

                  <div style={{ margin: '0.85rem 0', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.matakuliah || 'TOEIC Enrichment'} {item.meeting ? `(${item.meeting})` : ''}</div>
                    {item.catatan && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Catatan: {item.catatan}</div>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                    <span>🕒 {item.waktu ? new Date(item.waktu).toLocaleString('id-ID') : '-'}</span>
                    {item.fileProof && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onViewFile(item.fileProof, item.nama)}
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        {item.fileProof.type?.includes('pdf') ? <FileText size={13} /> : <ImageIcon size={13} />}
                        Lihat Bukti
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
