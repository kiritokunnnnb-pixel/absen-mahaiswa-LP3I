import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);

  if (!isOpen) return null;

  const correctPassword = 'akademik23993'; 

  const handleLogin = () => {
    if (password === correctPassword) {
      setError('');
      onLoginSuccess();
      setPassword('');
    } else {
      setError('Password admin tidak valid');
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isShake ? 'error-shake' : ''}`} style={{ maxWidth: '420px', padding: '2rem', borderTop: '4px solid var(--lp3i-teal)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              background: 'var(--lp3i-teal-light)',
              color: 'var(--lp3i-teal-dark)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              border: '2px solid var(--lp3i-teal)'
            }}>
            <ShieldCheck size={36} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Autentikasi Akses Admin</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Politeknik LP3I Jakarta Kampus Depok</p>
        </div>

        {/* Password input */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Masukkan password admin"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            className="form-input"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Error alert */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              marginBottom: '0.85rem',
              fontWeight: 600
            }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Action button */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 1, padding: '0.6rem' }}
            onClick={handleLogin}
          >
            <Sparkles size={15} /> Login Admin
          </button>
        </div>
      </div>
    </div>
  );
};
