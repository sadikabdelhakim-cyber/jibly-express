import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Truck, PlusCircle, ArrowLeft, KeyRound, Ban } from 'lucide-react';

export default function LoginScreen({ drivers, onLoginAdmin, onLoginDriver, onAddDriver }) {
  const [selectedRole, setSelectedRole] = useState(null); // 'admin' | 'driver'
  const [adminPin, setAdminPin] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [adminError, setAdminError] = useState('');
  const [driverError, setDriverError] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverVehicle, setNewDriverVehicle] = useState('موتور C90');

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin === '' || adminPin === 'admin') {
      onLoginAdmin();
    } else {
      setAdminError('رمز السر غير صحيح (الرمز الافتراضي: 1234)');
    }
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    setDriverError('');
    if (!selectedDriverId) return;

    const drv = drivers.find(d => d.id === selectedDriverId);
    if (drv) {
      if (drv.status === 'موقوف') {
        setDriverError('⛔ هاد الحساب موقوف حالياً من طرف المنسق الأدمين! اتصل بالأدمين لتفعيل حسابك.');
        return;
      }
      onLoginDriver(drv);
    }
  };

  const handleCreateDriver = (e) => {
    e.preventDefault();
    if (!newDriverName.trim()) return;

    const newDrv = onAddDriver({
      name: newDriverName.trim(),
      phone: newDriverPhone.trim() || '0600000000',
      vehicle: newDriverVehicle,
      avatar: newDriverVehicle.includes('طوموبيل') ? '🚗' : '🏍️'
    });

    setNewDriverName('');
    setNewDriverPhone('');
    setShowAddModal(false);
    
    if (newDrv) {
      onLoginDriver(newDrv);
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
      <div className="glass-panel" style={{
        maxWidth: '480px',
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
            تسجيل الدخول للنظام (تنسيق الطلبيات والأرباح)
          </p>
        </div>

        {/* Selection Step */}
        {!selectedRole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-light)', fontSize: '0.95rem' }}>
              اختر نوع الحساب للدخول:
            </p>

            <button
              className="btn btn-secondary"
              style={{
                padding: '18px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '1.05rem',
                fontWeight: 700
              }}
              onClick={() => setSelectedRole('driver')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                  <UserCheck size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>دخول كـ ليفرور (Driver)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>استلام الطلبيات وتسجيل الأرباح</div>
                </div>
              </div>
            </button>

            <button
              className="btn btn-secondary"
              style={{
                padding: '18px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '1.05rem',
                fontWeight: 700
              }}
              onClick={() => setSelectedRole('admin')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--amber-light)', color: 'var(--amber)', padding: '10px', borderRadius: '12px' }}>
                  <ShieldCheck size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>دخول كـ منسق (الأدمين)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>مراقبة كافـة الفريق والإعدادات</div>
                </div>
              </div>
            </button>

          </div>
        )}

        {/* DRIVER LOGIN FORM */}
        {selectedRole === 'driver' && (
          <form onSubmit={handleDriverSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>🏍️ اختر اسم الحساب ديالك:</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedRole(null)}>رجوع</button>
            </div>

            <div className="input-group">
              <label className="input-label">قائمة ليفرور الفريق:</label>
              <select
                className="input-field"
                style={{ fontSize: '1rem', padding: '12px' }}
                value={selectedDriverId}
                onChange={(e) => {
                  setSelectedDriverId(e.target.value);
                  setDriverError('');
                }}
                required
              >
                <option value="" disabled>-- اضغط لاختيار اسمك --</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.avatar} {d.name} {d.status === 'موقوف' ? ' (❌ موقوف)' : ''}
                  </option>
                ))}
              </select>
              {driverError && (
                <div style={{ color: 'var(--rose)', fontSize: '0.85rem', marginTop: '8px', padding: '8px', background: 'var(--rose-light)', borderRadius: '8px', fontWeight: 600 }}>
                  {driverError}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={!selectedDriverId}>
              دخول الحساب الخاص
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddModal(true)}
              >
                <PlusCircle size={16} />
                <span>اسمك ماكاينش؟ اضغط لإضافة حساب جديد</span>
              </button>
            </div>
          </form>
        )}

        {/* ADMIN LOGIN FORM */}
        {selectedRole === 'admin' && (
          <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>👑 دخول المنسق (الأدمين):</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedRole(null)}>رجوع</button>
            </div>

            <div className="input-group">
              <label className="input-label"><KeyRound size={14} /> رمز الدخول (الرمز الافتراضي: 1234):</label>
              <input
                type="password"
                className="input-field"
                placeholder="1234"
                value={adminPin}
                onChange={(e) => {
                  setAdminPin(e.target.value);
                  setAdminError('');
                }}
                autoFocus
              />
              {adminError && (
                <div style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: '4px' }}>
                  {adminError}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-amber btn-lg">
              دخول لوحة تحكم الأدمين
            </button>
          </form>
        )}

        {/* Add Driver Sub-modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px' }}>➕ تسجيل حساب ليفرور جديد</h3>
              <form onSubmit={handleCreateDriver}>
                <div className="input-group">
                  <label className="input-label">الاسم الكامل:</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="مثال: يوسف الزهواني"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">رقم الهاتف:</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="0661234567"
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">وسيلة التنقل:</label>
                  <select
                    className="input-field"
                    value={newDriverVehicle}
                    onChange={(e) => setNewDriverVehicle(e.target.value)}
                  >
                    <option value="موتور C90">🏍️ موتور C90</option>
                    <option value="موتور SH">🛵 موتور SH</option>
                    <option value="طوموبيل Picanto">🚗 طوموبيل</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>حفظ والدخول</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
