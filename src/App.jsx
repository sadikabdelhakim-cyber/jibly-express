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

  // 5. Persist Orders to LocalStorage & broadcast to other open tabs
  const updateOrdersAndSync = (newOrders, actionType = 'update') => {
    setOrders(newOrders);
    localStorage.setItem('delivery_app_orders', JSON.stringify(newOrders));

    if (syncChannelRef.current) {
      syncChannelRef.current.postMessage({
        type: actionType,
        orders: newOrders
      });
    }
  };

  // 6. Initialize Multi-Tab Sync listener
  useEffect(() => {
    syncChannelRef.current = createSyncChannel((msg) => {
      if (msg && msg.orders) {
        setOrders(msg.orders);
        localStorage.setItem('delivery_app_orders', JSON.stringify(msg.orders));

        if (soundEnabled) {
          if (msg.type === 'new_order') {
            playNewOrderSound();
          } else if (msg.type === 'claim_order') {
            playClaimSound();
          } else if (msg.type === 'delivered_order') {
            playSuccessSound();
          }
        }
      }
    });

    return () => {
      if (syncChannelRef.current) syncChannelRef.current.close();
    };
  }, [soundEnabled]);

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
    updateOrdersAndSync(updated, 'new_order');

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

    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'claimed',
          claimedBy: { id: currentDriver.id, name: currentDriver.name },
          claimedAt: new Date().toISOString()
        };
      }
      return o;
    });

    updateOrdersAndSync(updated, 'claim_order');
    if (soundEnabled) playClaimSound();
  };

  // Handler: Confirm Order Delivered (Strictly Cash)
  const handleConfirmDelivered = (orderId, deliveryDetails) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'delivered',
          deliveredAt: new Date().toISOString(),
          actualCapital: deliveryDetails.actualCapital,
          actualDeliveryFee: deliveryDetails.actualDeliveryFee,
          totalCollected: deliveryDetails.totalCollected,
          paymentMethod: 'cash',
          driverNotes: deliveryDetails.driverNotes
        };
      }
      return o;
    });

    updateOrdersAndSync(updated, 'delivered_order');
    if (soundEnabled) playSuccessSound();
  };

  // Handler: Cancel Order (Admin)
  const handleCancelOrder = (orderId) => {
    if (window.confirm('واش متأكد بغيتي تلغي هاد الطلبية؟')) {
      const updated = orders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: 'cancelled' };
        }
        return o;
      });
      updateOrdersAndSync(updated, 'cancel_order');
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
