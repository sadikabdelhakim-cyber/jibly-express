import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Moon, 
  Sun, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle, 
  Ban, 
  Save, 
  Wallet,
  Clock
} from 'lucide-react';

export default function AdminSettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings, 
  drivers, 
  onUpdateDriverStatus,
  onUpdateDriverCapitalLimit 
}) {
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' | 'pricing'

  const [dayFee, setDayFee] = useState(settings.dayDeliveryFee || 25);
  const [nightFee, setNightFee] = useState(settings.nightDeliveryFee || 35);
  const [nightStartHour, setNightStartHour] = useState(settings.nightStartHour || 20);

  if (!isOpen) return null;

  const handleSavePricing = (e) => {
    e.preventDefault();
    onUpdateSettings({
      dayDeliveryFee: Number(dayFee),
      nightDeliveryFee: Number(nightFee),
      nightStartHour: Number(nightStartHour)
    });
    alert('تم حفظ إعدادات تسعير التوصيل بنجاح!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--amber-light)', color: 'var(--amber)', padding: '10px', borderRadius: '12px' }}>
              <Settings size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>إعدادات المنظومة (حساب الأدمين)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                إدارة أوقات وتثمنة التوصيل وتحديد صلاحيات ورأس مال ليفرور
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'drivers' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('drivers')}
          >
            <Users size={16} />
            <span>إدارة ليفرور ورأس المال</span>
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'pricing' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => setActiveTab('pricing')}
          >
            <DollarSign size={16} />
            <span>تسعيرة التوصيل (النهار والليل)</span>
          </button>
        </div>

        {/* TAB 1: DRIVERS MANAGEMENT & CAPITAL LIMITS */}
        {activeTab === 'drivers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              هنا تفعيل أو تجميد حساب أي ليفرور، وتحديد السقف اليومي لـ رأس المال المخصص له:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {drivers.map(drv => {
                const isActive = drv.status !== 'موقوف';

                return (
                  <div key={drv.id} style={{
                    background: 'var(--bg-input)',
                    border: `1px solid ${isActive ? 'var(--border-color)' : 'rgba(244, 63, 94, 0.4)'}`,
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    {/* Driver Identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{drv.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{drv.name}</span>
                          <span className={`badge ${isActive ? 'badge-emerald' : 'badge-rose'}`}>
                            {isActive ? 'نشيط' : 'موقوف مؤقتاً'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {drv.vehicle} | هاتف: {drv.phone}
                        </div>
                      </div>
                    </div>

                    {/* Capital Limit Input & Status Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      
                      {/* Daily Capital Budget Limit Input */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '4px 8px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <Wallet size={14} style={{ color: 'var(--amber)' }} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>سقف رأس المال:</span>
                        <input
                          type="number"
                          className="input-field"
                          style={{ width: '85px', padding: '4px 6px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}
                          value={drv.dailyCapitalLimit || 1000}
                          onChange={(e) => onUpdateDriverCapitalLimit(drv.id, Number(e.target.value))}
                          min="0"
                          step="100"
                        />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>DH</span>
                      </div>

                      {/* Toggle Active / Suspended Button */}
                      <button
                        className={`btn btn-sm ${isActive ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => onUpdateDriverStatus(drv.id, isActive ? 'موقوف' : 'نشيط')}
                      >
                        {isActive ? (
                          <><Ban size={14} /> <span>توقيف الحساب</span></>
                        ) : (
                          <><CheckCircle size={14} /> <span>تفعيل الحساب</span></>
                        )}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DAY & NIGHT PRICING SETTINGS */}
        {activeTab === 'pricing' && (
          <form onSubmit={handleSavePricing} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '16px'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} style={{ color: 'var(--amber)' }} /> تحديد ثمن التوصيل الافتراضي التلقائي:
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                
                {/* Day Rate */}
                <div className="input-group">
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sun size={16} style={{ color: '#fbbf24' }} /> ثمن التوصيل بالنهار (DH):
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ fontSize: '1.1rem', fontWeight: 700 }}
                    value={dayFee}
                    onChange={(e) => setDayFee(e.target.value)}
                    min="0"
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>يُطبق تلقائياً في الساعات النهارية</span>
                </div>

                {/* Night Rate */}
                <div className="input-group">
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Moon size={16} style={{ color: '#38bdf8' }} /> ثمن التوصيل بالليل (DH):
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ fontSize: '1.1rem', fontWeight: 700 }}
                    value={nightFee}
                    onChange={(e) => setNightFee(e.target.value)}
                    min="0"
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>يُطبق تلقائياً في الساعات الليلية</span>
                </div>

              </div>

              {/* Night Hour Threshold */}
              <div className="input-group" style={{ marginTop: '10px' }}>
                <label className="input-label">ساعة بداية التوقيت الليلي (من 0 إلى 23):</label>
                <select
                  className="input-field"
                  value={nightStartHour}
                  onChange={(e) => setNightStartHour(e.target.value)}
                >
                  <option value="19">7:00 مساءً (19:00)</option>
                  <option value="20">8:00 مساءً (20:00) - افتراضي</option>
                  <option value="21">9:00 مساءً (21:00)</option>
                  <option value="22">10:00 مساءً (22:00)</option>
                </select>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
              <button type="submit" className="btn btn-amber">
                <Save size={18} />
                <span>حفظ التغييرات والتسعيرة</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
