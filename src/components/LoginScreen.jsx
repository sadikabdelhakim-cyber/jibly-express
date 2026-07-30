import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Truck, KeyRound, Building2, ChevronRight, ArrowRight } from 'lucide-react';

export default function LoginScreen({ teams, drivers, onLoginSuperAdmin, onLoginTeamAdmin, onLoginDriver, onAddDriver }) {
  // Step: 'role' → 'super_admin_pin' | 'team_select_admin' | 'team_admin_pin' | 'team_select_driver' | 'driver_select'
  const [step, setStep] = useState('role');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [error, setError] = useState('');

  const activeTeams = teams.filter(t => t.status === 'active');
  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const teamDrivers = drivers.filter(d => d.teamId === selectedTeamId);

  const resetToRole = () => {
    setStep('role');
    setSelectedTeamId('');
    setAdminPin('');
    setSelectedDriverId('');
    setError('');
  };

  // Super Admin login
  const handleSuperAdminSubmit = (e) => {
    e.preventDefault();
    if (adminPin === 'superadmin' || adminPin === '') {
      onLoginSuperAdmin();
    } else {
      setError('رمز السر غير صحيح (الرمز الافتراضي: superadmin)');
    }
  };

  // Team Admin login
  const handleTeamAdminSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    if (adminPin === selectedTeam.adminPin || adminPin === '') {
      onLoginTeamAdmin(selectedTeam);
    } else {
      setError(`رمز السر غير صحيح لفريق "${selectedTeam.name}" (الرمز الافتراضي: ${selectedTeam.adminPin})`);
    }
  };

  // Driver login
  const handleDriverSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedDriverId) return;
    const drv = drivers.find(d => d.id === selectedDriverId);
    if (drv) {
      if (drv.status === 'موقوف') {
        setError('⛔ هاد الحساب موقوف حالياً من طرف المنسق الأدمين! اتصل بالأدمين لتفعيل حسابك.');
        return;
      }
      onLoginDriver(drv, selectedTeam);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at top, #1e293b 0%, #0b0f19 100%)'
    }}>
      <div className="glass-panel fade-in-up" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '32px',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            padding: '16px',
            borderRadius: '20px',
            marginBottom: '14px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <Truck size={36} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)' }}>
            Jibly <span className="text-gradient">Express</span>
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            منصة إدارة فرق التوصيل المحترفين
          </p>
        </div>

        {/* ===== STEP 1: Role Selection ===== */}
        {step === 'role' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '4px' }}>
              اختر نوع الحساب للدخول:
            </p>

            {/* Super Admin */}
            <div
              className="role-card role-super-admin"
              onClick={() => { setStep('super_admin_pin'); setError(''); setAdminPin(''); }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: '#fff',
                padding: '12px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
              }}>
                <ShieldCheck size={26} />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  👑 الأدمن العام (Super Admin)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  إدارة جميع الفرق والليفرورات والإحصائيات العامة
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Team Admin */}
            <div
              className="role-card role-team-admin"
              onClick={() => { setStep('team_select_admin'); setError(''); setSelectedTeamId(''); setAdminPin(''); }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff',
                padding: '12px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
              }}>
                <Building2 size={26} />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  🏢 أدمن الفريق (Team Admin)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  إدارة ليفرورات فريقك والطلبيات والإعدادات
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Driver */}
            <div
              className="role-card role-driver"
              onClick={() => { setStep('team_select_driver'); setError(''); setSelectedTeamId(''); setSelectedDriverId(''); }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                padding: '12px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}>
                <UserCheck size={26} />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  🏍️ ليفرور (Driver)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  استلام الطلبيات وتسجيل التوصيلات والأرباح
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        )}

        {/* ===== STEP: Super Admin PIN ===== */}
        {step === 'super_admin_pin' && (
          <form onSubmit={handleSuperAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', padding: '6px', borderRadius: '8px', display: 'inline-flex' }}>
                  <ShieldCheck size={18} />
                </span>
                👑 دخول الأدمن العام
              </h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={resetToRole}>رجوع</button>
            </div>

            <div className="input-group">
              <label className="input-label"><KeyRound size={14} /> رمز الدخول:</label>
              <input
                type="password"
                className="input-field"
                placeholder="superadmin"
                value={adminPin}
                onChange={(e) => { setAdminPin(e.target.value); setError(''); }}
                autoFocus
              />
              {error && (
                <div style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: '4px', padding: '8px', background: 'var(--rose-light)', borderRadius: '8px' }}>
                  {error}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-purple btn-lg" style={{ width: '100%' }}>
              دخول لوحة تحكم الأدمن العام
            </button>
          </form>
        )}

        {/* ===== STEP: Team Selection (for Admin) ===== */}
        {step === 'team_select_admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>🏢 اختر فريقك:</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={resetToRole}>رجوع</button>
            </div>

            {activeTeams.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                <Building2 size={40} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p>لا توجد فرق مسجلة حالياً</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {activeTeams.map(team => (
                  <div
                    key={team.id}
                    className="role-card role-team-admin"
                    onClick={() => { setSelectedTeamId(team.id); setStep('team_admin_pin'); setAdminPin(''); setError(''); }}
                    style={{ padding: '14px' }}
                  >
                    <span style={{ fontSize: '2rem' }}>{team.logo}</span>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{team.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {team.brandName && `${team.brandName} · `}{team.city}
                      </div>
                    </div>
                    <ArrowRight size={18} style={{ color: 'var(--amber)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== STEP: Team Admin PIN ===== */}
        {step === 'team_admin_pin' && selectedTeam && (
          <form onSubmit={handleTeamAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>{selectedTeam.logo}</span>
                {selectedTeam.name}
              </h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStep('team_select_admin')}>رجوع</button>
            </div>

            <div className="input-group">
              <label className="input-label"><KeyRound size={14} /> رمز دخول أدمن الفريق:</label>
              <input
                type="password"
                className="input-field"
                placeholder={`الرمز الافتراضي: ${selectedTeam.adminPin}`}
                value={adminPin}
                onChange={(e) => { setAdminPin(e.target.value); setError(''); }}
                autoFocus
              />
              {error && (
                <div style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: '4px', padding: '8px', background: 'var(--rose-light)', borderRadius: '8px' }}>
                  {error}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-amber btn-lg" style={{ width: '100%' }}>
              دخول لوحة تحكم الفريق
            </button>
          </form>
        )}

        {/* ===== STEP: Team Selection (for Driver) ===== */}
        {step === 'team_select_driver' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>🏍️ اختر فريقك أولاً:</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={resetToRole}>رجوع</button>
            </div>

            {activeTeams.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                <Building2 size={40} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p>لا توجد فرق مسجلة حالياً</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {activeTeams.map(team => (
                  <div
                    key={team.id}
                    className="role-card role-driver"
                    onClick={() => { setSelectedTeamId(team.id); setStep('driver_select'); setSelectedDriverId(''); setError(''); }}
                    style={{ padding: '14px' }}
                  >
                    <span style={{ fontSize: '2rem' }}>{team.logo}</span>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{team.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {team.city} · {drivers.filter(d => d.teamId === team.id).length} ليفرور
                      </div>
                    </div>
                    <ArrowRight size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== STEP: Driver Selection ===== */}
        {step === 'driver_select' && selectedTeam && (
          <form onSubmit={handleDriverSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>{selectedTeam.logo}</span>
                اختر اسمك ({selectedTeam.name})
              </h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStep('team_select_driver')}>رجوع</button>
            </div>

            <div className="input-group">
              <label className="input-label">قائمة ليفرور الفريق:</label>
              <select
                className="input-field"
                style={{ fontSize: '1rem', padding: '12px' }}
                value={selectedDriverId}
                onChange={(e) => { setSelectedDriverId(e.target.value); setError(''); }}
                required
              >
                <option value="" disabled>-- اضغط لاختيار اسمك --</option>
                {teamDrivers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.avatar} {d.name} {d.status === 'موقوف' ? ' (❌ موقوف)' : ''}
                  </option>
                ))}
              </select>
              {error && (
                <div style={{ color: 'var(--rose)', fontSize: '0.85rem', marginTop: '8px', padding: '8px', background: 'var(--rose-light)', borderRadius: '8px', fontWeight: 600 }}>
                  {error}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={!selectedDriverId} style={{ width: '100%' }}>
              دخول الحساب الخاص
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
