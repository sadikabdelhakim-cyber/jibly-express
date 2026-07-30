// ============================================================
// Jibly Express — Multi-Tenant Initial Data & Models
// ============================================================

// Super Admin Credentials (صاحب المنصة)
export const SUPER_ADMIN_CREDENTIALS = {
  pin: 'superadmin',
  name: 'الأدمن العام'
};

// ============================================================
// Default Teams (الفرق التجريبية)
// ============================================================
export const DEFAULT_TEAMS = [
  {
    id: 'team-1',
    name: 'فريق البرق للتوصيل',
    brandName: 'البرق Express',
    logo: '⚡',
    city: 'الدار البيضاء',
    phone: '0522334455',
    email: 'albarq@example.com',
    address: 'شارع محمد الخامس، المعاريف',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    adminPin: '1111',
    settings: {
      dayDeliveryFee: 25,
      nightDeliveryFee: 35,
      nightStartHour: 20,
      nightEndHour: 6
    }
  },
  {
    id: 'team-2',
    name: 'فريق الصاعقة',
    brandName: 'الصاعقة Delivery',
    logo: '🚀',
    city: 'الرباط',
    phone: '0537112233',
    email: 'sa3iqa@example.com',
    address: 'حي أكدال، شارع فرنسا',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    adminPin: '2222',
    settings: {
      dayDeliveryFee: 20,
      nightDeliveryFee: 30,
      nightStartHour: 21,
      nightEndHour: 6
    }
  },
  {
    id: 'team-3',
    name: 'فريق النسر السريع',
    brandName: 'النسر Express',
    logo: '🦅',
    city: 'مراكش',
    phone: '0524998877',
    email: 'nasr@example.com',
    address: 'جليز، شارع الحرية',
    status: 'suspended',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    adminPin: '3333',
    settings: {
      dayDeliveryFee: 15,
      nightDeliveryFee: 25,
      nightStartHour: 20,
      nightEndHour: 6
    }
  }
];

// ============================================================
// Default Drivers (الليفرورات — مربوطين بالفرق)
// ============================================================
export const DEFAULT_DRIVERS = [
  // --- Team 1: فريق البرق ---
  {
    id: 'drv-1',
    teamId: 'team-1',
    name: 'أمين العوادي',
    phone: '0661122334',
    vehicle: 'موتور C90',
    vehiclePlate: 'A-12345',
    nationalId: '',
    status: 'نشيط',
    dailyCapitalLimit: 1500,
    avatar: '🏍️',
    joinedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    notes: ''
  },
  {
    id: 'drv-2',
    teamId: 'team-1',
    name: 'حمزة بنسودة',
    phone: '0662233445',
    vehicle: 'موتور SH',
    vehiclePlate: 'B-67890',
    nationalId: '',
    status: 'نشيط',
    dailyCapitalLimit: 1000,
    avatar: '🛵',
    joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    notes: ''
  },
  {
    id: 'drv-3',
    teamId: 'team-1',
    name: 'ياسين المرابط',
    phone: '0663344556',
    vehicle: 'طوموبيل Picanto',
    vehiclePlate: '12345-A-1',
    nationalId: 'AB123456',
    status: 'نشيط',
    dailyCapitalLimit: 2000,
    avatar: '🚗',
    joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'مسؤول على التوصيلات البعيدة'
  },
  {
    id: 'drv-4',
    teamId: 'team-1',
    name: 'عمر التازي',
    phone: '0664455667',
    vehicle: 'موتور Docker',
    vehiclePlate: '',
    nationalId: '',
    status: 'موقوف',
    dailyCapitalLimit: 1000,
    avatar: '📦',
    joinedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'موقوف مؤقتاً - مشكل في التسليم'
  },

  // --- Team 2: فريق الصاعقة ---
  {
    id: 'drv-5',
    teamId: 'team-2',
    name: 'سعيد بناني',
    phone: '0665566778',
    vehicle: 'موتور C90',
    vehiclePlate: 'C-11111',
    nationalId: '',
    status: 'نشيط',
    dailyCapitalLimit: 1200,
    avatar: '🏍️',
    joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    notes: ''
  },
  {
    id: 'drv-6',
    teamId: 'team-2',
    name: 'كريم الفاسي',
    phone: '0666677889',
    vehicle: 'طوموبيل Clio',
    vehiclePlate: '54321-B-2',
    nationalId: 'CD789012',
    status: 'نشيط',
    dailyCapitalLimit: 1800,
    avatar: '🚗',
    joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    notes: ''
  },
  {
    id: 'drv-7',
    teamId: 'team-2',
    name: 'يونس الحسني',
    phone: '0667788990',
    vehicle: 'Vélo كهربائي',
    vehiclePlate: '',
    nationalId: '',
    status: 'نشيط',
    dailyCapitalLimit: 800,
    avatar: '🚲',
    joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'متخصص في توصيلات وسط المدينة'
  },

  // --- Team 3: فريق النسر (suspended) ---
  {
    id: 'drv-8',
    teamId: 'team-3',
    name: 'رشيد أمزيل',
    phone: '0668899001',
    vehicle: 'موتور SH',
    vehiclePlate: 'D-99999',
    nationalId: '',
    status: 'نشيط',
    dailyCapitalLimit: 1000,
    avatar: '🛵',
    joinedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: ''
  }
];

// ============================================================
// Default Settings (backwards compatibility)
// ============================================================
export const DEFAULT_SETTINGS = {
  dayDeliveryFee: 25,
  nightDeliveryFee: 35,
  nightStartHour: 20,
  nightEndHour: 6
};

// ============================================================
// Helper: Determine Active Fee (Day vs Night)
// ============================================================
export function getCurrentDeliveryFee(settings = DEFAULT_SETTINGS) {
  const currentHour = new Date().getHours();
  const nightStart = settings.nightStartHour || 20;
  const nightEnd = settings.nightEndHour || 6;

  const isNight = currentHour >= nightStart || currentHour < nightEnd;
  return isNight ? settings.nightDeliveryFee : settings.dayDeliveryFee;
}

// ============================================================
// Default Orders (الطلبيات التجريبية — مربوطة بالفرق)
// ============================================================
export const DEFAULT_ORDERS = [
  {
    id: 'ORD-101',
    teamId: 'team-1',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    customerName: 'كمال المراني',
    customerPhone: '0665544332',
    address: 'شارع الزرقطوني، المعاريف، قرب عمارة الأحباس دار 14',
    itemList: [
      { id: 'item-1', name: 'بيتزا مارغريتا حجم كبير', quantity: 2, price: 75 },
      { id: 'item-2', name: 'كوكا كولا 1.5L', quantity: 2, price: 15 }
    ],
    items: '2 بيتزا مارغريتا حجم كبير + 2 كوكا كولا 1.5L',
    sellingPrice: 180,
    estimatedCapital: 130,
    deliveryFee: 25,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    deliveredAt: null,
    actualCapital: null,
    actualDeliveryFee: null,
    totalCollected: null,
    driverNotes: '',
    paymentMethod: 'cash'
  },
  {
    id: 'ORD-102',
    teamId: 'team-1',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    customerName: 'فاطمة الزهراء البقالي',
    customerPhone: '0677889900',
    address: 'تجزئة الأزهار 2، الحي الحسني، زنقة 5 رقم 88',
    itemList: [
      { id: 'item-1', name: 'ساعة يد رجالية هدية', quantity: 1, price: 400 },
      { id: 'item-2', name: 'علبة التغليف الممتازة', quantity: 1, price: 50 }
    ],
    items: 'ساعة يد رجالية هدية + علبة التغليف الممتازة',
    sellingPrice: 450,
    estimatedCapital: 320,
    deliveryFee: 30,
    status: 'claimed',
    claimedBy: { id: 'drv-2', name: 'حمزة بنسودة' },
    claimedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    deliveredAt: null,
    actualCapital: null,
    actualDeliveryFee: null,
    totalCollected: null,
    driverNotes: '',
    paymentMethod: 'cash'
  },
  {
    id: 'ORD-103',
    teamId: 'team-1',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    customerName: 'عثمان الإدريسي',
    customerPhone: '0661998877',
    address: 'شارع فرنسا، أقدال، قبالة محطة القطار الرباط أقدال',
    itemList: [
      { id: 'item-1', name: 'حذاء رياضي Nike مقاس 43 (أصلي)', quantity: 1, price: 650 }
    ],
    items: 'حذاء رياضي Nike مقاس 43 (أصلي)',
    sellingPrice: 650,
    estimatedCapital: 480,
    deliveryFee: 35,
    status: 'delivered',
    claimedBy: { id: 'drv-1', name: 'أمين العوادي' },
    claimedAt: new Date(Date.now() - 100 * 60000).toISOString(),
    deliveredAt: new Date(Date.now() - 40 * 60000).toISOString(),
    actualCapital: 480,
    actualDeliveryFee: 35,
    totalCollected: 685,
    driverNotes: 'تم التسليم وتسلمت المبلغ كاملاً كاش',
    paymentMethod: 'cash'
  },
  // --- Team 2 Orders ---
  {
    id: 'ORD-201',
    teamId: 'team-2',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    customerName: 'نادية العلوي',
    customerPhone: '0671234567',
    address: 'حي الرياض، الرباط، زنقة الأمل رقم 22',
    itemList: [
      { id: 'item-1', name: 'قفطان مغربي تقليدي', quantity: 1, price: 800 }
    ],
    items: 'قفطان مغربي تقليدي',
    sellingPrice: 800,
    estimatedCapital: 550,
    deliveryFee: 20,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    deliveredAt: null,
    actualCapital: null,
    actualDeliveryFee: null,
    totalCollected: null,
    driverNotes: '',
    paymentMethod: 'cash'
  },
  {
    id: 'ORD-202',
    teamId: 'team-2',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    customerName: 'محمد أمين بنشقرون',
    customerPhone: '0679876543',
    address: 'حسان، الرباط، شارع الحسن الثاني',
    itemList: [
      { id: 'item-1', name: 'هاتف Samsung A54', quantity: 1, price: 3200 }
    ],
    items: 'هاتف Samsung A54',
    sellingPrice: 3200,
    estimatedCapital: 2800,
    deliveryFee: 20,
    status: 'delivered',
    claimedBy: { id: 'drv-6', name: 'كريم الفاسي' },
    claimedAt: new Date(Date.now() - 80 * 60000).toISOString(),
    deliveredAt: new Date(Date.now() - 50 * 60000).toISOString(),
    actualCapital: 2800,
    actualDeliveryFee: 20,
    totalCollected: 3220,
    driverNotes: 'الزبون تسلم المنتج بدون مشاكل',
    paymentMethod: 'cash'
  }
];

// ============================================================
// Helper: Parse WhatsApp Raw Text → Structured Order
// ============================================================
// ============================================================
// Multi-Tenant Helper Functions
// ============================================================

/** Get drivers belonging to a specific team */
export function getTeamDrivers(teamId, drivers = []) {
  return drivers.filter(d => d.teamId === teamId);
}

/** Get orders belonging to a specific team */
export function getTeamOrders(teamId, orders = []) {
  return orders.filter(o => o.teamId === teamId);
}

/** Generate a unique Team ID */
export function generateTeamId() {
  return 'team-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
}

/** Generate a unique Driver ID */
export function generateDriverId() {
  return 'drv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
}

/** Create a new team object with defaults */
export function createTeamObject(data) {
  return {
    id: generateTeamId(),
    name: data.name || '',
    brandName: data.brandName || '',
    logo: data.logo || '🚚',
    city: data.city || '',
    phone: data.phone || '',
    email: data.email || '',
    address: data.address || '',
    status: 'active',
    createdAt: new Date().toISOString(),
    adminPin: data.adminPin || '0000',
    settings: {
      dayDeliveryFee: data.dayDeliveryFee || 25,
      nightDeliveryFee: data.nightDeliveryFee || 35,
      nightStartHour: data.nightStartHour || 20,
      nightEndHour: data.nightEndHour || 6
    }
  };
}

/** Get all platform stats (for Super Admin) */
export function getPlatformStats(teams = [], drivers = [], orders = []) {
  const activeTeams = teams.filter(t => t.status === 'active');
  const activeDrivers = drivers.filter(d => d.status === 'نشيط');
  const suspendedDrivers = drivers.filter(d => d.status === 'موقوف');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const teamPerformance = teams.map(team => {
    const teamDrivers = getTeamDrivers(team.id, drivers);
    const teamOrders = getTeamOrders(team.id, orders);
    const teamDelivered = teamOrders.filter(o => o.status === 'delivered');
    return {
      ...team,
      driverCount: teamDrivers.length,
      activeDriverCount: teamDrivers.filter(d => d.status === 'نشيط').length,
      orderCount: teamOrders.length,
      deliveredCount: teamDelivered.length,
      totalRevenue: teamDelivered.reduce((sum, o) => sum + (o.totalCollected || 0), 0)
    };
  }).sort((a, b) => b.deliveredCount - a.deliveredCount);

  return {
    totalTeams: teams.length,
    activeTeams: activeTeams.length,
    totalDrivers: drivers.length,
    activeDrivers: activeDrivers.length,
    suspendedDrivers: suspendedDrivers.length,
    totalOrders: orders.length,
    deliveredOrders: deliveredOrders.length,
    teamPerformance
  };
}

// ============================================================
// Helper: Parse WhatsApp Raw Text → Structured Order
// ============================================================
export function parseWhatsAppMessage(rawText, currentSettings = DEFAULT_SETTINGS) {
  if (!rawText || typeof rawText !== 'string') return null;

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  let customerName = '';
  let customerPhone = '';
  let address = '';
  let items = '';
  let sellingPrice = '';
  let estimatedCapital = '';
  let deliveryFee = getCurrentDeliveryFee(currentSettings);

  lines.forEach(line => {
    const lower = line.toLowerCase();

    // Phone matching
    const phoneMatch = line.match(/(?:06|07|\+212)[0-9\s\-]{8,12}/);
    if (phoneMatch && !customerPhone) {
      customerPhone = phoneMatch[0].replace(/\s+|-/g, '');
    }

    // Name matching
    if (line.includes('الاسم') || line.includes('اسم') || lower.includes('nom') || lower.includes('client')) {
      customerName = line.replace(/.*(?:الاسم|اسم|nom|client)\s*[:=\-]\s*/i, '');
    }

    // Address matching
    if (line.includes('العنوان') || line.includes('عنوان') || lower.includes('adresse') || line.includes('حي') || line.includes('شارع')) {
      if (!address) {
        address = line.replace(/.*(?:العنوان|عنوان|adresse)\s*[:=\-]\s*/i, '');
      }
    }

    // Items matching
    if (line.includes('السلعة') || line.includes('طلب') || line.includes('المنتج') || line.includes('سلعة') || lower.includes('produit')) {
      items = line.replace(/.*(?:السلعة|طلب|المنتج|سلعة|produit)\s*[:=\-]\s*/i, '');
    }

    // Price matching
    if (line.includes('الثمن') || line.includes('تمن') || line.includes('السعر') || lower.includes('prix') || line.includes('درهم') || line.includes('dh')) {
      const numMatch = line.match(/\d+/);
      if (numMatch) {
        if (!sellingPrice) {
          sellingPrice = numMatch[0];
        } else if (line.includes('توصيل') || line.includes('ليقريزون')) {
          deliveryFee = Number(numMatch[0]);
        }
      }
    }
    
    // Capital / Ras lmal matching
    if (line.includes('رأس المال') || line.includes('راس المال') || line.includes('شراء') || line.includes('capital')) {
      const numMatch = line.match(/\d+/);
      if (numMatch) estimatedCapital = numMatch[0];
    }
  });

  // Fallback heuristic if empty fields
  if (!customerName && lines.length > 0 && !lines[0].match(/\d+/)) {
    customerName = lines[0];
  }
  if (!items && lines.length > 1) {
    items = lines.find(l => !l.includes(customerName) && !l.includes(customerPhone) && !l.includes(address)) || 'طلبية عامة';
  }

  const parsedPrice = sellingPrice ? Number(sellingPrice) : 200;

  return {
    customerName: customerName || 'زبون جديد',
    customerPhone: customerPhone || '0600000000',
    address: address || 'الشارع الرئيسي',
    items: items || 'محتويات الطلبية',
    itemList: [
      { id: 'parsed-1', name: items || 'محتويات الطلبية', quantity: 1, price: parsedPrice }
    ],
    sellingPrice: parsedPrice,
    estimatedCapital: estimatedCapital ? Number(estimatedCapital) : Math.round(parsedPrice * 0.7),
    deliveryFee: Number(deliveryFee)
  };
}
