import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  UserCheck, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  LogOut,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function Header({ 
  currentUser, // { role: 'admin' } or { role: 'driver', driver: {...} }
  onLogout,
  soundEnabled, 
  setSoundEnabled, 
  theme, 
  toggleTheme,
  onResetData 
}) {
  const isAdmin = currentUser?.role === 'admin';
  const driver = currentUser?.role === 'driver' ? currentUser.driver : null;

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>

        {/* Brand & Connection Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '10px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            <Truck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Jibly <span className="text-gradient">Express</span>
              </h1>
              <span className="badge badge-emerald pulse-badge">
                <Zap size={12} /> مباشر
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {isAdmin ? '👑 حساب المنسق الأدمين (تحكم كامل)' : `🏍️ حساب الليفرور: ${driver?.name}`}
            </p>
          </div>
        </div>

        {/* Logged in User Badge & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* User identity pill */}
          <div style={{
            background: isAdmin ? 'var(--amber-light)' : 'var(--primary-light)',
            color: isAdmin ? 'var(--amber)' : 'var(--primary)',
            border: `1px solid ${isAdmin ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            padding: '6px 14px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isAdmin ? <ShieldCheck size={16} /> : <UserCheck size={16} />}
            <span>{isAdmin ? 'الأدمين (المنسق)' : `${driver?.avatar || '🏍️'} ${driver?.name}`}</span>
          </div>

          {/* Sound Toggle */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
            style={{ color: soundEnabled ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={toggleTheme}
            title="تغيير المظهر"
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} />}
          </button>

          {/* Reset Data (Admin only) */}
          {isAdmin && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onResetData}
              title="إعادة تعيين البيانات"
              style={{ color: 'var(--text-muted)' }}
            >
              <RotateCcw size={16} />
            </button>
          )}

          {/* Logout Button */}
          <button
            className="btn btn-danger btn-sm"
            onClick={onLogout}
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
            <span>خروج</span>
          </button>

        </div>

      </div>

    </header>
  );
}
