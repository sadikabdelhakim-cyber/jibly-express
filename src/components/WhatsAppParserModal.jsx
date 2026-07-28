import React, { useState } from 'react';
import { MessageSquare, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { parseWhatsAppMessage } from '../data/initialData';

export default function WhatsAppParserModal({ isOpen, onClose, onParsedOrder }) {
  const [rawText, setRawText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!rawText.trim()) return;
    const result = parseWhatsAppMessage(rawText);
    setParsedResult(result);
  };

  const handleApply = () => {
    if (parsedResult) {
      onParsedOrder(parsedResult);
      onClose();
      setRawText('');
      setParsedResult(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#25D366', color: '#fff', padding: '8px', borderRadius: '10px' }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>تحويل ميساج الواتساب لطلبية</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                كولي الميساج د الزبون هنا والتطبيق غايستخرج التفاصيل تلقائياً!
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Input Textarea */}
        <div className="input-group">
          <label className="input-label">نص الرسالة من الواتساب (Paste WhatsApp Message):</label>
          <textarea
            className="input-field"
            rows={5}
            placeholder={`مثال:\nالاسم: كمال المراني\nالهاتف: 0661223344\nالعنوان: المعاريف زنقة الزرقطوني دار 12\nالسلعة: 2 بيتزا مارغريتا\nالثمن: 180 درهم`}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              if (parsedResult) setParsedResult(null);
            }}
          />
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginBottom: '16px' }}
          onClick={handleParse}
          disabled={!rawText.trim()}
        >
          <Sparkles size={18} />
          <span>استخراج معلومات الطلبية تلقائياً</span>
        </button>

        {/* Parsed Preview Card */}
        {parsedResult && (
          <div style={{
            background: 'var(--bg-input)',
            border: '1px dashed var(--primary)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '16px',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, marginBottom: '10px' }}>
              <Sparkles size={16} />
              <span>النتيجة المستخرجة من النص:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>الاسم: </strong>
                <span>{parsedResult.customerName}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>الهاتف: </strong>
                <span>{parsedResult.customerPhone}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ color: 'var(--text-muted)' }}>العنوان: </strong>
                <span>{parsedResult.address}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ color: 'var(--text-muted)' }}>السلعة/الطلب: </strong>
                <span>{parsedResult.items}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>ثمن السلعة: </strong>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{parsedResult.sellingPrice} درهم</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>تمن التوصيل: </strong>
                <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{parsedResult.deliveryFee} درهم</span>
              </div>
            </div>

            <button
              className="btn btn-amber"
              style={{ width: '100%', marginTop: '14px' }}
              onClick={handleApply}
            >
              <span>تحويل لنموذج إضافة الطلبية</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
