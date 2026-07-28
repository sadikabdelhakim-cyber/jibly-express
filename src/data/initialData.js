// Initial Demo Data for Drivers and Orders in Moroccan Context

export const DEFAULT_DRIVERS = [
  { id: 'drv-1', name: 'أمين العوادي', phone: '0661122334', vehicle: 'موتور C90', status: 'نشيط', dailyCapitalLimit: 1500, avatar: '🏍️' },
  { id: 'drv-2', name: 'حمزة بنسودة', phone: '0662233445', vehicle: 'موتور SH', status: 'نشيط', dailyCapitalLimit: 1000, avatar: '🛵' },
  { id: 'drv-3', name: 'ياسين المرابط', phone: '0663344556', vehicle: 'طوموبيل Picanto', status: 'نشيط', dailyCapitalLimit: 2000, avatar: '🚗' },
  { id: 'drv-4', name: 'عمر التازي', phone: '0664455667', vehicle: 'موتور Docker', status: 'نشيط', dailyCapitalLimit: 1000, avatar: '📦' }
];

export const DEFAULT_SETTINGS = {
  dayDeliveryFee: 25,
  nightDeliveryFee: 35,
  nightStartHour: 20, // 20:00 (8 PM)
  nightEndHour: 6     // 06:00 (6 AM)
};

// Helper to determine active fee based on Day vs Night current time
export function getCurrentDeliveryFee(settings = DEFAULT_SETTINGS) {
  const currentHour = new Date().getHours();
  const nightStart = settings.nightStartHour || 20;
  const nightEnd = settings.nightEndHour || 6;

  const isNight = currentHour >= nightStart || currentHour < nightEnd;
  return isNight ? settings.nightDeliveryFee : settings.dayDeliveryFee;
}

export const DEFAULT_ORDERS = [
  {
    id: 'ORD-101',
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
  }
];

// Helper to parse WhatsApp raw text into structured order object
export function parseWhatsAppMessage(rawText, currentSettings = DEFAULT_SETTINGS) {
  if (!rawText || typeof rawText !== 'string') return null;

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  let customerName = '';
  let customerPhone = '';
  let address = '';
  let items = '';
  let sellingPrice = '';
  let estimatedCapital = '';
  let deliveryFee = getCurrentDeliveryFee(currentSettings); // Auto day/night fee!

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
