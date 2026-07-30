import React, { useState, useEffect } from 'react';
import { CheckCircle2, DollarSign, Wallet, Check } from 'lucide-react';

const CUSTOMER_RATINGS = [
  { value: 1, emoji: '😡', label: 'مشكل كبير', color: '#ef4444' },
  { value: 2, emoji: '😕', label: 'مشكل صغير', color: '#f97316' },
  { value: 3, emoji: '😐', label: 'عادي', color: '#eab308' },
  { value: 4, emoji: '😊', label: 'مزيان', color: '#22c55e' },
  { value: 5, emoji: '⭐', label: 'ممتاز VIP', color: '#a78bfa' }
];

export default function MarkDeliveredModal({ isOpen, onClose, order, onConfirmDelivered }) {
  const [actualCapital, setActualCapital] = useState(0);
  const [actualDeliveryFee, setActualDeliveryFee] = useState(25);
  const [notes, setNotes] = useState('');
  const [customerRating, setCustomerRating] = useState(3); // default: عادي

  useEffect(() => {
    if (order) {
      setActualCapital(order.estimatedCapital || order.sellingPrice || 0);
      setActualDeliveryFee(order.deliveryFee || 25);
      setCustomerRating(3);
      setNotes('');
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const totalCollected = Number(actualCapital) + Number(actualDeliveryFee);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmDelivered(order.id, {
      actualCapital: Number(actualCapital),
      actualDeliveryFee: Number(actualDeliveryFee),
      totalCollected,
      paymentMethod: 'cash',
      driverNotes: notes,
      customerRating: customerRating
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '14px',
            borderRadius: '50%',
            marginBottom: '10px'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>تأكيد تسليم الطلبية #{order.id}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            الزبون: {order.customerName} | {order.address}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            
            {/* Capital Input */}
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><Wallet size={14} /> رأس المال المصروف (كاش خرج من جيبك):</span>
                <span style={{ color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 700 }}>كاش 💵</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="input-field"
                  style={{ fontSize: '1.1rem', fontWeight: 700, paddingLeft: '40px' }}
                  value={actualCapital}
                  onChange={(e) => setActualCapital(Number(e.target.value))}
                  min="0"
                  required
                />
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                  DH
                </span>
              </div>
            </div>

            {/* Delivery Fee Input */}
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><DollarSign size={14} /> ثمن التوصيل الاصلي (ربحك كاش):</span>
                <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700 }}>كاش 💵</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="input-field"
                  style={{ fontSize: '1.1rem', fontWeight: 700, paddingLeft: '40px' }}
                  value={actualDeliveryFee}
                  onChange={(e) => setActualDeliveryFee(Number(e.target.value))}
                  min="0"
                  required
                />
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                  DH
                </span>
              </div>
            </div>

            {/* Total Received Summary Box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
              border: '1.5px solid var(--primary)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
              marginTop: '10px'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
                المجموع الكلي المقبوض كاش من عند الزبون:
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                {totalCollected} درهم (كاش 💵)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                ({actualCapital} DH رأس مال + {actualDeliveryFee} DH توصيل)
              </div>
            </div>

          </div>

          {/* Customer Rating Section */}
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <label className="input-label" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📝 كيفاش كان الزبون؟ (اختياري)
            </label>
            <div style={{
              display: 'flex',
              gap: '6px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {CUSTOMER_RATINGS.map(r => {
                const isSelected = customerRating === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setCustomerRating(r.value)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      border: isSelected ? `2px solid ${r.color}` : '2px solid transparent',
                      background: isSelected ? `${r.color}20` : 'var(--bg-card)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isSelected ? `0 4px 12px ${r.color}40` : 'none',
                      minWidth: '68px'
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{r.emoji}</span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? r.color : 'var(--text-muted)',
                      whiteSpace: 'nowrap'
                    }}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {customerRating <= 2 && (
              <div style={{
                marginTop: '10px',
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                fontSize: '0.78rem',
                color: '#fca5a5'
              }}>
                ⚠️ هاد التقييم غايتسجل عند الأدمين باش يميز الزبائن المشكلين
              </div>
            )}
          </div>

          {/* Optional Note */}
          <div className="input-group">
            <label className="input-label">ملاحظة إضافية (اختياري):</label>
            <input
              type="text"
              className="input-field"
              placeholder="مثال: الزبون عطاني تيب 10 درهم زيادة"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              <Check size={20} />
              <span>تأكيد وتسجيل التسليم (كاش)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
