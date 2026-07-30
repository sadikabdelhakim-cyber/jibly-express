import React, { useState } from 'react';
import { 
  X, UserCheck, MessageSquare, Search, MapPin, AlertTriangle, Phone
} from 'lucide-react';

const RATING_DISPLAY = {
  1: { emoji: '😡', label: 'مشكل كبير', color: '#ef4444' },
  2: { emoji: '😕', label: 'مشكل صغير', color: '#f97316' },
  3: { emoji: '😐', label: 'عادي', color: '#eab308' },
  4: { emoji: '😊', label: 'مزيان', color: '#22c55e' },
  5: { emoji: '⭐', label: 'ممتاز VIP', color: '#a78bfa' }
};

export default function CustomerDatabaseModal({ isOpen, onClose, customers = [] }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Apply filters
  let filtered = [...customers];
  if (filter === 'problematic') {
    filtered = filtered.filter(c => c.averageRating != null && c.averageRating <= 2);
  } else if (filter === 'vip') {
    filtered = filtered.filter(c => c.averageRating != null && c.averageRating >= 4.5);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    );
  }

  filtered.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));

  const problematicCount = customers.filter(c => c.averageRating != null && c.averageRating <= 2).length;
  const vipCount = customers.filter(c => c.averageRating != null && c.averageRating >= 4.5).length;
  const totalSpent = customers.reduce((s, c) => s + (c.totalSpent || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', padding: '10px', borderRadius: '12px' }}>
              <UserCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>👥 قاعدة بيانات الزبائن</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {customers.length} زبون مسجل — {totalSpent} DH إجمالي المصروف
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="ابحث بالاسم أو الهاتف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingRight: '34px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
            >
              الكل ({customers.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'problematic' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setFilter('problematic')}
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
            >
              😡 مشكلين ({problematicCount})
            </button>
            <button
              className={`btn btn-sm ${filter === 'vip' ? 'btn-purple' : 'btn-secondary'}`}
              onClick={() => setFilter('vip')}
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
            >
              ⭐ VIP ({vipCount})
            </button>
          </div>
        </div>

        {/* Summary Badges */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.78rem' }}>
            👥 {customers.length} زبون
          </span>
          <span className="badge badge-rose" style={{ fontSize: '0.78rem' }}>
            😡 {problematicCount} مشكلين
          </span>
          <span className="badge badge-amber" style={{ fontSize: '0.78rem' }}>
            ⭐ {vipCount} VIP
          </span>
          <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
            💰 {totalSpent} DH إجمالي
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', maxHeight: '420px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                <th style={{ padding: '10px' }}>الزبون</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>الهاتف</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>الطلبيات</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>المصروف</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>التقييم</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {customers.length === 0 ? 'لا يوجد زبائن مسجلين بعد — غادي يتسجلو تلقائياً مع كل طلبية' : 'لا يوجد زبائن مطابقين للبحث'}
                  </td>
                </tr>
              ) : (
                filtered.slice(0, 100).map(cust => {
                  const rating = cust.averageRating;
                  const ratingKey = rating != null ? Math.round(rating) : null;
                  const ratingInfo = ratingKey && RATING_DISPLAY[ratingKey] ? RATING_DISPLAY[ratingKey] : null;
                  const isProblematic = rating != null && rating <= 2;

                  const cleanPhone = (cust.phone || '').replace(/\D/g, '');
                  const waPhone = cleanPhone.startsWith('0') ? '212' + cleanPhone.substring(1) : cleanPhone;

                  return (
                    <tr key={cust.id} style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: isProblematic ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                    }}>
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isProblematic && <AlertTriangle size={13} style={{ color: '#ef4444' }} />}
                          {cust.name}
                        </div>
                        {cust.address && (
                          <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={10} /> {cust.address.substring(0, 45)}{cust.address.length > 45 ? '...' : ''}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', fontSize: '0.82rem', direction: 'ltr' }}>
                        {cust.phone}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>{cust.orderCount || 0}</span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700, color: 'var(--amber)' }}>
                        {cust.totalSpent || 0} DH
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        {ratingInfo ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: `${ratingInfo.color}18`,
                            color: ratingInfo.color,
                            border: `1px solid ${ratingInfo.color}40`
                          }}>
                            <span style={{ fontSize: '1rem' }}>{ratingInfo.emoji}</span>
                            {rating.toFixed(1)}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#25D366', color: '#fff', padding: '4px 8px', fontSize: '0.72rem', borderRadius: '8px' }}
                            onClick={() => window.open(`https://wa.me/${waPhone}`, '_blank')}
                            title="واتساب"
                          >
                            <MessageSquare size={12} />
                          </button>
                          <a
                            href={`tel:${cust.phone}`}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.72rem', textDecoration: 'none' }}
                            title="اتصال"
                          >
                            <Phone size={12} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
