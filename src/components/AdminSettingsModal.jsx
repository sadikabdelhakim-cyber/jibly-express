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
  Clock,
  PlusCircle,
  UserPlus,
  X,
  Phone,
  Bike
} from 'lucide-react';

export default function AdminSettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings, 
  drivers, 
  onUpdateDriverStatus,
  onUpdateDriverCapitalLimit,
  onAddDriver
}) {
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' | 'pricing'

  const [dayFee, setDayFee] = useState(settings.dayDeliveryFee || 25);
  const [nightFee, setNightFee] = useState(settings.nightDeliveryFee || 35);
  const [nightStartHour, setNightStartHour] = useState(settings.nightStartHour || 20);

  // Add driver form state
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverVehicle, setNewDriverVehicle] = useState('موتور C90');
  const [newDriverPlate, setNewDriverPlate] = useState('');
  const [newDriverCapitalLimit, setNewDriverCapitalLimit] = useState(1000);

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

  const getVehicleAvatar = (vehicle) => {
    if (vehicle.includes('طوموبيل') || vehicle.includes('سيارة')) return '🚗';
    if (vehicle.includes('SH') || vehicle.includes('سكوتر')) return '🛵';
    if (vehicle.includes('Vélo') || vehicle.includes('دراجة')) return '🚲';
    return '🏍️';
  };

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!newDriverName.trim()) return;
    
    if (onAddDriver) {
      onAddDriver({
        name: newDriverName.trim(),
        phone: newDriverPhone.trim() || '0600000000',
        vehicle: newDriverVehicle,
        vehiclePlate: newDriverPlate.trim(),
        nationalId: '',
        avatar: getVehicleAvatar(newDriverVehicle),
        dailyCapitalLimit: Number(newDriverCapitalLimit) || 1000
      });
    }

    // Reset form
    setNewDriverName('');
    setNewDriverPhone('');
    setNewDriverVehicle('موتور C90');
    setNewDriverPlate('');
    setNewDriverCapitalLimit(1000);
    setShowAddDriverForm(false);
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

            {/* Header with Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1 }}>
                هنا تفعيل أو تجميد حساب أي ليفرور، وتحديد السقف اليومي لـ رأس المال المخصص له:
              </p>
              {onAddDriver && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowAddDriverForm(!showAddDriverForm)}
                >
                  {showAddDriverForm ? (
                    <><X size={14} /> <span>إلغاء</span></>
                  ) : (
                    <><UserPlus size={16} /> <span>+ إضافة ليفرور جديد</span></>
                  )}
                </button>
              )}
            </div>

            {/* Add Driver Form (inline) */}
            {showAddDriverForm && onAddDriver && (
              <form onSubmit={handleAddDriver} style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '18px',
                animation: 'fadeInUp 0.3s ease-out'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={18} style={{ color: 'var(--primary)' }} />
                  تسجيل ليفرور جديد في الفريق
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group" style={{ marginBottom: '8px' }}>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>الاسم الكامل *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="مثال: يوسف الزهواني"
                      value={newDriverName}
                      onChange={(e) => setNewDriverName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: '8px' }}>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>رقم الهاتف</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="0661234567"
                      value={newDriverPhone}
                      onChange={(e) => setNewDriverPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="input-group" style={{ marginBottom: '8px' }}>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>وسيلة التنقل</label>
                    <select
                      className="input-field"
                      value={newDriverVehicle}
                      onChange={(e) => setNewDriverVehicle(e.target.value)}
                    >
                      <option value="موتور C90">🏍️ موتور C90</option>
                      <option value="موتور SH">🛵 موتور SH</option>
                      <option value="طوموبيل Picanto">🚗 طوموبيل</option>
                      <option value="Vélo كهربائي">🚲 Vélo كهربائي</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: '8px' }}>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>رقم اللوحة (اختياري)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="A-12345"
                      value={newDriverPlate}
                      onChange={(e) => setNewDriverPlate(e.target.value)}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: '8px' }}>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>سقف رأس المال (DH)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={newDriverCapitalLimit}
                      onChange={(e) => setNewDriverCapitalLimit(e.target.value)}
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddDriverForm(false)}>
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ minWidth: '140px' }}>
                    <PlusCircle size={16} />
                    <span>إضافة الليفرور</span>
                  </button>
                </div>
              </form>
            )}

            {/* Drivers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {drivers.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '32px', 
                  color: 'var(--text-muted)',
                  background: 'var(--bg-input)',
                  borderRadius: '14px'
                }}>
                  <Users size={36} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.9rem' }}>لا يوجد ليفرور مسجل حالياً في الفريق</p>
                  {onAddDriver && (
                    <button 
                      className="btn btn-primary btn-sm" 
                      style={{ marginTop: '12px' }}
                      onClick={() => setShowAddDriverForm(true)}
                    >
                      <UserPlus size={16} />
                      <span>أضف أول ليفرور</span>
                    </button>
                  )}
                </div>
              ) : (
                drivers.map(drv => {
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
                })
              )}
            </div>

            {/* Driver count summary */}
            {drivers.length > 0 && (
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-muted)', 
                textAlign: 'center',
                padding: '8px',
                borderTop: '1px solid var(--border-color)'
              }}>
                إجمالي: {drivers.length} ليفرور — {drivers.filter(d => d.status !== 'موقوف').length} نشيط — {drivers.filter(d => d.status === 'موقوف').length} موقوف
              </div>
            )}
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
