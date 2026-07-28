import React from 'react';
import { 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Clock, 
  User, 
  CheckCircle, 
  Zap, 
  MessageSquare, 
  AlertTriangle,
  Navigation,
  Receipt
} from 'lucide-react';

export default function OrderCard({ 
  order, 
  activeRole, 
  activeDriver, 
  onClaimOrder, 
  onMarkDeliveredClick, 
  onCancelOrder,
  onOpenInvoiceModal
}) {
  const isAvailable = order.status === 'available';
  const isClaimed = order.status === 'claimed';
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  const isClaimedByMe = isClaimed && activeDriver && order.claimedBy?.id === activeDriver.id;

  const grandTotal = Number(order.sellingPrice || 0) + Number(order.deliveryFee || 0);

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMins = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    const hours = Math.floor(diffMins / 60);
    return `منذ ${hours} ساعة`;
  };

  const openDriverWhatsApp = (phone, customMsg) => {
    const cleaned = phone.replace(/\D/g, '');
    const formatted = cleaned.startsWith('0') ? '212' + cleaned.substring(1) : cleaned;
    const defaultMsg = customMsg || `السلام عليكم، أنا الليفرور راني وصلات طلبيتك وأنا دابا حدا الدار! 📍 (طلبية #${order.id})`;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(defaultMsg)}`, '_blank');
  };

  const openMaps = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div 
      className="glass-panel" 
      style={{
        padding: '18px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderLeft: isAvailable 
          ? '4px solid var(--primary)' 
          : isClaimed 
            ? '4px solid var(--amber)' 
            : isDelivered 
              ? '4px solid var(--cyan)' 
              : '4px solid var(--rose)'
      }}
    >
      {/* Top Bar: Order ID & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              #{order.id}
            </span>
            <span className={`badge ${isAvailable ? 'badge-emerald pulse-badge' : isClaimed ? 'badge-amber' : isDelivered ? 'badge-cyan' : 'badge-rose'}`}>
              {isAvailable && <><Zap size={12} /> طلبية جديدة - متوفرة</>}
              {isClaimed && <><Clock size={12} /> قيد التوصيل ({order.claimedBy?.name})</>}
              {isDelivered && <><CheckCircle size={12} /> تم التوصيل بنجاح</>}
              {isCancelled && <><AlertTriangle size={12} /> ملغاة</>}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <Clock size={12} />
            <span>نُشرت: {timeAgo(order.createdAt)}</span>
          </div>
        </div>

        {/* 3-Level Pricing Summary */}
        <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            السلعة: {order.sellingPrice} DH | التوصيل: +{order.deliveryFee} DH
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>
            المجموع: {grandTotal} DH
          </div>
        </div>

      </div>

      {/* Customer Info */}
      <div style={{
        background: 'var(--bg-input)',
        padding: '12px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
          <User size={15} style={{ color: 'var(--primary)' }} />
          <span>{order.customerName}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>({order.customerPhone})</span>
        </div>

        {/* Address ONLY (No Zone) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
          <MapPin size={15} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: '2px' }} />
          <span>{order.address}</span>
        </div>

        {/* Item List / Summary */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
          <ShoppingBag size={15} style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: '2px' }} />
          <span>
            {Array.isArray(order.itemList) && order.itemList.length > 0
              ? order.itemList.map(i => `${i.name} (${i.quantity}x)`).join(' + ')
              : order.items}
          </span>
        </div>
      </div>

      {/* Client Invoice PDF / WhatsApp Ticket Action */}
      <button
        className="btn btn-secondary btn-sm"
        style={{
          width: '100%',
          justify: 'center',
          borderColor: 'var(--primary)',
          color: 'var(--primary)',
          fontWeight: 700
        }}
        onClick={() => onOpenInvoiceModal && onOpenInvoiceModal(order)}
      >
        <Receipt size={16} />
        <span>🧾 معاينة وتنزيل فاتورة الزبون (PDF / WhatsApp)</span>
      </button>

      {/* Action Buttons Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        
        {/* DRIVER MODE ACTIONS */}
        {activeRole === 'driver' && (
          <>
            {isAvailable && (
              <button
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '1.05rem', padding: '12px' }}
                onClick={() => onClaimOrder(order.id)}
              >
                <Zap size={20} className="bounce-icon" />
                <span>سبق و أكسبتي الطلبية ({activeDriver?.name})</span>
              </button>
            )}

            {isClaimed && (
              <>
                <button
                  className="btn"
                  style={{
                    background: '#25D366',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '12px',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                  }}
                  onClick={() => openDriverWhatsApp(order.customerPhone)}
                >
                  <MessageSquare size={20} />
                  <span>💬 واتساب الزبون (أنا حدا الدار 📍)</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={`tel:${order.customerPhone}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Phone size={14} /> اتصل بالهاتف
                  </a>

                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openMaps(order.address)}>
                    <Navigation size={14} style={{ color: 'var(--amber)' }} /> الخريطة
                  </button>
                </div>

                {isClaimedByMe && (
                  <button
                    className="btn btn-amber"
                    style={{ width: '100%', marginTop: '4px', padding: '12px' }}
                    onClick={() => onMarkDeliveredClick(order)}
                  >
                    <CheckCircle size={18} />
                    <span>تأكيد التسليم وتحديد تمن التوصيل</span>
                  </button>
                )}
              </>
            )}
          </>
        )}

        {/* ADMIN MODE ACTIONS */}
        {activeRole === 'admin' && (
          <div style={{ display: 'flex', gap: '6px', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              <a href={`tel:${order.customerPhone}`} className="btn btn-secondary btn-sm" title="اتصال بالزبون">
                <Phone size={14} />
              </a>
              <button className="btn btn-secondary btn-sm" onClick={() => openDriverWhatsApp(order.customerPhone, `السلام عليكم، متابعة للطلبية #${order.id}`)} title="واتساب">
                <MessageSquare size={14} style={{ color: '#25D366' }} />
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => openMaps(order.address)} title="الخريطة">
                <MapPin size={14} style={{ color: 'var(--amber)' }} />
              </button>
            </div>

            {!isDelivered && !isCancelled && (
              <button className="btn btn-danger btn-sm" onClick={() => onCancelOrder(order.id)}>
                إلغاء الطلبية
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
