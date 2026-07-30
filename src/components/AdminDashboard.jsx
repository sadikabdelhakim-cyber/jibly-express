import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Printer, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Package, 
  Wallet, 
  Users, 
  Zap,
  Settings,
  BarChart3,
  UserCheck
} from 'lucide-react';
import OrderCard from './OrderCard';

export default function AdminDashboard({ 
  orders, 
  drivers, 
  customers = [],
  onOpenNewOrderModal, 
  onOpenWhatsAppModal, 
  onOpenPrintModal, 
  onOpenSettingsModal,
  onCancelOrder,
  onOpenInvoiceModal,
  onOpenCustomersModal,
  onOpenProductsModal
}) {
  const [filterStatus, setFilterStatus] = useState('all');

  // Metrics Calculations
  const availableOrders = orders.filter(o => o.status === 'available');
  const claimedOrders = orders.filter(o => o.status === 'claimed');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const totalCapitalSpent = deliveredOrders.reduce((sum, o) => sum + (o.actualCapital || 0), 0);
  const totalDeliveryFeesEarned = deliveredOrders.reduce((sum, o) => sum + (o.actualDeliveryFee || 0), 0);

  // Driver Performance Aggregation
  const driverStats = drivers.map(drv => {
    const drvDelivered = deliveredOrders.filter(o => o.claimedBy?.id === drv.id);
    const drvCapital = drvDelivered.reduce((sum, o) => sum + (o.actualCapital || 0), 0);
    const drvFees = drvDelivered.reduce((sum, o) => sum + (o.actualDeliveryFee || 0), 0);
    const drvTotal = drvDelivered.reduce((sum, o) => sum + (o.totalCollected || 0), 0);
    const limit = drv.dailyCapitalLimit || 1000;

    return {
      ...drv,
      deliveredCount: drvDelivered.length,
      capitalSpent: drvCapital,
      capitalLimit: limit,
      deliveryFees: drvFees,
      totalCollected: drvTotal
    };
  });

  // Filtered Orders List
  const displayedOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Action Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(13, 148, 136, 0.15) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            👑 لوحة تحكم المنسق والأدمين
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            أضف الطلبيات، اخرج الفواتير للزبائن، وتتبع السلع الأكثر طلباً.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          
          <button className="btn btn-primary" onClick={onOpenNewOrderModal}>
            <Plus size={18} />
            <span>+ إضافة طلبية</span>
          </button>

          <button className="btn btn-amber" onClick={onOpenWhatsAppModal}>
            <MessageSquare size={18} />
            <span>تحويل الواتساب</span>
          </button>

          <button className="btn btn-secondary" onClick={onOpenSettingsModal}>
            <Settings size={18} style={{ color: 'var(--amber)' }} />
            <span>⚙️ الإعدادات (ثمن الليل/النهار + ليفرور)</span>
          </button>

          <button className="btn btn-secondary" onClick={onOpenPrintModal}>
            <Printer size={18} />
            <span>كشف الحساب</span>
          </button>

          <button className="btn" style={{ background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.3)' }} onClick={onOpenCustomersModal}>
            <UserCheck size={18} />
            <span>👥 لائحة الزبائن ({customers.length})</span>
          </button>

          <button className="btn" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', border: '1px solid rgba(6, 182, 212, 0.3)' }} onClick={onOpenProductsModal}>
            <BarChart3 size={18} />
            <span>📊 إحصائيات المنتجات</span>
          </button>

        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>الطلبيات المتوفرة</span>
            <Zap size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', marginTop: '4px' }}>
            {availableOrders.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>قيد التوصيل الآن</span>
            <Clock size={18} style={{ color: 'var(--amber)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--amber)', marginTop: '4px' }}>
            {claimedOrders.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>المسلمة اليوم</span>
            <CheckCircle2 size={18} style={{ color: 'var(--cyan)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--cyan)', marginTop: '4px' }}>
            {deliveredOrders.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>إجمالي رأس المال</span>
            <Wallet size={18} style={{ color: 'var(--amber)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--amber)', marginTop: '4px' }}>
            {totalCapitalSpent} <span style={{ fontSize: '1rem' }}>DH</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>أرباح التوصيل</span>
            <TrendingUp size={18} style={{ color: '#34d399' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>
            {totalDeliveryFeesEarned} <span style={{ fontSize: '1rem' }}>DH</span>
          </div>
        </div>

      </div>



      {/* Drivers Daily Financial Leaderboard Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} style={{ color: 'var(--primary)' }} />
            <span>جدول ليفرور (الحالة + رأس المال المخصص + الأرباح)</span>
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={onOpenSettingsModal}>
            <Settings size={14} /> تعديل الحالات والأسقف
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>الليفرور</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>الحالة</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>الطلبيات</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>رأس المال (المصروف / المخصص)</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>أرباح التوصيل</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>المجموع المقبوض</th>
              </tr>
            </thead>
            <tbody>
              {driverStats.map(drv => {
                const isActive = drv.status !== 'موقوف';
                const percent = Math.min(100, Math.round((drv.capitalSpent / drv.capitalLimit) * 100));

                return (
                  <tr key={drv.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: isActive ? 1 : 0.6 }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>
                      {drv.avatar} {drv.name}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{drv.vehicle}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className={`badge ${isActive ? 'badge-emerald' : 'badge-rose'}`}>
                        {isActive ? 'نشيط' : 'موقوف'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className="badge badge-cyan">{drv.deliveredCount} طلبية</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, color: 'var(--amber)' }}>
                        {drv.capitalSpent} / {drv.capitalLimit} DH
                      </div>
                      <div style={{ width: '100px', height: '6px', background: 'var(--bg-input)', borderRadius: '999px', margin: '4px auto 0', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: percent > 90 ? 'var(--rose)' : 'var(--amber)' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                      {drv.deliveryFees} DH
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: 'var(--cyan)' }}>
                      {drv.totalCollected} DH
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Kanban Grid */}
      <div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            📦 كافـة طلبيات الفريق ({displayedOrders.length})
          </h3>

          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button
              className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('all')}
            >
              الكل ({orders.length})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'available' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('available')}
            >
              ⚡ متوفرة ({availableOrders.length})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'claimed' ? 'btn-amber' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('claimed')}
            >
              ⏳ قيد التوصيل ({claimedOrders.length})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'delivered' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('delivered')}
            >
              ✅ مسلمة ({deliveredOrders.length})
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        {displayedOrders.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>لا توجد طلبيات مطابقة لهاد الفلتر حالياً</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '16px'
          }}>
            {displayedOrders.map(ord => (
              <OrderCard
                key={ord.id}
                order={ord}
                activeRole="admin"
                onCancelOrder={onCancelOrder}
                onOpenInvoiceModal={onOpenInvoiceModal}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
