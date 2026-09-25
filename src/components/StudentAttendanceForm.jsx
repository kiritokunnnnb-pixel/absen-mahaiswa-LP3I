import React, { useState, useEffect } from 'react';
import { FileUploader } from './FileUploader';
import { User, CreditCard, BookOpen, Clock, CheckCircle2, AlertCircle, Send, Sparkles, Calendar } from 'lucide-react';

export const StudentAttendanceForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    kelas: '',
    matakuliah: 'TOEIC Enrichment',
    meeting: 'Meeting 1',
    status: 'Hadir', // Hadir | Sakit | Izin
    catatan: '',
    fileProof: null
  });

  // Mapping of program abbreviations to full class codes
  const prodiCodeMap = {
    AB: 'AB 18131',
    KA: 'KA 18231',
    HM: 'HM 18331',
    MI: 'MI 18431',
    ABI: 'ABI 18541',
    BD: 'BD 18641',
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const [showProdiAlert, setShowProdiAlert] = useState(false);

  const notifyProdiMissing = () => {
    setShowProdiAlert(true);
    setTimeout(() => setShowProdiAlert(false), 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'status' && value === 'Hadir' ? { catatan: '' } : {})
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Quick Preset Fillers for testing
  const handleApplyPreset = (type) => {
    if (type === 'hadir') {
      setFormData({
        nim: '2201010199',
        nama: 'Rian Hidayat',
        kelas: 'TI-3A',
        matakuliah: 'Pemrograman Web Lanjut',
        status: 'Hadir',
        catatan: 'Hadir di Ruang LKP-1 tepat waktu',
        fileProof: {
          name: 'Foto_Kehadiran_Rian.jpg',
          type: 'image/jpeg',
          size: 245000,
          dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230284c7'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-size='18' font-family='sans-serif'>FOTO BUKTI KEHADIRAN KELAS</text></svg>"
        }
      });
    } else if (type === 'sakit') {
      setFormData({
        nim: '2201010204',
        nama: 'Nadia Putri',
        kelas: 'TI-3A',
        matakuliah: 'Pemrograman Web Lanjut',
        status: 'Sakit',
        catatan: 'Demam flu tinggi, dirawat di rumah',
        fileProof: {
          name: 'Surat_Keterangan_Sakit_Nadia.pdf',
          type: 'application/pdf',
          size: 198000,
          dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><text x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='%23f43f5e' font-size='18' font-family='sans-serif'>SURAT DOKTER PUSKESMAS</text><text x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14' font-family='sans-serif'>Pasien: Nadia Putri (TI-3A)</text></svg>"
        }
      });
    } else if (type === 'izin') {
      setFormData({
        nim: '2201010311',
        nama: 'Andi Saputra',
        kelas: 'TI-3B',
        matakuliah: 'Basis Data Lanjut',
        status: 'Izin',
        catatan: 'Mengikuti Kompetisi Nasional AI & Software Dev',
        fileProof: {
          name: 'Dispensasi_Kompetisi_Andi.png',
          type: 'image/png',
          size: 420000,
          dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><text x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-size='18' font-family='sans-serif'>SURAT DISPENSASI LOMBA</text><text x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%23cbd5e1' font-size='14' font-family='sans-serif'>Kompetisi Nasional AI 2026</text></svg>"
        }
      });
    }
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nim.trim()) newErrors.nim = 'NIM mahasiswa wajib diisi';
    if (!formData.nama.trim()) newErrors.nama = 'Nama lengkap mahasiswa wajib diisi';
    if (!formData.kelas.trim()) newErrors.kelas = 'Prodi wajib dipilih';
    if (!formData.matakuliah.trim()) newErrors.matakuliah = 'Mata kuliah wajib diisi';

    if (formData.status === 'Hadir' && !formData.fileProof) {
      newErrors.fileProof = 'Unggah foto / file bukti kehadiran wajib untuk peserta Hadir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const submissionId = `ABS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const recordPayload = {
      id: submissionId,
      ...formData,
      waktu: new Date().toISOString()
    };

    try {
      await onSubmitSuccess(recordPayload);
      setSubmittedReceipt(recordPayload);
    } catch (err) {
      console.error("Form submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedReceipt(null);
    setFormData({
      nim: '',
      nama: '',
      kelas: '',
      matakuliah: 'TOEIC Enrichment',
      meeting: 'Meeting 1',
      status: 'Hadir',
      catatan: '',
      fileProof: null
    });
    setErrors({});
    setCopiedId(false);
  };

  const handleCopyId = () => {
    if (submittedReceipt?.id) {
      navigator.clipboard.writeText(submittedReceipt.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 3000);
    }
  };

  // Success View after attendance submission
  if (submittedReceipt) {
    return (
      <div style={{ maxWidth: '600px', margin: '1.5rem auto' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '2px solid #10b981' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Presensi Berhasil Dicatat!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Kehadiran atas nama <strong style={{ color: 'var(--text-main)' }}>{submittedReceipt.nama}</strong> ({submittedReceipt.nim}) untuk kelas <strong style={{ color: 'var(--text-main)' }}>{submittedReceipt.kelas} - {submittedReceipt.matakuliah} ({submittedReceipt.meeting || 'Meeting 1'})</strong> telah berhasil tersimpan di sistem presensi.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.75rem', border: '1px solid var(--border-glass)', display: 'inline-flex', gap: '1.5rem', textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>STATUS</div>
              <div style={{ fontWeight: 700, color: submittedReceipt.status === 'Hadir' ? '#10b981' : submittedReceipt.status === 'Sakit' ? '#ef4444' : '#f59e0b' }}>
                {submittedReceipt.status}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-glass)' }}></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>WAKTU</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {new Date(submittedReceipt.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </div>
            </div>
          </div>

          <div>
            <button className="btn-primary" onClick={handleResetForm} style={{ padding: '0.75rem 1.75rem' }}>
              <Sparkles size={16} /> Isi Presensi Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '680px', margin: '0 auto' }}>
      {/* Quick Fill Demo Chip Toolbar removed */}

      {/* Form Top Header */}
      <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Portal Presensi Mahasiswa</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
              Silakan isi formulir kehadiran perkuliahan tanpa perlu melakukan login.
            </p>
          </div>
          <div className="glass-card" style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
            <Clock size={16} />
            <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
          </div>
        </div>

        {/* Quick Active Class Selector Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', alignSelf: 'center' }}>Silahkan Memilih Prodi:</span>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              handleInputChange('kelas', prodiCodeMap['AB']);
              handleInputChange('matakuliah', 'Administrasi Bisnis');
              handleInputChange('nim', '');
              handleInputChange('nama', '');
              handleInputChange('status', 'Hadir');
              handleInputChange('catatan', '');
              handleInputChange('fileProof', null);
            }}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              borderColor: formData.matakuliah === 'Administrasi Bisnis' ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: formData.matakuliah === 'Administrasi Bisnis' ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
            }}
          >
            📚 Administrasi Bisnis (AB)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              handleInputChange('kelas', prodiCodeMap['KA']);
              handleInputChange('matakuliah', 'Komputerisasi Akuntansi');
              handleInputChange('nim', '');
              handleInputChange('nama', '');
              handleInputChange('status', 'Hadir');
              handleInputChange('catatan', '');
              handleInputChange('fileProof', null);
            }}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              borderColor: formData.matakuliah === 'Komputerisasi Akuntansi' ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: formData.matakuliah === 'Komputerisasi Akuntansi' ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
            }}
          >
            📚 Komputerisasi Akuntansi (KA)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              handleInputChange('kelas', prodiCodeMap['HM']);
              handleInputChange('matakuliah', 'Hubungan Masyarakat');
              handleInputChange('nim', '');
              handleInputChange('nama', '');
              handleInputChange('status', 'Hadir');
              handleInputChange('catatan', '');
              handleInputChange('fileProof', null);
            }}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              borderColor: formData.matakuliah === 'Hubungan Masyarakat' ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: formData.matakuliah === 'Hubungan Masyarakat' ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
            }}
          >
            📚 Hubungan Masyarakat (HM)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              handleInputChange('kelas', prodiCodeMap['MI']);
              handleInputChange('matakuliah', 'Manajemen Informatika');
              handleInputChange('nim', '');
              handleInputChange('nama', '');
              handleInputChange('status', 'Hadir');
              handleInputChange('catatan', '');
              handleInputChange('fileProof', null);
            }}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              borderColor: formData.matakuliah === 'Manajemen Informatika' ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: formData.matakuliah === 'Manajemen Informatika' ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
            }}
          >
            📚 Manajemen Informatika (MI)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              handleInputChange('kelas', prodiCodeMap['ABI']);
              handleInputChange('matakuliah', 'Administrasi Bisnis Internasional');
              handleInputChange('nim', '');
              handleInputChange('nama', '');
              handleInputChange('status', 'Hadir');
              handleInputChange('catatan', '');
              handleInputChange('fileProof', null);
            }}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              borderColor: formData.matakuliah === 'Administrasi Bisnis Internasional' ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: formData.matakuliah === 'Administrasi Bisnis Internasional' ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
            }}
          >
            📚 Administrasi Bisnis Internasional (ABI)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              handleInputChange('kelas', prodiCodeMap['BD']);
              handleInputChange('matakuliah', 'Bisnis Digital');
              handleInputChange('nim', '');
              handleInputChange('nama', '');
              handleInputChange('status', 'Hadir');
              handleInputChange('catatan', '');
              handleInputChange('fileProof', null);
            }}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              borderColor: formData.matakuliah === 'Bisnis Digital' ? 'var(--accent-primary)' : 'var(--border-glass)',
              background: formData.matakuliah === 'Bisnis Digital' ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
            }}
          >
            📚 Bisnis Digital (BD)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Row 1: NIM & Nama */}
        <div className="form-row-2col">
          <div className="form-group">
            <label className="form-label">
              <CreditCard size={15} /> NIM Mahasiswa <span style={{ color: 'var(--status-sakit)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: 2201010045"
              value={formData.nim}
              onChange={(e) => handleInputChange('nim', e.target.value)}
              disabled={!formData.kelas}
            />
            {errors.nim && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.nim}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <User size={15} /> Nama Lengkap <span style={{ color: 'var(--status-sakit)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              name="nama"
              placeholder="Nama lengkap mahasiswa"
              value={formData.nama}
              onChange={(e) => handleInputChange('nama', e.target.value)}
              disabled={!formData.kelas}
            />
            {errors.nama && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.nama}</span>}
          </div>
        </div>

        {/* Row 2: Kelas, Mata Kuliah (TOEIC Enrichment) & Pertemuan (Meeting 1-7) */}
        <div className="form-row-3col">
<div className="form-group">
  <label className="form-label">
    <BookOpen size={15} /> Kelas / Prodi <span style={{ color: 'var(--status-sakit)' }}>*</span>
  </label>
  <input
    type="text"
    className="form-input"
    placeholder="Pilih Prodi melalui tombol di atas"
    value={formData.kelas}
    readOnly
    disabled={!formData.kelas}
    style={{
      cursor: formData.kelas ? 'not-allowed' : 'default',
      opacity: formData.kelas ? 0.95 : 0.5,
      background: formData.kelas ? 'rgba(255, 255, 255, 0.05)' : 'var(--input-bg)',
      fontWeight: formData.kelas ? 600 : 'normal'
    }}
  />
</div>

          <div className="form-group">
            <label className="form-label">
              <BookOpen size={15} /> Program / Mata Kuliah
            </label>
            <input
              type="text"
              className="form-input"
              value="TOEIC Enrichment"
              disabled
              style={{ opacity: 0.95, cursor: 'not-allowed', background: 'rgba(255, 255, 255, 0.05)', fontWeight: 600 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={15} /> Pertemuan <span style={{ color: 'var(--status-sakit)' }}>*</span>
            </label>
            <select
              className="form-input"
              value={formData.meeting || 'Meeting 1'}
              onChange={(e) => handleInputChange('meeting', e.target.value)}
              style={{ cursor: 'pointer', background: 'var(--lp3i-navbar-navy)', color: '#ffffff', fontWeight: 600 }}
            >
              <option value="Meeting 1">Meeting 1</option>
              <option value="Meeting 2">Meeting 2</option>
              <option value="Meeting 3">Meeting 3</option>
              <option value="Meeting 4">Meeting 4</option>
              <option value="Meeting 5">Meeting 5</option>
              <option value="Meeting 6">Meeting 6</option>
              <option value="Meeting 7">Meeting 7</option>
            </select>
          </div>
        </div>

        {/* Status Selection Cards */}
        <div className="form-group" style={{ margin: '1rem 0 1.5rem' }}>
          <label className="form-label">
            Pilihan Status Kehadiran <span style={{ color: 'var(--status-sakit)' }}>*</span>
          </label>
          <div className="status-grid">
            {/* Hadir Card */}
            <div
              className={`status-card hadir ${formData.status === 'Hadir' ? 'selected' : ''}`}
              onClick={() => handleInputChange('status', 'Hadir')}
            >
              <div className="status-icon" style={{ background: 'var(--status-hadir-bg)', color: 'var(--status-hadir)' }}>
                <CheckCircle2 size={20} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Hadir</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Mengikuti Kelas</span>
            </div>

            {/* Sakit Card */}
            <div
              className={`status-card sakit ${formData.status === 'Sakit' ? 'selected' : ''}`}
              onClick={() => handleInputChange('status', 'Sakit')}
            >
              <div className="status-icon" style={{ background: 'var(--status-sakit-bg)', color: 'var(--status-sakit)' }}>
                <AlertCircle size={20} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sakit</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Dengan Surat Dokter</span>
            </div>

            {/* Izin Card */}
            <div
              className={`status-card izin ${formData.status === 'Izin' ? 'selected' : ''}`}
              onClick={() => handleInputChange('status', 'Izin')}
            >
              <div className="status-icon" style={{ background: 'var(--status-izin-bg)', color: 'var(--status-izin)' }}>
                <Clock size={20} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Izin</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Dispensasi / Hal Khusus</span>
            </div>
          </div>
        </div>

        {/* File Uploader */}
        <FileUploader
          file={formData.fileProof}
          onFileSelect={(fileObj) => handleInputChange('fileProof', fileObj)}
          onFileRemove={() => handleInputChange('fileProof', null)}
          isRequired={formData.status === 'Hadir'}
        />
        {errors.fileProof && (
          <div style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            {errors.fileProof}
          </div>
        )}

        {/* Catatan / Alasan (Hanya untuk Sakit / Izin) */}
        {formData.status !== 'Hadir' && (
          <div className="form-group">
            <label className="form-label">Catatan / Alasan</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder={`Tuliskan alasan ${formData.status.toLowerCase()} Anda secara jelas...`}
              value={formData.catatan}
              onChange={(e) => handleInputChange('catatan', e.target.value)}
            ></textarea>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Mengirim Presensi Kehadiran...</span>
          ) : (
            <>
              <Send size={18} /> Kirim Presensi Kehadiran
            </>
          )}
        </button>
      </form>
    </div>
  );
};

