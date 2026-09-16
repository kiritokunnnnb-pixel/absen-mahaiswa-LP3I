import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Lock, Clock } from 'lucide-react';
import { LP3ILogo } from './LP3ILogo';

export const Navbar = ({ activeTab, onTabChange, isAdminAuthenticated }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LP3ILogo height={58} />
      </div>


      {/* Live Clock & Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#ffffff', background: 'rgba(0, 0, 0, 0.15)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
          <Clock size={14} />
          <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{timeStr}</span>
        </div>

        <div className="mode-toggle-group">
          <button
            className={`mode-btn ${activeTab === 'STUDENT' ? 'active' : ''}`}
            onClick={() => onTabChange('STUDENT')}
          >
            <UserCheck size={16} />
            Portal Mahasiswa
          </button>

          <button
            className={`mode-btn ${activeTab === 'ADMIN' ? 'active' : ''}`}
            onClick={() => onTabChange('ADMIN')}
          >
            {isAdminAuthenticated ? <ShieldCheck size={16} /> : <Lock size={16} />}
            Rekap Admin
          </button>
        </div>
      </div>
    </header>
  );
};

