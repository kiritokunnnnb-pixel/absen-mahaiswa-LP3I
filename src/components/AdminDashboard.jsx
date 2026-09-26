import React, { useState } from 'react';
import { AttendanceTable } from './AttendanceTable';
import { Users, CheckCircle2, AlertCircle, Clock, RefreshCw, ShieldCheck, Printer, Award, Calendar } from 'lucide-react';
const prodiCodeMap = {
  AB: 'AB 18131',
  KA: 'KA 18231',
  HM: 'HM 18331',
  MI: 'MI 18431',
  ABI: 'ABI 18541',
  BD: 'BD 18641',
};

export const AdminDashboard = ({ records, onDeleteRecord, onViewFile, onResetData, onRefreshData }) => {
  const [selectedMeeting, setSelectedMeeting] = useState('ALL');
  const [selectedProdi, setSelectedProdi] = useState('ALL');

  const meetings = ['ALL', 'Meeting 1', 'Meeting 2', 'Meeting 3', 'Meeting 4', 'Meeting 5', 'Meeting 6', 'Meeting 7'];

  // Filter records based on selected meeting and prodi
  const safeRecords = Array.isArray(records) ? records : [];
  let meetingRecords = selectedMeeting === 'ALL'
    ? safeRecords
    : safeRecords.filter(r => !r.meeting || r.meeting === selectedMeeting);

  meetingRecords = selectedProdi === 'ALL'
    ? meetingRecords
    : meetingRecords.filter(r => {
        if (!r.kelas) return false;
        return r.kelas === selectedProdi || prodiCodeMap[r.kelas] === selectedProdi || selectedProdi.startsWith(r.kelas);
      });

  const totalStudents = meetingRecords.length;
  const hadirCount = meetingRecords.filter(r => r.status === 'Hadir').length;
  const sakitCount = meetingRecords.filter(r => r.status === 'Sakit').length;
  const izinCount = meetingRecords.filter(r => r.status === 'Izin').length;

  const hadirPercentage = totalStudents ? Math.round((hadirCount / totalStudents) * 100) : 0;
  const fileProofCount = meetingRecords.filter(r => r.fileProof).length;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Dashboard Top Header */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Rekap Kehadiran Mahasiswa</h2>
            <span style={{ background: 'var(--lp3i-teal-light)', color: 'var(--lp3i-teal-dark)', fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '4px', border: '1px solid var(--lp3i-teal)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={13} /> Mode Admin
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Pantau statistik per meeting, validasi bukti lampiran, dan cetak laporan presensi.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onRefreshData && (
            <button className="btn-secondary" onClick={onRefreshData} title="Perbarui Data dari Supabase Cloud">
              <RefreshCw size={15} /> Refresh Data
            </button>
          )}
          <button className="btn-primary" onClick={handlePrintReport} title="Cetak Rekapan PDF / Print">
            <Printer size={15} /> Cetak Laporan PDF
          </button>
        </div>
      </div>

      {/* Meeting Selector Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--lp3i-teal)' }}>
          <Calendar size={16} /> Filter Rekap Meeting:
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {meetings.map(m => (
            <button
              key={m}
              type="button"
              className="btn-secondary"
              onClick={() => setSelectedMeeting(m)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: selectedMeeting === m ? 700 : 500,
                borderColor: selectedMeeting === m ? 'var(--lp3i-teal)' : 'var(--border-glass)',
                background: selectedMeeting === m ? 'var(--lp3i-teal)' : 'transparent',
                color: selectedMeeting === m ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              {m === 'ALL' ? 'Semua Meeting' : m}
            </button>
          ))}
        </div>
      </div>
      {/* Prodi Selector Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--lp3i-teal)' }}>
          <Calendar size={16} /> Filter Prodi:
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', ...Object.keys(prodiCodeMap).map(k => prodiCodeMap[k])].map(p => (
            <button
              key={p}
              type="button"
              className="btn-secondary"
              onClick={() => setSelectedProdi(p)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: selectedProdi === p ? 700 : 500,
                borderColor: selectedProdi === p ? 'var(--lp3i-teal)' : 'var(--border-glass)',
                background: selectedProdi === p ? 'var(--lp3i-teal)' : 'transparent',
                color: selectedProdi === p ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Total Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', fontWeight: 600 }}>TOTAL PRESENSI</span>
            <div style={{ background: 'var(--lp3i-teal-light)', color: 'var(--lp3i-teal-dark)', padding: '0.5rem', borderRadius: '50%' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {totalStudents} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-subtle)' }}>Mahasiswa</span>
          </div>
        </div>

        {/* Hadir Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--status-hadir)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--status-hadir)', fontSize: '0.85rem', fontWeight: 600 }}>HADIR</span>
            <div style={{ background: 'var(--status-hadir-bg)', color: 'var(--status-hadir)', padding: '0.5rem', borderRadius: '50%' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {hadirCount} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-subtle)' }}>({hadirPercentage}%)</span>
          </div>
        </div>

        {/* Sakit Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--status-sakit)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--status-sakit)', fontSize: '0.85rem', fontWeight: 600 }}>SAKIT</span>
            <div style={{ background: 'var(--status-sakit-bg)', color: 'var(--status-sakit)', padding: '0.5rem', borderRadius: '50%' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {sakitCount} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-subtle)' }}>({totalStudents ? Math.round((sakitCount / totalStudents) * 100) : 0}%)</span>
          </div>
        </div>

        {/* Izin Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--status-izin)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--status-izin)', fontSize: '0.85rem', fontWeight: 600 }}>IZIN</span>
            <div style={{ background: 'var(--status-izin-bg)', color: 'var(--status-izin)', padding: '0.5rem', borderRadius: '50%' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {izinCount} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-subtle)' }}>({totalStudents ? Math.round((izinCount / totalStudents) * 100) : 0}%)</span>
          </div>
        </div>
      </div>

      {/* Kehadiran Target & Progress Meter Card */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award size={18} style={{ color: 'var(--lp3i-teal)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Persentase Tingkat Kehadiran {selectedMeeting === 'ALL' ? 'Keseluruhan' : selectedMeeting}
            </span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: hadirPercentage >= 75 ? 'var(--status-hadir)' : 'var(--status-sakit)' }}>
            {hadirPercentage}% (Target Minimal: 75%)
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${hadirPercentage}%` }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>
          <span>Total {totalStudents} entri presensi {selectedMeeting !== 'ALL' ? `(${selectedMeeting})` : ''}</span>
          <span>{fileProofCount} entri memiliki lampiran bukti surat/dispen</span>
        </div>
      </div>

      {/* Attendance Table Panel */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <AttendanceTable
          records={meetingRecords}
          onDeleteRecord={onDeleteRecord}
          onViewFile={onViewFile}
          currentMeetingFilter={selectedMeeting}
          onMeetingFilterChange={setSelectedMeeting}
        />
      </div>
    </div>
  );
};

