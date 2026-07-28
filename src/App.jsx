import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import OrderFormModal from './components/OrderFormModal';
import WhatsAppParserModal from './components/WhatsAppParserModal';
import MarkDeliveredModal from './components/MarkDeliveredModal';
import PrintReportModal from './components/PrintReportModal';
import AdminSettingsModal from './components/AdminSettingsModal';
import ClientInvoiceModal from './components/ClientInvoiceModal';

import { DEFAULT_DRIVERS, DEFAULT_ORDERS, DEFAULT_SETTINGS, getCurrentDeliveryFee } from './data/initialData';
import { playNewOrderSound, playClaimSound, playSuccessSound } from './utils/audio';
import { createSyncChannel } from './utils/sync';
import { supabase, isSupabaseConfigured } from './utils/supabase';

// Helper mapping DB row <-> JS order object
function mapRowToOrder(row) {
  return {
    id: row.id,
    createdAt: row.created_at || row.createdAt,
    customerName: row.customer_name || row.customerName,
    customerPhone: row.customer_phone || row.customerPhone,
    address: row.address,
    itemList: row.item_list || row.itemList || [],
    items: row.items,
    sellingPrice: Number(row.selling_price ?? row.sellingPrice ?? 0),
    estimatedCapital: Number(row.estimated_capital ?? row.estimatedCapital ?? 0),
    deliveryFee: Number(row.delivery_fee ?? row.deliveryFee ?? 0),
    status: row.status,
    claimedBy: row.claimed_by || row.claimedBy || null,
    claimedAt: row.claimed_at || row.claimedAt || null,
    deliveredAt: row.delivered_at || row.deliveredAt || null,
    actualCapital: row.actual_capital ?? row.actualCapital ?? null,
    actualDeliveryFee: row.actual_delivery_fee ?? row.actualDeliveryFee ?? null,
    totalCollected: row.total_collected ?? row.totalCollected ?? null,
    driverNotes: row.driver_notes || row.driverNotes || '',
    paymentMethod: row.payment_method || row.paymentMethod || 'cash'
  };
}

function mapOrderToRow(ord) {
  return {
    id: ord.id,
    created_at: ord.createdAt,
    customer_name: ord.customerName,
    customer_phone: ord.customerPhone,
    address: ord.address,
    item_list: ord.itemList || [],
    items: ord.items,
    selling_price: ord.sellingPrice,
    estimated_capital: ord.estimatedCapital,
    delivery_fee: ord.deliveryFee,
    status: ord.status,
    claimed_by: ord.claimedBy,
    claimed_at: ord.claimedAt,
    delivered_at: ord.deliveredAt,
    actual_capital: ord.actualCapital,
    actual_delivery_fee: ord.actualDeliveryFee,
    total_collected: ord.totalCollected,
    driver_notes: ord.driverNotes,
    payment_method: ord.paymentMethod || 'cash'
  };
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('delivery_app_theme') || 'dark');

  // Drivers state
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('delivery_app_drivers');
    return saved ? JSON.parse(saved) : DEFAULT_DRIVERS;
  });

  // Settings state (Day/Night rates, thresholds)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('delivery_app_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Current Logged-in User Session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('delivery_app_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('delivery_app_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  // Sound toggle state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderFormInitialValues, setOrderFormInitialValues] = useState(null);

  const [isWhatsAppParserOpen, setIsWhatsAppParserOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deliveringOrderTarget, setDeliveringOrderTarget] = useState(null);
  const [clientInvoiceTarget, setClientInvoiceTarget] = useState(null);

  // Channel sync reference
  const syncChannelRef = useRef(null);

  // 1. Sync Theme attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('delivery_app_theme', theme);
  }, [theme]);

  // 2. Persist Drivers to LocalStorage
  useEffect(() => {
    localStorage.setItem('delivery_app_drivers', JSON.stringify(drivers));
  }, [drivers]);

  // 3. Persist Settings to LocalStorage
  useEffect(() => {
    localStorage.setItem('delivery_app_settings', JSON.stringify(settings));
  }, [settings]);

  // 4. Persist User Session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('delivery_app_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('delivery_app_session');
    }
  }, [currentUser]);

  // 5. Initialize Supabase Realtime Sync or Fallback to Multi-Tab Sync
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Fetch existing orders from Supabase DB
      const fetchOrders = async () => {
        try {
          const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
          if (!error && Array.isArray(data)) {
            const mapped = data.map(mapRowToOrder);
            setOrders(mapped);
            localStorage.setItem('delivery_app_orders', JSON.stringify(mapped));
          }
        } catch (e) {
          console.error('Error fetching Supabase orders:', e);
        }
      };

      fetchOrders();

      // Subscribe to Realtime Postgres changes
      const channel = supabase
        .channel('realtime:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          fetchOrders();
          if (soundEnabled) {
            if (payload.eventType === 'INSERT') playNewOrderSound();
            else if (payload.eventType === 'UPDATE') playClaimSound();
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // LocalStorage Multi-Tab fallback listener
      syncChannelRef.current = createSyncChannel((msg) => {
        if (msg && msg.orders) {
          setOrders(msg.orders);
          localStorage.setItem('delivery_app_orders', JSON.stringify(msg.orders));

          if (soundEnabled) {
            if (msg.type === 'new_order') playNewOrderSound();
            else if (msg.type === 'claim_order') playClaimSound();
            else if (msg.type === 'delivered_order') playSuccessSound();
          }
        }
      });

      return () => {
        if (syncChannelRef.current) syncChannelRef.current.close();
      };
    }
  }, [soundEnabled]);

  // Helper to persist order changes locally and on Supabase
  const updateOrdersAndSync = async (newOrders, actionType = 'update', targetOrder = null) => {
    setOrders(newOrders);
    localStorage.setItem('delivery_app_orders', JSON.stringify(newOrders));

    if (isSupabaseConfigured && supabase && targetOrder) {
      try {
        const row = mapOrderToRow(targetOrder);
        await supabase.from('orders').upsert(row);
      } catch (err) {
        console.error('Supabase update failed:', err);
      }
    } else if (syncChannelRef.current) {
      syncChannelRef.current.postMessage({
        type: actionType,
        orders: newOrders
      });
    }
  };

  // Handler: Add New Driver to Team
  const handleAddDriver = (newDriverData) => {
    const newDriver = {
      id: 'drv-' + Date.now(),
      ...newDriverData,
      status: 'نشيط',
      dailyCapitalLimit: 1000
    };
    const updated = [...drivers, newDriver];
    setDrivers(updated);
    return newDriver;
  };

  // Handler: Update Driver Active/Suspended status (Admin)
  const handleUpdateDriverStatus = (driverId, newStatus) => {
    const updated = drivers.map(d => d.id === driverId ? { ...d, status: newStatus } : d);
    setDrivers(updated);
  };

  // Handler: Update Driver Daily Capital Limit (Admin)
  const handleUpdateDriverCapitalLimit = (driverId, newLimit) => {
    const updated = drivers.map(d => d.id === driverId ? { ...d, dailyCapitalLimit: newLimit } : d);
    setDrivers(updated);
  };

  // Handler: Create New Order (Admin)
  const handleCreateOrder = (orderData) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      deliveryFee: orderData.deliveryFee || getCurrentDeliveryFee(settings),
      ...orderData,
      status: 'available',
      claimedBy: null,
      claimedAt: null,
      deliveredAt: null,
      actualCapital: null,
      actualDeliveryFee: null,
      totalCollected: null,
      driverNotes: ''
    };

    const updated = [newOrder, ...orders];
    updateOrdersAndSync(updated, 'new_order', newOrder);

    if (soundEnabled) playNewOrderSound();
  };

  // Handler: Parse WhatsApp -> Auto open Order Form
  const handleParsedFromWhatsApp = (parsedData) => {
    setOrderFormInitialValues(parsedData);
    setIsOrderFormOpen(true);
  };

  // Handler: Driver Accepts / Claims Order (InDrive Style)
  const handleClaimOrder = (orderId) => {
    const currentDriver = currentUser?.driver;
    if (!currentDriver) return;

    // Check if driver status is suspended
    const refreshedDriver = drivers.find(d => d.id === currentDriver.id);
    if (refreshedDriver && refreshedDriver.status === 'موقوف') {
      alert('عذراً، حسابك موقوف حالياً من طرف المنسق الأدمين!');
      return;
    }

    // Check race condition: Is order still available?
    const target = orders.find(o => o.id === orderId);
    if (!target || target.status !== 'available') {
      alert('عذراً، هاته الطلبية تكسبات سبقك ليها ليفرور أخر!');
      return;
    }

    let updatedTarget = null;
    const updated = orders.map(o => {
      if (o.id === orderId) {
        updatedTarget = {
          ...o,
          status: 'claimed',
          claimedBy: { id: currentDriver.id, name: currentDriver.name },
          claimedAt: new Date().toISOString()
        };
        return updatedTarget;
      }
      return o;
    });

    updateOrdersAndSync(updated, 'claim_order', updatedTarget);
    if (soundEnabled) playClaimSound();
  };

  // Handler: Confirm Order Delivered (Strictly Cash)
  const handleConfirmDelivered = (orderId, deliveryDetails) => {
    let updatedTarget = null;
    const updated = orders.map(o => {
      if (o.id === orderId) {
        updatedTarget = {
          ...o,
          status: 'delivered',
          deliveredAt: new Date().toISOString(),
          actualCapital: deliveryDetails.actualCapital,
          actualDeliveryFee: deliveryDetails.actualDeliveryFee,
          totalCollected: deliveryDetails.totalCollected,
          paymentMethod: 'cash',
          driverNotes: deliveryDetails.driverNotes
        };
        return updatedTarget;
      }
      return o;
    });

    updateOrdersAndSync(updated, 'delivered_order', updatedTarget);
    if (soundEnabled) playSuccessSound();
  };

  // Handler: Cancel Order (Admin)
  const handleCancelOrder = (orderId) => {
    if (window.confirm('واش متأكد بغيتي تلغي هاد الطلبية؟')) {
      let updatedTarget = null;
      const updated = orders.map(o => {
        if (o.id === orderId) {
          updatedTarget = { ...o, status: 'cancelled' };
          return updatedTarget;
        }
        return o;
      });
      updateOrdersAndSync(updated, 'cancel_order', updatedTarget);
    }
  };

  // Reset Demo Data (Admin)
  const handleResetData = () => {
    if (window.confirm('واش بغيتي ترجع البيانات التجريبية الأولية؟')) {
      setDrivers(DEFAULT_DRIVERS);
      setOrders(DEFAULT_ORDERS);
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('delivery_app_drivers', JSON.stringify(DEFAULT_DRIVERS));
      localStorage.setItem('delivery_app_orders', JSON.stringify(DEFAULT_ORDERS));
      localStorage.setItem('delivery_app_settings', JSON.stringify(DEFAULT_SETTINGS));
    }
  };

  // If no user is logged in -> Render LoginScreen!
  if (!currentUser) {
    return (
      <LoginScreen
        drivers={drivers}
        onLoginAdmin={() => setCurrentUser({ role: 'admin' })}
        onLoginDriver={(driver) => setCurrentUser({ role: 'driver', driver })}
        onAddDriver={handleAddDriver}
      />
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const activeDriver = currentUser.role === 'driver' ? drivers.find(d => d.id === currentUser.driver?.id) || currentUser.driver : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Navigation Header */}
      <Header
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 16px' }}>
        
        {isAdmin ? (
          <AdminDashboard
            orders={orders}
            drivers={drivers}
            onOpenNewOrderModal={() => {
              setOrderFormInitialValues(null);
              setIsOrderFormOpen(true);
            }}
            onOpenWhatsAppModal={() => setIsWhatsAppParserOpen(true)}
            onOpenPrintModal={() => setIsPrintReportOpen(true)}
            onOpenSettingsModal={() => setIsSettingsOpen(true)}
            onCancelOrder={handleCancelOrder}
            onOpenInvoiceModal={(ord) => setClientInvoiceTarget(ord)}
          />
        ) : (
          <DriverDashboard
            orders={orders}
            activeDriver={activeDriver}
            onClaimOrder={handleClaimOrder}
            onMarkDeliveredClick={(ord) => setDeliveringOrderTarget(ord)}
            onOpenInvoiceModal={(ord) => setClientInvoiceTarget(ord)}
          />
        )}

      </main>

      {/* Modals */}
      <OrderFormModal
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSubmitOrder={handleCreateOrder}
        initialValues={orderFormInitialValues}
        settings={settings}
      />

      <WhatsAppParserModal
        isOpen={isWhatsAppParserOpen}
        onClose={() => setIsWhatsAppParserOpen(false)}
        onParsedOrder={handleParsedFromWhatsApp}
      />

      <MarkDeliveredModal
        isOpen={Boolean(deliveringOrderTarget)}
        onClose={() => setDeliveringOrderTarget(null)}
        order={deliveringOrderTarget}
        onConfirmDelivered={handleConfirmDelivered}
      />

      <PrintReportModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        orders={orders}
        drivers={drivers}
      />

      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSetts) => setSettings({ ...settings, ...newSetts })}
        drivers={drivers}
        onUpdateDriverStatus={handleUpdateDriverStatus}
        onUpdateDriverCapitalLimit={handleUpdateDriverCapitalLimit}
      />

      <ClientInvoiceModal
        isOpen={Boolean(clientInvoiceTarget)}
        onClose={() => setClientInvoiceTarget(null)}
        order={clientInvoiceTarget}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '16px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        Jibly Express © 2026 - نظام تنسيق طلبيات فريق التوصيل المحترفين
      </footer>

    </div>
  );
}
