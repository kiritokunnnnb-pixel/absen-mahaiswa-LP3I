import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentAttendanceForm } from './components/StudentAttendanceForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FileViewerModal } from './components/FileViewerModal';
import { Toast } from './components/Toast';
import { getAttendanceRecords, saveAttendanceRecord, deleteAttendanceRecord } from './utils/storage';
import { supabase } from './lib/supabase';
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
    // 1. Initial Load from Supabase Cloud DB
    getAttendanceRecords().then(data => setRecords(data)).catch(() => {});

    // 2. Realtime Subscriptions for Multi-device Lecturer & Admin Sync
    const channel = supabase
      .channel('attendance-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        () => {
          getAttendanceRecords().then(data => setRecords(data)).catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      showToast(err.message || 'Gagal menyimpan presensi ke cloud. Coba lagi.', 'error');
      throw err;
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
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.15)', background: 'var(--lp3i-navbar-navy)', padding: '1.75rem 2rem', textAlign: 'center', color: '#ffffff', fontSize: '0.85rem' }}>
        <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', letterSpacing: '0.01em' }}>
          Politeknik LP3I Jakarta Kampus Depok
        </p>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', margin: '4px 0' }}>
          Jl. Raya Bogor Km.38 No.56 Kel. Sukamaju Kec. Cilodong, Kota Depok.
        </p>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.6rem' }}>
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

