import React from 'react';
import { Printer, X, ShieldCheck, Calendar, DollarSign, User } from 'lucide-react';

export default function PrintReportModal({ isOpen, onClose, orders, drivers, activeDriverFilter = null }) {
  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Filter delivered orders
  const filteredOrders = orders.filter(o => {
    if (o.status !== 'delivered') return false;
    if (activeDriverFilter && activeDriverFilter !== 'all') {
      return o.claimedBy?.id === activeDriverFilter;
    }
    return true;
  });

  const totalCapital = filteredOrders.reduce((sum, o) => sum + (o.actualCapital || 0), 0);
  const totalFees = filteredOrders.reduce((sum, o) => sum + (o.actualDeliveryFee || 0), 0);
  const totalCollected = filteredOrders.reduce((sum, o) => sum + (o.totalCollected || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        
        {/* Controls header (hidden when printing) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>🧾 التقرير المالي والسطوريك اليومي</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>طباعة / حفظ PDF</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printable-area" style={{ background: '#fff', color: '#000', padding: '24px', borderRadius: '12px', direction: 'rtl', fontFamily: 'sans-serif' }}>
          
          {/* Header invoice info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '12px', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', margin: 0 }}>
                تقرير فريق ليفرور - Jibly Express
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0 0' }}>
                كشف الحساب المالي والطلبيات المسلمة اليوم
              </p>
            </div>
            <div style={{ textAlign: 'left', fontSize: '0.85rem', color: '#334155' }}>
              <div><strong>التاريخ:</strong> {todayStr}</div>
              <div><strong>الساعة:</strong> {new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {/* Summary Box Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '64748b' }}>عدد الطلبيات المسلمة</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{filteredOrders.length}</div>
            </div>
            <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px', border: '1px solid #fcd34d' }}>
              <div style={{ fontSize: '0.75rem', color: '#92400e' }}>إجمالي رأس المال كاش</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b45309' }}>{totalCapital} DH</div>
            </div>
            <div style={{ background: '#d1fae5', padding: '10px', borderRadius: '8px', border: '1px solid #6ee7b7' }}>
              <div style={{ fontSize: '0.75rem', color: '#065f46' }}>إجمالي أرباح التوصيل</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857' }}>{totalFees} DH</div>
            </div>
            <div style={{ background: '#e0f2fe', padding: '10px', borderRadius: '8px', border: '1px solid #7dd3fc' }}>
              <div style={{ fontSize: '0.75rem', color: '#075985' }}>المجموع الكلي المستلم</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0369a1' }}>{totalCollected} DH</div>
            </div>
          </div>

          {/* Orders Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '8px', textAlign: 'right' }}>الرقم</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>الزبون والعنوان</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>الليفرور</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>رأس المال</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>تمن التوصيل</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>المجموع المقبوض</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                    لا توجد طلبيات مسلمة في هاته الفئة
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o, idx) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px', fontWeight: 700 }}>#{o.id}</td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.address}</div>
                    </td>
                    <td style={{ padding: '8px' }}>
                      {o.claimedBy?.name || 'غير محدد'}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', fontWeight: 600, color: '#b45309' }}>
                      {o.actualCapital || 0} DH
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', fontWeight: 600, color: '#047857' }}>
                      {o.actualDeliveryFee || 0} DH
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: '#0369a1' }}>
                      {o.totalCollected || 0} DH
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer signature line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed #cbd5e1', fontSize: '0.8rem', color: '#475569' }}>
            <div>توقيع المنسق / الأدمين: ...........................</div>
            <div>توقيع الليفرور المكلف: ...........................</div>
          </div>

        </div>

      </div>
    </div>
  );
}
