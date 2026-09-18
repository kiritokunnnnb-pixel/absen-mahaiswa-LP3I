import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle, Trash2, AlertCircle } from 'lucide-react';

export const FileUploader = ({ file, onFileSelect, onFileRemove, isRequired }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
  const MAX_SIZE_MB = 2;

  const processFile = (selectedFile) => {
    setErrorMsg('');
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setErrorMsg('Format file tidak didukung. Harap unggah file .JPG, .PNG, atau .PDF');
      return;
    }

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Ukuran file terlalu besar. Maksimum ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Convert file to Base64 for LocalStorage persistent storing & preview
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileSelect({
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        dataUrl: e.target.result
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        <UploadCloud size={16} />
        Bukti Kehadiran (Screenshoot Latihan / Surat Dokter / Izin)
        {isRequired ? <span style={{ color: 'var(--status-sakit)' }}>* (Wajib)</span> : <span style={{ color: 'var(--text-subtle)' }}>(Opsional)</span>}
      </label>

      {errorMsg && (
        <div style={{ color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <AlertCircle size={14} /> {errorMsg}
        </div>
      )}

      {!file ? (
        <div
          className={`dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept=".jpg,.jpeg,.png,.pdf"
            style={{ display: 'none' }}
          />

          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
            <UploadCloud size={32} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Klik atau geser file bukti ke sini
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Mendukung format: <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>JPG, PNG, PDF</span> (Maksimal 2MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="dropzone-file-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            {file.type.includes('pdf') ? (
              <div style={{ background: 'rgba(244, 63, 94, 0.2)', color: 'var(--status-sakit)', padding: '0.5rem', borderRadius: '8px' }}>
                <FileText size={24} />
              </div>
            ) : (
              <div style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-secondary)', padding: '0.5rem', borderRadius: '8px' }}>
                <ImageIcon size={24} />
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {file.name}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]?.toUpperCase()}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--status-hadir)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <CheckCircle size={16} /> Terunggah
            </span>
            <button
              type="button"
              className="btn-danger"
              onClick={onFileRemove}
              title="Hapus file"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
