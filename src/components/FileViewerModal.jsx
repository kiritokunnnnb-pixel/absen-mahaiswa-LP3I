import React from 'react';
import { X, Download, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const FileViewerModal = ({ fileProof, studentName, onClose }) => {
  if (!fileProof) return null;

  const isImage = fileProof.type?.startsWith('image/') || fileProof.dataUrl?.startsWith('data:image/');
  const isPdf = fileProof.type?.includes('pdf') || fileProof.dataUrl?.startsWith('data:application/pdf');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: isImage ? '700px' : '600px', padding: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isPdf ? <FileText color="var(--status-sakit)" size={20} /> : <ImageIcon color="var(--accent-secondary)" size={20} />}
              Bukti Kehadiran - {studentName}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
              {fileProof.name} ({(fileProof.size / 1024).toFixed(1)} KB)
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.6rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Viewer */}
        <div style={{ minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem', overflow: 'hidden' }}>
          {isImage ? (
            <img
              src={fileProof.dataUrl}
              alt={`Bukti ${studentName}`}
              style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-glass)' }}
            />
          ) : isPdf ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--status-sakit)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={36} />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Dokumen Bukti PDF</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.25rem' }}>
                File <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{fileProof.name}</span> siap diunduh atau dibuka di tab terpisah.
              </p>
              <a
                href={fileProof.dataUrl}
                target="_blank"
                rel="noreferrer"
                download={fileProof.name}
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-flex' }}
              >
                <Download size={16} /> Unduh / Buka Dokumen PDF
              </a>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Pratinjau tidak tersedia untuk tipe file ini.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            Status File: <strong style={{ color: 'var(--status-hadir)' }}>Valid & Terverifikasi</strong>
          </span>
          <a
            href={fileProof.dataUrl}
            download={fileProof.name}
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <Download size={15} /> Unduh File Bukti
          </a>
        </div>
      </div>
    </div>
  );
};
