import React, { useState, useEffect } from 'react';
import Notification from '../home/Notification';

function PaymentScreen({ ticketTotal = 0, comboTotal = 0, promoInfo = { type: 'none', valid: true, data: {} }, onBack, onConfirm }) {
  const methods = ['MoMo', 'ZaloPay', 'QR'];
  const [method, setMethod] = useState(methods[0]);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const promoType = promoInfo.type || 'none';
  const promoValid = promoInfo.valid === true;

  let promoDiscount = 0;
  if (promoType === 'student') {
    promoDiscount = Math.round(ticketTotal * 0.3);
  } else if (promoType === 'child') {
    promoDiscount = Math.round(ticketTotal * 0.5);
  } else if (promoType === 'group' && promoValid) {
    promoDiscount = Math.round(ticketTotal * 0.1);
  } else if (promoType === 'couple' && promoValid) {
    promoDiscount = Math.round(comboTotal * 0.15);
  }

  const total = ticketTotal + comboTotal - promoDiscount;

  useEffect(() => {
    if (!notification) return undefined;
    const timer = setTimeout(() => setNotification(null), 2800);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleConfirm = () => {
    if (isSubmitting) return;
    if (!promoValid) {
      setNotification('Vui lòng hoàn thành dữ liệu ưu đãi trước khi thanh toán.');
      return;
    }

    setIsSubmitting(true);
    setNotification(`Thanh toán thành công bằng ${method}.`);

    setTimeout(() => {
      const paymentPayload = {
        method,
        total,
        discount: promoDiscount,
        promoInfo
      };
      if (method === 'QR') {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        onConfirm({ ...paymentPayload, qrCode: code });
      } else {
        onConfirm(paymentPayload);
      }
      setIsSubmitting(false);
    }, 900);
  };

  const renderPromoDetails = () => {
    if (promoType === 'none') return <div className="small text-secondary">Không có ưu đãi thêm.</div>;
    if (promoType === 'student') {
      return (
        <div className="small text-secondary">Trường: {promoInfo.data.student?.school || '---'} | Khóa: {promoInfo.data.student?.course || '---'} | Đã xuất trình thẻ</div>
      );
    }
    if (promoType === 'child') {
      return (
        <div className="small text-secondary">Ngày sinh: {promoInfo.data.child?.birthDate || '---'} | Tuổi: {promoInfo.data.child?.age ?? '---'}</div>
      );
    }
    if (promoType === 'group') {
      return (
        <div className="small text-secondary">Số lượng thành viên: {promoInfo.data.group?.length || 0}</div>
      );
    }
    if (promoType === 'couple') {
      return (
        <div className="small text-secondary">Ảnh cặp đôi: {promoInfo.data.couple?.fileName || 'Chưa chọn'}</div>
      );
    }
    return null;
  };

  return (
    <div style={{ color: '#e2e8f0', minHeight: '80vh' }}>
      <button
        className="btn mb-4 fw-bold text-white border-0"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          boxShadow: '0 18px 28px rgba(124, 58, 237, 0.30)'
        }}
        onClick={onBack}
      >⬅ Quay lại chọn combo</button>

      <div
        className="card p-4 shadow-sm border-0"
        style={{
          background: 'rgba(15, 23, 42, 0.94)',
          border: '1px solid rgba(79, 70, 229, 0.18)'
        }}
      >
        <h3 className="fw-bold mb-3" style={{ color: '#c4b5fd' }}>Chọn phương thức thanh toán</h3>

        <div className="mb-3">
          {methods.map((m) => (
            <div
              key={m}
              className="form-check mb-2"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 12,
                padding: '10px 14px',
                border: method === m ? '1px solid rgba(124, 58, 237, 0.45)' : '1px solid transparent'
              }}
            >
              <input
                className="form-check-input"
                type="radio"
                name="pay"
                id={`pay-${m}`}
                checked={method === m}
                onChange={() => setMethod(m)}
                style={{ accentColor: '#7c3aed' }}
              />
              <label className="form-check-label ms-2" htmlFor={`pay-${m}`} style={{ color: '#e2e8f0' }}>{m}</label>
            </div>
          ))}
        </div>

        <div className="border-top pt-3 mt-3" style={{ color: '#94a3b8' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>Promo áp dụng:</div>
            <div className="fw-bold" style={{ color: '#c4b5fd' }}>{promoType === 'none' ? 'Không' : promoType}</div>
          </div>
          {renderPromoDetails()}
        </div>

        <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center" style={{ color: '#94a3b8' }}>
          <div>Giảm giá ưu đãi:</div>
          <div className="fs-5 fw-bold" style={{ color: '#34d399' }}>-{promoDiscount.toLocaleString()} VNĐ</div>
        </div>

        <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center" style={{ color: '#94a3b8' }}>
          <div>Tổng Vé + Combo sau ưu đãi:</div>
          <div className="fs-4 fw-bold" style={{ color: '#c4b5fd' }}>{total.toLocaleString()} VNĐ</div>
        </div>

        <button
          className="btn w-100 fw-bold mt-4 py-3 text-white border-0"
          style={{
            background: isSubmitting ? 'rgba(124, 58, 237, 0.7)' : 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          onClick={handleConfirm}
          disabled={isSubmitting || !promoValid}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Thanh toán'}
        </button>

        {!promoValid && (
          <div className="text-warning small mt-3">Vui lòng hoàn tất dữ liệu ưu đãi trước khi thanh toán.</div>
        )}
      </div>

      {notification && <Notification message={notification} />}
    </div>
  );
}

export default PaymentScreen;
