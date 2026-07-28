import React, { useState } from 'react';
import { 
  Zap, 
  Bike, 
  History, 
  Wallet, 
  DollarSign
} from 'lucide-react';
import OrderCard from './OrderCard';

export default function DriverDashboard({ 
  orders, 
  activeDriver, 
  onClaimOrder, 
  onMarkDeliveredClick,
  onOpenInvoiceModal
}) {
  const [activeTab, setActiveTab] = useState('available'); // available, my_active, history

  if (!activeDriver) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p>المرجو اختيار حساب الليفرور من أعلى القائمة لتبدأ الخدمة!</p>
      </div>
    );
  }

  // Available orders for everyone
  const availableOrders = orders.filter(o => o.status === 'available');

  // Active claimed orders by this logged-in driver
  const myActiveOrders = orders.filter(o => o.status === 'claimed' && o.claimedBy?.id === activeDriver.id);

  // Delivered history by this logged-in driver
  const myHistoryOrders = orders.filter(o => o.status === 'delivered' && o.claimedBy?.id === activeDriver.id);

  // Calculations for driver daily stats & capital budget limit
  const capitalLimit = activeDriver.dailyCapitalLimit || 1000;
  const totalCapitalSpentToday = myHistoryOrders.reduce((sum, o) => sum + (o.actualCapital || 0), 0);
  const remainingCapitalBudget = Math.max(0, capitalLimit - totalCapitalSpentToday);
  const totalDeliveryEarningsToday = myHistoryOrders.reduce((sum, o) => sum + (o.actualDeliveryFee || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Driver Welcome & Financial Summary Box */}
      <div className="glass-panel" style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        border: '1px solid var(--primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            fontSize: '2.5rem',
            background: 'var(--bg-secondary)',
            padding: '8px 14px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {activeDriver.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                مرحباً بك، {activeDriver.name}
              </h2>
              <span className="badge badge-emerald">
                {activeDriver.vehicle}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              سقف رأس المال المخصص لك اليوم من الأدمين: <strong>{capitalLimit} DH</strong>
            </p>
          </div>
        </div>

        {/* Daily Stats Summary */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          
          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>طلبيات مسلمة</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
              {myHistoryOrders.length}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>رأس المال (مستعمل / مخصص)</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--amber)' }}>
              {totalCapitalSpentToday} / {capitalLimit} DH
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              المتبقي: {remainingCapitalBudget} DH
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ربح التوصيل ديالي</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399' }}>
              {totalDeliveryEarningsToday} DH
            </div>
          </div>

        </div>

      </div>

      {/* Driver Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        
        {/* Available Tab */}
        <button
          className={`btn ${activeTab === 'available' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, minWidth: '160px', padding: '14px' }}
          onClick={() => setActiveTab('available')}
        >
          <Zap size={18} className={availableOrders.length > 0 ? 'bounce-icon' : ''} />
          <span>طلبيات متوفرة ({availableOrders.length})</span>
          {availableOrders.length > 0 && (
            <span className="badge badge-rose pulse-badge" style={{ fontSize: '0.7rem' }}>جديد</span>
          )}
        </button>

        {/* My Active Tab */}
        <button
          className={`btn ${activeTab === 'my_active' ? 'btn-amber' : 'btn-secondary'}`}
          style={{ flex: 1, minWidth: '160px', padding: '14px' }}
          onClick={() => setActiveTab('my_active')}
        >
          <Bike size={18} />
          <span>طلبياتي قيد التوصيل ({myActiveOrders.length})</span>
        </button>

        {/* History Tab */}
        <button
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, minWidth: '160px', padding: '14px' }}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} />
          <span>السطوريك والأرباح ({myHistoryOrders.length})</span>
        </button>

      </div>

      {/* TAB CONTENT: AVAILABLE ORDERS (INDRIVE STYLE) */}
      {activeTab === 'available' && (
        <div>
          {availableOrders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Zap size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ماكاينا حتى طلبية متوفرة دابا!</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                غير ينزل المنسق طلبية جديدة فـ الواتساب غاتطلع هنا مباشرة باش تاكسبتيها بسرعة!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--primary-light)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  الطلبيات كطلع لايف للفريق كامل، اللي ضغط أول واحد على "أكسبتي" كتحسب ليه فالحين!
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '16px'
              }}>
                {availableOrders.map(ord => (
                  <OrderCard
                    key={ord.id}
                    order={ord}
                    activeRole="driver"
                    activeDriver={activeDriver}
                    onClaimOrder={onClaimOrder}
                    onOpenInvoiceModal={onOpenInvoiceModal}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MY ACTIVE ORDERS */}
      {activeTab === 'my_active' && (
        <div>
          {myActiveOrders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bike size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ماعندك حتى طلبية قيد التوصيل حالياً</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                سير لتبويب "طلبيات متوفرة" واختار الطلبية اللي قرب ليك عشان تبدأ التوصيل.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '16px'
            }}>
              {myActiveOrders.map(ord => (
                <OrderCard
                  key={ord.id}
                  order={ord}
                  activeRole="driver"
                  activeDriver={activeDriver}
                  onMarkDeliveredClick={onMarkDeliveredClick}
                  onOpenInvoiceModal={onOpenInvoiceModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: HISTORY & EARNINGS */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>
              📜 كشف الطلبيات اللي وصلتي اليوم
            </h3>

            {myHistoryOrders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>مازال ما سجلتي حتى طلبية مسلمة اليوم.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myHistoryOrders.map(ord => (
                  <div key={ord.id} style={{
                    background: 'var(--bg-input)',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                        الطلبية #{ord.id} - {ord.customerName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {ord.address} | {ord.items}
                      </div>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--amber)', fontWeight: 700 }}>
                        رأس المال: {ord.actualCapital} DH
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                        تمن التوصيل (ربحك): +{ord.actualDeliveryFee} DH
                      </div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--cyan)', fontWeight: 900, marginTop: '2px' }}>
                        المجموع المقبوض (كاش): {ord.totalCollected} DH
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
