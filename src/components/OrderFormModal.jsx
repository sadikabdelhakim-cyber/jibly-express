import React, { useState, useEffect } from 'react';
import { PackagePlus, Save, MapPin, Phone, User, ShoppingBag, DollarSign, Sun, Moon, Plus, Trash2 } from 'lucide-react';
import { getCurrentDeliveryFee } from '../data/initialData';

export default function OrderFormModal({ isOpen, onClose, onSubmitOrder, initialValues = null, settings }) {
  const currentFee = getCurrentDeliveryFee(settings);
  const isNight = new Date().getHours() >= (settings?.nightStartHour || 20) || new Date().getHours() < (settings?.nightEndHour || 6);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    deliveryFee: currentFee,
    paymentMethod: 'cash',
    driverNotes: ''
  });

  const [itemList, setItemList] = useState([
    { id: '1', name: '', quantity: 1, price: 100 }
  ]);

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        setFormData(prev => ({
          ...prev,
          customerName: initialValues.customerName || '',
          customerPhone: initialValues.customerPhone || '',
          address: initialValues.address || '',
          deliveryFee: initialValues.deliveryFee || currentFee,
          driverNotes: initialValues.driverNotes || ''
        }));

        if (Array.isArray(initialValues.itemList) && initialValues.itemList.length > 0) {
          setItemList(initialValues.itemList);
        } else if (initialValues.items) {
          setItemList([{ id: '1', name: initialValues.items, quantity: 1, price: initialValues.sellingPrice || 100 }]);
        }
      } else {
        setFormData(prev => ({
          ...prev,
          customerName: '',
          customerPhone: '',
          address: '',
          deliveryFee: currentFee
        }));
        setItemList([{ id: '1', name: '', quantity: 1, price: 100 }]);
      }
    }
  }, [initialValues, isOpen, settings]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Fee') ? Number(value) : value
    }));
  };

  const handleItemChange = (id, field, value) => {
    setItemList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'quantity' || field === 'price' ? Number(value) : value
        };
      }
      return item;
    }));
  };

  const handleAddItem = () => {
    setItemList(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', quantity: 1, price: 50 }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (itemList.length <= 1) return;
    setItemList(prev => prev.filter(item => item.id !== id));
  };

  const itemsSubtotal = itemList.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  const grandTotal = itemsSubtotal + Number(formData.deliveryFee || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.address) return;

    const validItems = itemList.filter(i => i.name.trim().length > 0);
    const formattedItemsText = validItems.map(i => `${i.quantity}x ${i.name} (${i.price} DH)`).join(' + ') || 'طلب عام';

    onSubmitOrder({
      ...formData,
      itemList: validItems.length > 0 ? validItems : [{ id: '1', name: 'طلب عام', quantity: 1, price: itemsSubtotal }],
      items: formattedItemsText,
      sellingPrice: itemsSubtotal,
      estimatedCapital: Math.round(itemsSubtotal * 0.7) // estimated internal baseline
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
              <PackagePlus size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>إضافة طلبية جديدة للفريق</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                الطلبية غاتطلع فالحين لكل ليفرور اللي مساليين باش ياكسبتيوا
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            
            {/* Customer Name */}
            <div className="input-group">
              <label className="input-label"><User size={14} /> اسم الزبون:</label>
              <input
                type="text"
                name="customerName"
                className="input-field"
                placeholder="أحمد التازي"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Customer Phone */}
            <div className="input-group">
              <label className="input-label"><Phone size={14} /> رقم الهاتف:</label>
              <input
                type="text"
                name="customerPhone"
                className="input-field"
                placeholder="0661234567"
                value={formData.customerPhone}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Detailed Full Address ONLY (No Zone/Region) */}
          <div className="input-group">
            <label className="input-label"><MapPin size={14} /> العنوان الكامل بالتفصيل (بدون حي/منطقة):</label>
            <input
              type="text"
              name="address"
              className="input-field"
              placeholder="شارع الزرقطوني، عمارة الأمل رقم 5، المعاريف، الدار البيضاء"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dynamic Itemized Products Section */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label className="input-label" style={{ marginBottom: 0, fontWeight: 800, color: 'var(--text-main)' }}>
                <ShoppingBag size={16} style={{ color: 'var(--cyan)' }} /> تفاصيل السلع المطلوبة (قائمة المنتجات والأثمنة):
              </label>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddItem}
                style={{ fontSize: '0.8rem' }}
              >
                <Plus size={14} /> + إضافة منتج أخر
              </button>
            </div>

            {itemList.map((item, index) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder={`اسم المنتج ${index + 1}`}
                  value={item.name}
                  onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="الكمية"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                  min="1"
                  required
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="الثمن (DH)"
                  value={item.price}
                  onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                  min="0"
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ padding: '8px' }}
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={itemList.length <= 1}
                  title="حذف المنتج"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Pricing Details Breakdown (Simplified: Items Total + Delivery Fee = Grand Total) */}
          <div style={{
            background: 'var(--bg-input)',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            marginBottom: '16px'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={16} style={{ color: 'var(--primary)' }} /> ملخص الأثمنة الواجب دفعها:
              </span>
              <span className={`badge ${isNight ? 'badge-cyan' : 'badge-amber'}`}>
                {isNight ? <><Moon size={12} /> توقيت ليلي ({currentFee} DH)</> : <><Sun size={12} /> توقيت نهاري ({currentFee} DH)</>}
              </span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">مجموع الطلبية (مجموع السلع):</label>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  {itemsSubtotal} DH
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">ثمن التوصيل (DH):</label>
                <input
                  type="number"
                  name="deliveryFee"
                  className="input-field"
                  style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  min="0"
                />
              </div>

            </div>

            {/* Total Collected Highlight */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
              border: '1.5px solid var(--primary)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
              marginTop: '14px'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
                المجموع الإجمالي لي غايخلص الكليان (كاش 💵):
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                {grandTotal} درهم
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                ({itemsSubtotal} DH مجموع السلع + {formData.deliveryFee} DH التوصيل)
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>نشر الطلبية للفريق</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
