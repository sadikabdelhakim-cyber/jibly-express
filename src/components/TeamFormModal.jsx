import React, { useState, useEffect } from 'react';
import { Building2, Save, Plus, X } from 'lucide-react';

const EMOJIS = ['🚚', '⚡', '🚀', '🦅', '🔥', '💎', '🌟', '🏎️', '🛵', '📦', '🎯', '🏍️', '🚗', '✈️', '🌙', '☀️'];

export default function TeamFormModal({ isOpen, onClose, team, onSubmit }) {
  const isEditing = Boolean(team);

  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [logo, setLogo] = useState('🚚');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [dayFee, setDayFee] = useState(25);
  const [nightFee, setNightFee] = useState(35);
  const [nightStartHour, setNightStartHour] = useState(20);

  // Reset form when modal opens or team changes
  useEffect(() => {
    if (isOpen) {
      setName(team?.name || '');
      setBrandName(team?.brandName || '');
      setLogo(team?.logo || '🚚');
      setCity(team?.city || '');
      setPhone(team?.phone || '');
      setEmail(team?.email || '');
      setAddress(team?.address || '');
      setAdminPin(team?.adminPin || '');
      setDayFee(team?.settings?.dayDeliveryFee ?? 25);
      setNightFee(team?.settings?.nightDeliveryFee ?? 35);
      setNightStartHour(team?.settings?.nightStartHour ?? 20);
    }
  }, [isOpen, team]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      brandName: brandName.trim(),
      logo,
      city: city.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      adminPin: adminPin.trim() || team?.adminPin || '0000',
      dayDeliveryFee: Number(dayFee),
      nightDeliveryFee: Number(nightFee),
      nightStartHour: Number(nightStartHour),
      nightEndHour: 6
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', padding: '10px', borderRadius: '12px' }}>
              <Building2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {isEditing ? `تعديل فريق: ${team.name}` : 'إنشاء فريق جديد'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isEditing ? 'تعديل بيانات وإعدادات الفريق' : 'أدخل بيانات الفريق لإضافته للمنصة'}
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Logo Emoji Picker */}
          <div className="input-group">
            <label className="input-label">شعار الفريق:</label>
            <div className="emoji-grid">
              {EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  className={`emoji-btn ${logo === em ? 'selected' : ''}`}
                  onClick={() => setLogo(em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label">اسم الفريق *</label>
              <input type="text" className="input-field" placeholder="مثال: فريق البرق" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">اسم البراند (اختياري)</label>
              <input type="text" className="input-field" placeholder="مثال: البرق Express" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label">المدينة</label>
              <input type="text" className="input-field" placeholder="مثال: الدار البيضاء" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">رقم الهاتف</label>
              <input type="text" className="input-field" placeholder="0522334455" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label">البريد الإلكتروني</label>
              <input type="email" className="input-field" placeholder="team@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">العنوان</label>
              <input type="text" className="input-field" placeholder="شارع ..." value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>

          {/* Admin PIN */}
          <div className="input-group" style={{
            background: 'var(--amber-light)',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <label className="input-label" style={{ color: 'var(--amber)' }}>🔑 رمز دخول أدمن الفريق (PIN)</label>
            <input type="text" className="input-field" placeholder={isEditing ? (team.adminPin || '0000') : '0000'} value={adminPin} onChange={(e) => setAdminPin(e.target.value)} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>سيستخدمه أدمن الفريق لتسجيل الدخول</span>
          </div>

          {/* Delivery Pricing */}
          <div style={{
            background: 'var(--bg-input)',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            marginBottom: '14px'
          }}>
            <label className="input-label" style={{ marginBottom: '10px', display: 'block' }}>⚙️ إعدادات تسعيرة التوصيل:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>☀️ النهار (DH)</label>
                <input type="number" className="input-field" value={dayFee} onChange={(e) => setDayFee(e.target.value)} min="0" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>🌙 الليل (DH)</label>
                <input type="number" className="input-field" value={nightFee} onChange={(e) => setNightFee(e.target.value)} min="0" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>بداية الليل</label>
                <select className="input-field" value={nightStartHour} onChange={(e) => setNightStartHour(e.target.value)}>
                  <option value="19">19:00</option>
                  <option value="20">20:00</option>
                  <option value="21">21:00</option>
                  <option value="22">22:00</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
            <button type="submit" className="btn btn-purple" style={{ minWidth: '160px' }}>
              {isEditing ? (
                <>
                  <Save size={18} />
                  <span>حفظ التغييرات</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>إنشاء الفريق</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
