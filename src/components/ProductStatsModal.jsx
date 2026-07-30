import React, { useState } from 'react';
import { X, BarChart3, ShoppingBag, TrendingUp, Search } from 'lucide-react';

export default function ProductStatsModal({ isOpen, onClose, orders }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Aggregate Product / Item Statistics
  const productStats = (() => {
    const statsMap = {};
    orders.forEach(order => {
      const items = Array.isArray(order.itemList) && order.itemList.length > 0
        ? order.itemList
        : [{ name: order.items || 'طلب عام', quantity: 1, price: order.sellingPrice || 0 }];

      items.forEach(item => {
        const name = (item.name || 'منتج غير محدد').trim();
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const revenue = qty * price;

        if (!statsMap[name]) {
          statsMap[name] = { name, orderCount: 0, totalQty: 0, totalRevenue: 0, unitPrice: price };
        }
        statsMap[name].orderCount += 1;
        statsMap[name].totalQty += qty;
        statsMap[name].totalRevenue += revenue;
      });
    });

    return Object.values(statsMap).sort((a, b) => b.totalQty - a.totalQty);
  })();

  const filtered = search.trim()
    ? productStats.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : productStats;

  const totalRevenue = productStats.reduce((s, p) => s + p.totalRevenue, 0);
  const totalQty = productStats.reduce((s, p) => s + p.totalQty, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', padding: '10px', borderRadius: '12px' }}>
              <BarChart3 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>📊 إحصائيات المنتجات الأكثر طلباً</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {productStats.length} منتج — {totalQty} قطعة مباعة — {totalRevenue} DH مدخول إجمالي
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingRight: '34px' }}
          />
        </div>

        {/* Summary Badges */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>
            📦 {productStats.length} منتج مختلف
          </span>
          <span className="badge badge-amber" style={{ fontSize: '0.78rem' }}>
            📈 {totalQty} قطعة مباعة
          </span>
          <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
            💰 {totalRevenue} DH مدخول
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', maxHeight: '420px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                <th style={{ padding: '10px' }}>المنتج / السلعة</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>الترتيب</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>إجمالي الكمية</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>عدد الطلبيات</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>إجمالي المدخول</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    لا توجد منتجات مطابقة
                  </td>
                </tr>
              ) : (
                filtered.map((prod, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShoppingBag size={16} style={{ color: 'var(--primary)' }} />
                      <span>{prod.name}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className={`badge ${idx === 0 ? 'badge-amber' : idx === 1 ? 'badge-cyan' : 'badge-emerald'}`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800 }}>
                      {prod.totalQty} قطعة
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {prod.orderCount} طلبية
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                      {prod.totalRevenue} DH
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
