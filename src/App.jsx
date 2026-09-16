import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentAttendanceForm } from './components/StudentAttendanceForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FileViewerModal } from './components/FileViewerModal';
import { Toast } from './components/Toast';
import { getAttendanceRecords, saveAttendanceRecord, deleteAttendanceRecord } from './utils/storage';
import { Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('STUDENT'); // 'STUDENT' | 'ADMIN'
  const [records, setRecords] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  
  // Modals & Toast State
  const [viewingFileProof, setViewingFileProof] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Load attendance records from Supabase
    getAttendanceRecords().then(data => setRecords(data));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Tab Switch
  const handleTabChange = (targetTab) => {
    if (targetTab === 'ADMIN') {
      if (isAdminAuthenticated) {
        setActiveTab('ADMIN');
      } else {
        setIsAdminLoginOpen(true);
      }
    } else {
      setActiveTab('STUDENT');
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setActiveTab('ADMIN');
    showToast('Berhasil masuk ke Mode Rekap Admin!', 'success');
  };

  const handleAttendanceSubmitSuccess = async (newRecord) => {
    try {
      const updated = await saveAttendanceRecord(newRecord);
      setRecords(updated);
      showToast(`Presensi an. ${newRecord.nama} berhasil dicatat!`, 'success');
    } catch (err) {
      showToast('Gagal menyimpan presensi. Coba lagi.', 'error');
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data presensi ini dari rekapan?')) {
      try {
        const updated = await deleteAttendanceRecord(id);
        setRecords(updated);
        showToast('Rekod data presensi berhasil dihapus', 'info');
      } catch (err) {
        showToast('Gagal menghapus data. Coba lagi.', 'error');
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset data presensi kembali ke data contoh awal? (Data yang baru diisi akan direset)')) {
      const reset = resetAttendanceData();
      setRecords(reset);
      showToast('Data presensi berhasil di-reset ke data demo awal', 'info');
    }
  };

  const handleViewFile = (fileProof, studentName) => {
    setViewingFileProof({ fileProof, studentName });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      {/* Hero Banner Teal Section matching official website */}
      <div className="hero-banner">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.18)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff', padding: '0.35rem 1.1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>
            <Sparkles size={14} style={{ color: 'var(--lp3i-coral)' }} /> TOEIC ENRICHMENT • OFFICIAL ATTENDANCE SYSTEM
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Politeknik LP3I Jakarta Kampus Depok
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '620px', margin: '0 auto' }}>
            Sistem resmi untuk mencatat dan memantau kehadiran peserta dalam kegiatan TOEIC ENRICHMENT
          </p>
        </div>
      </div>

      {/* Main Content Area with Smooth Slide & Fade Transition */}
      <main style={{ flex: 1, padding: '2rem 1.5rem 4rem', marginTop: '-2.5rem', zIndex: 2 }}>
        <div key={activeTab} className="tab-content-anim">
          {activeTab === 'STUDENT' ? (
            <StudentAttendanceForm onSubmitSuccess={handleAttendanceSubmitSuccess} />
          ) : (
            <AdminDashboard
              records={records}
              onDeleteRecord={handleDeleteRecord}
              onViewFile={handleViewFile}
              onResetData={handleResetData}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.2)', background: 'var(--lp3i-teal)', padding: '1.5rem 2rem', textAlign: 'center', color: '#e2e8f0', fontSize: '0.85rem' }}>
        <p style={{ color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
          Politeknik LP3I Jakarta Kampus Depok
        </p>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          Jl. Raya Bogor Km.38 No.56 Kel. Sukamaju Kec. Cilodong, Kota Depok.
        </p>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          &copy; {new Date().getFullYear()} Politeknik LP3I Jakarta Kampus Depok • Hak Cipta Dilindungi
        </p>
      </footer>

      {/* Admin Login Modal Gate */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* File Viewer Modal */}
      {viewingFileProof && (
        <FileViewerModal
          fileProof={viewingFileProof.fileProof}
          studentName={viewingFileProof.studentName}
          onClose={() => setViewingFileProof(null)}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;

