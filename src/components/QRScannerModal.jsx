import React, { useState, useEffect } from 'react';
import { Camera, X, CheckCircle2, QrCode, Sparkles, RefreshCw } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCourse, setScannedCourse] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScannedCourse(null);
      // Simulate camera scanning delay
      const timer = setTimeout(() => {
        setIsScanning(false);
        setScannedCourse({
          kelas: 'TI-3A',
          matakuliah: 'Pemrograman Web Lanjut',
          dosen: 'Ir. Hendra Wijaya, M.Kom',
          ruangan: 'Lab Komputer LKP-2'
        });
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (scannedCourse) {
      onScanSuccess(scannedCourse);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '460px', padding: '1.75rem', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--lp3i-navbar-navy)' }}>
            <QrCode size={22} style={{ color: 'var(--lp3i-teal)' }} />
            <span>Simulasi Scan QR Sesi Perkuliahan</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder Camera Area */}
        <div
          style={{
            position: 'relative',
            height: '240px',
            background: '#091628',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '1rem 0',
            border: '2px solid var(--lp3i-teal)'
          }}
        >
          {isScanning ? (
            <>
              {/* Laser Scan Line */}
              <div className="bio-scan-line"></div>
              {/* Camera Frame Corners */}
              <div style={{ position: 'absolute', width: '160px', height: '160px', border: '2px dashed rgba(0, 150, 152, 0.8)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={36} style={{ color: 'var(--lp3i-teal)', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '15px', color: '#93c5fd', fontSize: '0.8rem', fontWeight: 600 }}>
                Arahkan Kamera ke QR Code Sesi Dosen...
              </div>
            </>
          ) : (
            <div style={{ padding: '1.5rem', color: '#ffffff' }}>
              <div style={{ background: '#059669', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <CheckCircle2 size={30} fill="#ffffff" color="#059669" />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>QR Code Berhasil Terdeteksi!</h4>
              <p style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '4px' }}>
                Sesi Matkul Ditemukan di TOEIC ENRICHMENT
              </p>
            </div>
          )}
        </div>

        {/* Scanned Details Card */}
        {scannedCourse && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', textAlign: 'left', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp3i-teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DETAIL SESI TERDETEKSI
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {scannedCourse.matakuliah} ({scannedCourse.kelas})
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              👨‍🏫 Dosen: {scannedCourse.dosen} • 📍 {scannedCourse.ruangan}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 1 }}
            disabled={isScanning}
            onClick={handleApply}
          >
            <Sparkles size={16} /> Isi Form Otomatis
          </button>
        </div>
      </div>
    </div>
  );
};
