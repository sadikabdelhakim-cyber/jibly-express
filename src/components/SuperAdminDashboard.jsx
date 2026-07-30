import React, { useState } from 'react';
import {
  Building2,
  Users,
  UserCheck,
  UserX,
  Package,
  Activity,
  Plus,
  Search,
  Edit3,
  Trash2,
  LogIn,
  Power,
  PowerOff,
  TrendingUp,
  Clock,
  Crown,
  BarChart3,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { getPlatformStats, getTeamDrivers, getTeamOrders } from '../data/initialData';

export default function SuperAdminDashboard({
  teams,
  drivers,
  orders,
  onCreateTeam,
  onEditTeam,
  onDeleteTeam,
  onToggleTeamStatus,
  onLoginAsTeamAdmin,
  viewingAsTeam,
  onExitTeamView
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getPlatformStats(teams, drivers, orders);

  // Filtered teams by search
  const filteredTeams = teams.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.brandName || '').toLowerCase().includes(q) ||
      (t.city || '').toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-MA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Super Admin Welcome Banner */}
      <div className="glass-panel super-admin-gradient fade-in-up" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Crown size={28} style={{ color: '#a78bfa' }} />
            لوحة تحكم الأدمن العام
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            إدارة ومراقبة جميع الفرق والليفرورات والإحصائيات — Jibly Express Platform
          </p>
        </div>

        <button className="btn btn-purple" onClick={onCreateTeam}>
          <Plus size={18} />
          <span>إنشاء فريق جديد</span>
        </button>
      </div>

      {/* Platform Stats Grid */}
      <div className="stats-grid">

        <div className="stat-card stat-purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>عدد الفرق</span>
            <Building2 size={20} style={{ color: '#a78bfa' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#a78bfa', marginTop: '6px' }}>
            {stats.totalTeams}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {stats.activeTeams} نشط
          </div>
        </div>

        <div className="stat-card stat-emerald">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>عدد الليفرورات</span>
            <Users size={20} style={{ color: '#34d399' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399', marginTop: '6px' }}>
            {stats.totalDrivers}
          </div>
        </div>

        <div className="stat-card stat-cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>الليفرورات النشطين</span>
            <UserCheck size={20} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', marginTop: '6px' }}>
            {stats.activeDrivers}
          </div>
        </div>

        <div className="stat-card stat-rose">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>الليفرورات الموقوفين</span>
            <UserX size={20} style={{ color: '#fda4af' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fda4af', marginTop: '6px' }}>
            {stats.suspendedDrivers}
          </div>
        </div>

        <div className="stat-card stat-amber">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>عدد الطلبيات</span>
            <Package size={20} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24', marginTop: '6px' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {stats.deliveredOrders} مسلمة
          </div>
        </div>

        <div className="stat-card stat-emerald">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>الفرق النشطة</span>
            <Activity size={20} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', marginTop: '6px' }}>
            {stats.activeTeams}
          </div>
        </div>

      </div>

      {/* Top Performing Teams */}
      {stats.teamPerformance.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BarChart3 size={20} style={{ color: '#a78bfa' }} />
            <span>🏆 أفضل الفرق أداءً</span>
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>الترتيب</th>
                  <th style={{ padding: '10px' }}>الفريق</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>المدينة</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>عدد الليفرورات</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>الطلبيات المسلمة</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>إجمالي المداخيل</th>
                </tr>
              </thead>
              <tbody>
                {stats.teamPerformance.slice(0, 5).map((team, idx) => (
                  <tr key={team.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${idx === 0 ? 'badge-amber' : idx === 1 ? 'badge-cyan' : 'badge-emerald'}`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>
                      <span style={{ fontSize: '1.2rem', marginLeft: '6px' }}>{team.logo}</span>
                      {team.name}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>{team.city}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className="badge badge-emerald">{team.driverCount}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                      {team.deliveredCount}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: '#fbbf24' }}>
                      {team.totalRevenue} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teams Management Section */}
      <div>
        <div className="section-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={22} style={{ color: '#a78bfa' }} />
            إدارة الفرق ({teams.length})
          </h3>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="search-bar"
              placeholder="ابحث عن فريق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Building2 size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>لا توجد فرق مطابقة للبحث</p>
          </div>
        ) : (
          <div className="teams-grid">
            {filteredTeams.map(team => {
              const tDrivers = getTeamDrivers(team.id, drivers);
              const tOrders = getTeamOrders(team.id, orders);
              const tActiveDrivers = tDrivers.filter(d => d.status === 'نشيط');
              const tDelivered = tOrders.filter(o => o.status === 'delivered');
              const isActive = team.status === 'active';

              return (
                <div key={team.id} className={`team-card ${!isActive ? 'team-suspended' : ''}`}>

                  {/* Team Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <div style={{
                      fontSize: '2.2rem',
                      background: 'var(--bg-input)',
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {team.logo}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{team.name}</h4>
                        <span className={`status-dot ${isActive ? 'active' : 'suspended'}`} />
                        <span className={`badge ${isActive ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.72rem' }}>
                          {isActive ? 'نشط' : 'موقوف'}
                        </span>
                      </div>
                      {team.brandName && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{team.brandName}</div>
                      )}
                    </div>
                  </div>

                  {/* Team Info */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '0.82rem',
                    color: 'var(--text-light)',
                    marginBottom: '14px',
                    background: 'var(--bg-input)',
                    padding: '12px',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} style={{ color: 'var(--amber)' }} />
                      <span>{team.city || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} style={{ color: 'var(--primary)' }} />
                      <span>{team.phone || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} style={{ color: 'var(--cyan)' }} />
                      <span style={{ fontSize: '0.78rem' }}>{team.email || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.78rem' }}>{formatDate(team.createdAt)}</span>
                    </div>
                  </div>

                  {/* Team Mini Stats */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span className="badge badge-emerald">
                      <Users size={12} /> {tDrivers.length} ليفرور
                    </span>
                    <span className="badge badge-cyan">
                      <UserCheck size={12} /> {tActiveDrivers.length} نشط
                    </span>
                    <span className="badge badge-amber">
                      <Package size={12} /> {tOrders.length} طلبية
                    </span>
                    <span className="badge badge-purple">
                      <TrendingUp size={12} /> {tDelivered.length} مسلمة
                    </span>
                  </div>

                  {/* Team Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-purple btn-sm"
                      onClick={() => onLoginAsTeamAdmin(team.id)}
                      title="الدخول كأدمن الفريق"
                    >
                      <LogIn size={14} />
                      <span>دخول الفريق</span>
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEditTeam(team)}
                      title="تعديل الفريق"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      className={`btn btn-sm ${isActive ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => onToggleTeamStatus(team.id)}
                      title={isActive ? 'إيقاف الفريق' : 'تفعيل الفريق'}
                    >
                      {isActive ? <PowerOff size={14} /> : <Power size={14} />}
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDeleteTeam(team.id)}
                      title="حذف الفريق"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
