import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import OrderFormModal from './components/OrderFormModal';
import WhatsAppParserModal from './components/WhatsAppParserModal';
import MarkDeliveredModal from './components/MarkDeliveredModal';
import PrintReportModal from './components/PrintReportModal';
import AdminSettingsModal from './components/AdminSettingsModal';
import ClientInvoiceModal from './components/ClientInvoiceModal';
import CustomerDatabaseModal from './components/CustomerDatabaseModal';
import ProductStatsModal from './components/ProductStatsModal';
import TeamFormModal from './components/TeamFormModal';

import {
  DEFAULT_TEAMS,
  DEFAULT_DRIVERS,
  DEFAULT_ORDERS,
  DEFAULT_SETTINGS,
  getCurrentDeliveryFee,
  getTeamDrivers,
  getTeamOrders,
  createTeamObject
} from './data/initialData';
import { playNewOrderSound, playClaimSound, playSuccessSound } from './utils/audio';
import { createSyncChannel } from './utils/sync';
import { supabase, isSupabaseConfigured } from './utils/supabase';

// Helper mapping DB row <-> JS order object
function mapRowToOrder(row) {
  return {
    id: row.id,
    teamId: row.team_id || row.teamId || null,
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
    paymentMethod: row.payment_method || row.paymentMethod || 'cash',
    customerRating: row.customer_rating ?? row.customerRating ?? null
  };
}

function mapOrderToRow(ord) {
  return {
    id: ord.id,
    team_id: ord.teamId,
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
    payment_method: ord.paymentMethod || 'cash',
    customer_rating: ord.customerRating || null
  };
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('delivery_app_theme') || 'dark');

  // ============================================================
  // Multi-Tenant State
  // ============================================================

  // Teams state
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('delivery_app_teams');
    return saved ? JSON.parse(saved) : DEFAULT_TEAMS;
  });

  // Drivers state (all drivers across all teams)
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('delivery_app_drivers');
    return saved ? JSON.parse(saved) : DEFAULT_DRIVERS;
  });

  // Settings state (Day/Night rates, thresholds — global defaults)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('delivery_app_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Current Logged-in User Session
  // Possible shapes:
  //   { role: 'super_admin' }
  //   { role: 'team_admin', team: {...} }
  //   { role: 'driver', driver: {...}, team: {...} }
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('delivery_app_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Orders state (all orders across all teams)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('delivery_app_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  // Customers database (auto-built from orders)
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('delivery_app_customers');
    return saved ? JSON.parse(saved) : [];
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
  const [isCustomerDBOpen, setIsCustomerDBOpen] = useState(false);
  const [isProductStatsOpen, setIsProductStatsOpen] = useState(false);

  // Team Form Modal (for Super Admin create/edit team)
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // "Viewing as Team Admin" mode (Super Admin → enters a team)
  const [viewingAsTeamId, setViewingAsTeamId] = useState(null);

  // Channel sync reference
  const syncChannelRef = useRef(null);

  // ============================================================
  // Derived State: Active Team Context
  // ============================================================
  const getActiveTeam = () => {
    // If super admin is viewing a specific team
    if (currentUser?.role === 'super_admin' && viewingAsTeamId) {
      return teams.find(t => t.id === viewingAsTeamId) || null;
    }
    // If team admin
    if (currentUser?.role === 'team_admin') {
      return teams.find(t => t.id === currentUser.team?.id) || currentUser.team;
    }
    // If driver
    if (currentUser?.role === 'driver') {
      return teams.find(t => t.id === currentUser.team?.id) || currentUser.team;
    }
    return null;
  };

  const activeTeam = getActiveTeam();

  // Get the team-specific settings (fallback to global)
  const getActiveSettings = () => {
    if (activeTeam?.settings) {
      return {
        dayDeliveryFee: activeTeam.settings.dayDeliveryFee ?? settings.dayDeliveryFee,
        nightDeliveryFee: activeTeam.settings.nightDeliveryFee ?? settings.nightDeliveryFee,
        nightStartHour: activeTeam.settings.nightStartHour ?? settings.nightStartHour,
        nightEndHour: activeTeam.settings.nightEndHour ?? settings.nightEndHour
      };
    }
    return settings;
  };

  const activeSettings = getActiveSettings();

  // Filtered data for the active team context
  const teamFilteredDrivers = activeTeam ? getTeamDrivers(activeTeam.id, drivers) : drivers;
  const teamFilteredOrders = activeTeam ? getTeamOrders(activeTeam.id, orders) : orders;

  // ============================================================
  // Side Effects: Persistence
  // ============================================================

  // 1. Sync Theme attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('delivery_app_theme', theme);
  }, [theme]);

  // 2. Persist Teams to LocalStorage
  useEffect(() => {
    localStorage.setItem('delivery_app_teams', JSON.stringify(teams));
  }, [teams]);

  // 3. Persist Drivers to LocalStorage
  useEffect(() => {
    localStorage.setItem('delivery_app_drivers', JSON.stringify(drivers));
  }, [drivers]);

  // 4. Persist Settings to LocalStorage
  useEffect(() => {
    localStorage.setItem('delivery_app_settings', JSON.stringify(settings));
  }, [settings]);

  // 5. Persist User Session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('delivery_app_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('delivery_app_session');
    }
  }, [currentUser]);

  // 6b. Persist Customers to LocalStorage
  useEffect(() => {
    localStorage.setItem('delivery_app_customers', JSON.stringify(customers));
  }, [customers]);

  // ============================================================
  // Customer Database Helper
  // ============================================================
  const upsertCustomer = (orderData, rating = null) => {
    const phone = (orderData.customerPhone || '').replace(/\s/g, '');
    if (!phone) return;

    setCustomers(prev => {
      const existing = prev.find(c => c.phone === phone);
      if (existing) {
        const updatedRatings = rating != null
          ? [...(existing.ratings || []), { value: rating, date: new Date().toISOString() }]
          : existing.ratings || [];
        const avgRating = updatedRatings.length > 0
          ? Math.round((updatedRatings.reduce((s, r) => s + r.value, 0) / updatedRatings.length) * 10) / 10
          : null;
        return prev.map(c => c.phone === phone ? {
          ...c,
          name: orderData.customerName || c.name,
          address: orderData.address || c.address,
          teamId: orderData.teamId || c.teamId,
          orderCount: (c.orderCount || 0) + (rating != null ? 0 : 1),
          totalSpent: (c.totalSpent || 0) + Number(orderData.sellingPrice || orderData.totalCollected || 0),
          lastOrderDate: new Date().toISOString(),
          ratings: updatedRatings,
          averageRating: avgRating
        } : c);
      } else {
        const initialRatings = rating != null
          ? [{ value: rating, date: new Date().toISOString() }]
          : [];
        return [...prev, {
          id: 'cust-' + Date.now(),
          phone,
          name: orderData.customerName || 'زبون',
          address: orderData.address || '',
          teamId: orderData.teamId || null,
          orderCount: 1,
          totalSpent: Number(orderData.sellingPrice || 0),
          lastOrderDate: new Date().toISOString(),
          ratings: initialRatings,
          averageRating: rating,
          createdAt: new Date().toISOString()
        }];
      }
    });
  };

  // 6. Initialize Supabase Realtime Sync or Fallback to Multi-Tab Sync
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

  // ============================================================
  // Team Management Handlers (Super Admin)
  // ============================================================

  const handleCreateTeam = (teamData) => {
    const newTeam = createTeamObject(teamData);
    const updated = [...teams, newTeam];
    setTeams(updated);
  };

  const handleEditTeam = (teamId, updatedData) => {
    const updated = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          name: updatedData.name ?? t.name,
          brandName: updatedData.brandName ?? t.brandName,
          logo: updatedData.logo ?? t.logo,
          city: updatedData.city ?? t.city,
          phone: updatedData.phone ?? t.phone,
          email: updatedData.email ?? t.email,
          address: updatedData.address ?? t.address,
          adminPin: updatedData.adminPin ?? t.adminPin,
          settings: {
            ...t.settings,
            dayDeliveryFee: updatedData.dayDeliveryFee ?? t.settings?.dayDeliveryFee,
            nightDeliveryFee: updatedData.nightDeliveryFee ?? t.settings?.nightDeliveryFee,
            nightStartHour: updatedData.nightStartHour ?? t.settings?.nightStartHour,
            nightEndHour: updatedData.nightEndHour ?? t.settings?.nightEndHour
          }
        };
      }
      return t;
    });
    setTeams(updated);
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('واش متأكد بغيتي تحذف هاد الفريق نهائياً؟ غادي يتمسح هو وكاع الليفرورات والطلبيات ديالو!')) {
      setTeams(prev => prev.filter(t => t.id !== teamId));
      setDrivers(prev => prev.filter(d => d.teamId !== teamId));
      setOrders(prev => prev.filter(o => o.teamId !== teamId));
    }
  };

  const handleToggleTeamStatus = (teamId) => {
    const updated = teams.map(t => {
      if (t.id === teamId) {
        return { ...t, status: t.status === 'active' ? 'suspended' : 'active' };
      }
      return t;
    });
    setTeams(updated);
  };

  // Super Admin: Enter a team as its admin
  const handleLoginAsTeamAdmin = (teamId) => {
    setViewingAsTeamId(teamId);
  };

  // Super Admin: Exit team view → back to Super Admin dashboard
  const handleExitTeamView = () => {
    setViewingAsTeamId(null);
  };

  // ============================================================
  // Driver Management Handlers
  // ============================================================

  const handleAddDriver = (newDriverData) => {
    const currentTeamId = activeTeam?.id || newDriverData.teamId || null;
    const newDriver = {
      id: 'drv-' + Date.now(),
      ...newDriverData,
      teamId: currentTeamId,
      status: 'نشيط',
      dailyCapitalLimit: newDriverData.dailyCapitalLimit || 1000,
      joinedAt: new Date().toISOString(),
      notes: ''
    };
    const updated = [...drivers, newDriver];
    setDrivers(updated);
    return newDriver;
  };

  const handleUpdateDriverStatus = (driverId, newStatus) => {
    const updated = drivers.map(d => d.id === driverId ? { ...d, status: newStatus } : d);
    setDrivers(updated);
  };

  const handleUpdateDriverCapitalLimit = (driverId, newLimit) => {
    const updated = drivers.map(d => d.id === driverId ? { ...d, dailyCapitalLimit: newLimit } : d);
    setDrivers(updated);
  };

  // ============================================================
  // Order Handlers (scoped to active team)
  // ============================================================

  const handleCreateOrder = (orderData) => {
    const currentTeamId = activeTeam?.id || null;
    const newOrder = {
      id: 'ORD-' + Math.floor(100 + Math.random() * 900),
      teamId: currentTeamId,
      createdAt: new Date().toISOString(),
      deliveryFee: orderData.deliveryFee || getCurrentDeliveryFee(activeSettings),
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

    // Auto-register customer
    upsertCustomer({ ...newOrder, teamId: currentTeamId });

    if (soundEnabled) playNewOrderSound();
  };

  const handleParsedFromWhatsApp = (parsedData) => {
    setOrderFormInitialValues(parsedData);
    setIsOrderFormOpen(true);
  };

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
          driverNotes: deliveryDetails.driverNotes,
          customerRating: deliveryDetails.customerRating || null
        };
        return updatedTarget;
      }
      return o;
    });

    updateOrdersAndSync(updated, 'delivered_order', updatedTarget);

    // Update customer DB with rating
    if (updatedTarget) {
      upsertCustomer(
        { ...updatedTarget, totalCollected: deliveryDetails.totalCollected },
        deliveryDetails.customerRating
      );
    }

    if (soundEnabled) playSuccessSound();
  };

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
      setTeams(DEFAULT_TEAMS);
      setDrivers(DEFAULT_DRIVERS);
      setOrders(DEFAULT_ORDERS);
      setSettings(DEFAULT_SETTINGS);
      setCustomers([]);
      setViewingAsTeamId(null);
      localStorage.setItem('delivery_app_teams', JSON.stringify(DEFAULT_TEAMS));
      localStorage.setItem('delivery_app_drivers', JSON.stringify(DEFAULT_DRIVERS));
      localStorage.setItem('delivery_app_orders', JSON.stringify(DEFAULT_ORDERS));
      localStorage.setItem('delivery_app_settings', JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem('delivery_app_customers', JSON.stringify([]));
    }
  };

  // ============================================================
  // Login Handlers
  // ============================================================

  const handleLoginSuperAdmin = () => {
    setCurrentUser({ role: 'super_admin' });
    setViewingAsTeamId(null);
  };

  const handleLoginTeamAdmin = (team) => {
    setCurrentUser({ role: 'team_admin', team });
    setViewingAsTeamId(null);
  };

  const handleLoginDriver = (driver, team) => {
    setCurrentUser({ role: 'driver', driver, team });
    setViewingAsTeamId(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewingAsTeamId(null);
  };

  // ============================================================
  // Update Team Settings (from AdminSettingsModal for team_admin)
  // ============================================================
  const handleUpdateTeamSettings = (newSetts) => {
    if (activeTeam) {
      // Update the team's own settings
      const updated = teams.map(t => {
        if (t.id === activeTeam.id) {
          return {
            ...t,
            settings: {
              ...t.settings,
              ...newSetts
            }
          };
        }
        return t;
      });
      setTeams(updated);
    } else {
      // Update global settings (fallback)
      setSettings({ ...settings, ...newSetts });
    }
  };

  // ============================================================
  // Render: No user logged in → Login Screen
  // ============================================================
  if (!currentUser) {
    return (
      <LoginScreen
        teams={teams}
        drivers={drivers}
        onLoginSuperAdmin={handleLoginSuperAdmin}
        onLoginTeamAdmin={handleLoginTeamAdmin}
        onLoginDriver={handleLoginDriver}
        onAddDriver={handleAddDriver}
      />
    );
  }

  // ============================================================
  // Determine what to render
  // ============================================================
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isTeamAdmin = currentUser.role === 'team_admin';
  const isDriver = currentUser.role === 'driver';

  // Super Admin viewing their own dashboard (not inside a team)
  const showSuperAdminDashboard = isSuperAdmin && !viewingAsTeamId;

  // Super Admin inside a team OR actual Team Admin
  const showTeamAdminDashboard = (isSuperAdmin && viewingAsTeamId) || isTeamAdmin;

  // Driver
  const showDriverDashboard = isDriver;

  // Active driver object (refreshed from state)
  const activeDriver = isDriver
    ? drivers.find(d => d.id === currentUser.driver?.id) || currentUser.driver
    : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Navigation Header */}
      <Header
        currentUser={currentUser}
        activeTeam={activeTeam}
        viewingAsTeamId={viewingAsTeamId}
        onLogout={handleLogout}
        onExitTeamView={handleExitTeamView}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* ========== Super Admin Dashboard ========== */}
        {showSuperAdminDashboard && (
          <SuperAdminDashboard
            teams={teams}
            drivers={drivers}
            orders={orders}
            onCreateTeam={(teamData) => {
              setEditingTeam(null);
              setIsTeamFormOpen(true);
            }}
            onEditTeam={(team) => {
              setEditingTeam(team);
              setIsTeamFormOpen(true);
            }}
            onDeleteTeam={handleDeleteTeam}
            onToggleTeamStatus={handleToggleTeamStatus}
            onLoginAsTeamAdmin={handleLoginAsTeamAdmin}
            viewingAsTeam={viewingAsTeamId}
            onExitTeamView={handleExitTeamView}
          />
        )}

        {/* ========== Team Admin Dashboard ========== */}
        {showTeamAdminDashboard && (
          <>
            {/* Viewing-as-team banner (when Super Admin enters a team) */}
            {isSuperAdmin && viewingAsTeamId && activeTeam && (
              <div className="viewing-banner fade-in-up" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{activeTeam.logo}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                      🔍 أنت تشاهد فريق: {activeTeam.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {activeTeam.brandName && `${activeTeam.brandName} · `}{activeTeam.city} — تحكم كأدمن الفريق
                    </div>
                  </div>
                </div>
                <button className="btn btn-purple btn-sm" onClick={handleExitTeamView}>
                  ← رجوع للأدمن العام
                </button>
              </div>
            )}

            <AdminDashboard
              orders={teamFilteredOrders}
              drivers={teamFilteredDrivers}
              customers={activeTeam ? customers.filter(c => c.teamId === activeTeam.id) : customers}
              onOpenNewOrderModal={() => {
                setOrderFormInitialValues(null);
                setIsOrderFormOpen(true);
              }}
              onOpenWhatsAppModal={() => setIsWhatsAppParserOpen(true)}
              onOpenPrintModal={() => setIsPrintReportOpen(true)}
              onOpenSettingsModal={() => setIsSettingsOpen(true)}
              onCancelOrder={handleCancelOrder}
              onOpenInvoiceModal={(ord) => setClientInvoiceTarget(ord)}
              onOpenCustomersModal={() => setIsCustomerDBOpen(true)}
              onOpenProductsModal={() => setIsProductStatsOpen(true)}
            />
          </>
        )}

        {/* ========== Driver Dashboard ========== */}
        {showDriverDashboard && (
          <DriverDashboard
            orders={teamFilteredOrders}
            activeDriver={activeDriver}
            onClaimOrder={handleClaimOrder}
            onMarkDeliveredClick={(ord) => setDeliveringOrderTarget(ord)}
            onOpenInvoiceModal={(ord) => setClientInvoiceTarget(ord)}
          />
        )}

      </main>

      {/* ============================================================ */}
      {/* Modals                                                       */}
      {/* ============================================================ */}

      <OrderFormModal
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSubmitOrder={handleCreateOrder}
        initialValues={orderFormInitialValues}
        settings={activeSettings}
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
        orders={teamFilteredOrders}
        drivers={teamFilteredDrivers}
      />

      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={activeSettings}
        onUpdateSettings={handleUpdateTeamSettings}
        drivers={teamFilteredDrivers}
        onUpdateDriverStatus={handleUpdateDriverStatus}
        onUpdateDriverCapitalLimit={handleUpdateDriverCapitalLimit}
        onAddDriver={handleAddDriver}
      />

      <ClientInvoiceModal
        isOpen={Boolean(clientInvoiceTarget)}
        onClose={() => setClientInvoiceTarget(null)}
        order={clientInvoiceTarget}
      />

      <CustomerDatabaseModal
        isOpen={isCustomerDBOpen}
        onClose={() => setIsCustomerDBOpen(false)}
        customers={activeTeam ? customers.filter(c => c.teamId === activeTeam.id) : customers}
      />

      <ProductStatsModal
        isOpen={isProductStatsOpen}
        onClose={() => setIsProductStatsOpen(false)}
        orders={teamFilteredOrders}
      />

      {/* Team Create/Edit Modal (Super Admin) */}
      <TeamFormModal
        isOpen={isTeamFormOpen}
        onClose={() => { setIsTeamFormOpen(false); setEditingTeam(null); }}
        team={editingTeam}
        onSubmit={(teamData) => {
          if (editingTeam) {
            handleEditTeam(editingTeam.id, teamData);
          } else {
            handleCreateTeam(teamData);
          }
          setIsTeamFormOpen(false);
          setEditingTeam(null);
        }}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '16px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        Jibly Express © 2026 - منصة إدارة فرق التوصيل المحترفين
      </footer>

    </div>
  );
}
