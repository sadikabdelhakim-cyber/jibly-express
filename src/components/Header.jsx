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
  RotateCcw,
  Crown,
  Building2,
  ArrowLeft
} from 'lucide-react';

export default function Header({ 
  currentUser,
  activeTeam,
  viewingAsTeamId,
  onLogout,
  onExitTeamView,
  soundEnabled, 
  setSoundEnabled, 
  theme, 
  toggleTheme,
  onResetData 
}) {
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isTeamAdmin = currentUser?.role === 'team_admin';
  const isDriver = currentUser?.role === 'driver';
  const driver = isDriver ? currentUser.driver : null;

  // Determine display info based on role
  const getRoleDisplay = () => {
    if (isSuperAdmin && !viewingAsTeamId) {
      return {
        label: '👑 الأدمن العام (Super Admin)',
        subtitle: 'تحكم كامل في جميع الفرق والليفرورات',
        badgeClass: 'badge-purple-header',
        badgeBg: 'rgba(139, 92, 246, 0.15)',
        badgeColor: '#a78bfa',
        badgeBorder: 'rgba(139, 92, 246, 0.3)',
        icon: <Crown size={16} />
      };
    }
    if (isSuperAdmin && viewingAsTeamId && activeTeam) {
      return {
        label: `🏢 ${activeTeam.logo} ${activeTeam.name}`,
        subtitle: `مشاهدة كأدمن الفريق — ${activeTeam.city || ''}`,
        badgeClass: 'badge-amber-header',
        badgeBg: 'var(--amber-light)',
        badgeColor: 'var(--amber)',
        badgeBorder: 'rgba(245, 158, 11, 0.3)',
        icon: <Building2 size={16} />
      };
    }
    if (isTeamAdmin && activeTeam) {
      return {
        label: `🏢 أدمن: ${activeTeam.name}`,
        subtitle: `${activeTeam.brandName || ''} ${activeTeam.city ? `· ${activeTeam.city}` : ''}`.trim(),
        badgeClass: 'badge-amber-header',
        badgeBg: 'var(--amber-light)',
        badgeColor: 'var(--amber)',
        badgeBorder: 'rgba(245, 158, 11, 0.3)',
        icon: <ShieldCheck size={16} />
      };
    }
    if (isDriver && driver) {
      return {
        label: `${driver.avatar || '🏍️'} ${driver.name}`,
        subtitle: activeTeam ? `فريق: ${activeTeam.name} · ${activeTeam.city || ''}` : 'ليفرور',
        badgeClass: 'badge-emerald-header',
        badgeBg: 'var(--primary-light)',
        badgeColor: 'var(--primary)',
        badgeBorder: 'rgba(16, 185, 129, 0.3)',
        icon: <UserCheck size={16} />
      };
    }
    return {
      label: 'مستخدم',
      subtitle: '',
      badgeBg: 'var(--bg-input)',
      badgeColor: 'var(--text-muted)',
      badgeBorder: 'var(--border-color)',
      icon: <UserCheck size={16} />
    };
  };

  const roleInfo = getRoleDisplay();
  const canManage = isSuperAdmin || isTeamAdmin;

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
            background: isSuperAdmin && !viewingAsTeamId 
              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '10px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: isSuperAdmin && !viewingAsTeamId 
              ? '0 4px 12px rgba(139, 92, 246, 0.4)'
              : '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            <Truck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Jibly <span className={isSuperAdmin && !viewingAsTeamId ? 'text-gradient-purple' : 'text-gradient'}>Express</span>
              </h1>
              <span className="badge badge-emerald pulse-badge">
                <Zap size={12} /> مباشر
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {roleInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Logged in User Badge & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* User identity pill */}
          <div style={{
            background: roleInfo.badgeBg,
            color: roleInfo.badgeColor,
            border: `1px solid ${roleInfo.badgeBorder}`,
            padding: '6px 14px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {roleInfo.icon}
            <span>{roleInfo.label}</span>
          </div>

          {/* Back to Super Admin button (when viewing a team) */}
          {isSuperAdmin && viewingAsTeamId && (
            <button 
              className="btn btn-purple btn-sm"
              onClick={onExitTeamView}
              title="الرجوع للأدمن العام"
            >
              <ArrowLeft size={16} />
              <span>الأدمن العام</span>
            </button>
          )}

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

          {/* Reset Data (Admin/SuperAdmin only) */}
          {canManage && (
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
