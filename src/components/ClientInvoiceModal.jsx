import React from 'react';
import { Printer, MessageSquare, X, Receipt, ShoppingBag, Phone, MapPin, User, CheckCircle } from 'lucide-react';

export default function ClientInvoiceModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const items = Array.isArray(order.itemList) && order.itemList.length > 0 
    ? order.itemList 
    : [{ id: '1', name: order.items || 'طلب خاص', quantity: 1, price: order.sellingPrice || 0 }];

  const itemsSubtotal = items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0) || (order.sellingPrice || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const grandTotal = itemsSubtotal + deliveryFee;

  const handlePrint = () => {
    window.print();
  };

  const sendWhatsAppInvoice = () => {
    const cleaned = (order.customerPhone || '').replace(/\D/g, '');
    const formattedPhone = cleaned.startsWith('0') ? '212' + cleaned.substring(1) : cleaned;

    let text = `🧾 *فاتورة الطلبية - Jibly Express*\n`;
    text += `-----------------------------------\n`;
    text += `👤 *الزبون:* ${order.customerName}\n`;
    text += `📍 *العنوان:* ${order.address}\n`;
    text += `🔢 *رقم الطلبية:* #${order.id}\n\n`;
    text += `📦 *تفاصيل السلعة:* \n`;

    items.forEach((item, idx) => {
      const lineTotal = Number(item.price) * Number(item.quantity);
      text += `  ${idx + 1}. ${item.name} (${item.quantity}x) = ${lineTotal} DH\n`;
    });

    text += `-----------------------------------\n`;
    text += `💵 *مجموع الطلبية:* ${itemsSubtotal} DH\n`;
    text += `🛵 *ثمن التوصيل:* ${deliveryFee} DH\n`;
    text += `✅ *المجموع الإجمالي لي غاتخلص:* ${grandTotal} DH\n\n`;
    text += `شكراً لثقتكم بنا! 🙏✨`;

    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        
        {/* Controls Header (hidden during print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
              <Receipt size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>🧾 فاتورة وتيكي الزبون</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>طباعة / PDF</span>
            </button>
            <button className="btn" style={{ background: '#25D366', color: '#fff', fontSize: '0.85rem' }} onClick={sendWhatsAppInvoice}>
              <MessageSquare size={16} />
              <span>إرسال للواتساب</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Ticket / Invoice Document */}
        <div id="printable-area" style={{
          background: '#ffffff',
          color: '#1e293b',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          direction: 'rtl',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🚀 Jibly Express
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
                خدمة التوصيل السريع والموثوق
              </p>
            </div>
            <div style={{ textAlign: 'left', background: '#f8fafc', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>وصل طلبية #{order.id}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {new Date(order.createdAt || Date.now()).toLocaleDateString('ar-MA')}
              </div>
            </div>
          </div>

          {/* Customer Info Section */}
          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} style={{ color: '#059669' }} />
                <span><strong>الزبون:</strong> {order.customerName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} style={{ color: '#059669' }} />
                <span><strong>الهاتف:</strong> {order.customerPhone}</span>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <MapPin size={15} style={{ color: '#d97706', marginTop: '3px', flexShrink: 0 }} />
                <span><strong>العنوان:</strong> {order.address}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '10px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingBag size={16} style={{ color: '#059669' }} /> تفاصيل السلع المطلوبة:
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>
                <th style={{ padding: '10px', textAlign: 'right' }}>السلعة / المنتج</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>الكمية</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>الثمن الفردي</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>المجموع</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{item.price} DH</td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700 }}>
                    {Number(item.price) * Number(item.quantity)} DH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing Breakdown Card */}
          <div style={{
            background: '#f0fdf4',
            border: '1.5px solid #86efac',
            borderRadius: '14px',
            padding: '16px',
            marginTop: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#166534' }}>
              <span>مجموع السلع والطلبية:</span>
              <span style={{ fontWeight: 700 }}>{itemsSubtotal} DH</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', color: '#166534' }}>
              <span>ثمن التوصيل:</span>
              <span style={{ fontWeight: 700 }}>+{deliveryFee} DH</span>
            </div>
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              borderTop: '2px dashed #bbf7d0',
              paddingTop: '10px',
              fontSize: '1.2rem',
              fontWeight: 900,
              color: '#15803d'
            }}>
              <span>المجموع الإجمالي الواجب دفعه:</span>
              <span style={{ fontSize: '1.4rem', color: '#047857' }}>{grandTotal} DH</span>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '0.8rem' }}>
            نتمنى لكم يوماً طيباً - شكراً لتعاملكم معنا! ✨
          </div>
        </div>

      </div>
    </div>
  );
}
