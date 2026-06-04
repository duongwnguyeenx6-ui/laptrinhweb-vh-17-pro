import React from 'react';
import ShowtimeScreen from './ShowtimeScreen';
import SeatScreen from './SeatScreen';
import ComboScreen from './ComboScreen';
import PaymentScreen from './PaymentScreen';
import MyTickets from './MyTickets';

// movies-app-done
function BookingFeature({
  currentScreen,
  selectedMovie,
  selectedShowtime,
  showtimes,
  rooms,
  seats,
  movies,
  bookings,
  currentUser,
  pendingSelection,
  comboInfo,
  promoInfo,
  paymentResult,
  onBackToHome,
  onSelectShowtime,
  onSeatsSelected,
  onComboNext,
  onPaymentConfirm,
  onCancelBooking,
  onCancelOrder,
  onBackToShowtime,
  onBackToSeat,
  onBackToCombo,
  onViewTickets,
}) {
  if (currentScreen === 'showtime-list') {
    return (
      <ShowtimeScreen
        movie={selectedMovie}
        showtimes={showtimes}
        rooms={rooms}
        seats={seats}
        bookings={bookings}
        onSelectShowtime={onSelectShowtime}
        onBack={onBackToHome}
      />
    );
  }

  if (currentScreen === 'seat-plan') {
    return (
      <SeatScreen
        showtime={selectedShowtime}
        movie={selectedMovie}
        seats={seats}
        rooms={rooms}
        bookings={bookings}
        onSeatsSelected={onSeatsSelected}
        onBack={onBackToShowtime}
      />
    );
  }

  if (currentScreen === 'combo') {
    return (
      <ComboScreen
        ticketTotal={pendingSelection ? pendingSelection.ticketTotal : 0}
        selectedSeatCount={pendingSelection ? pendingSelection.seat_ids.length : 0}
        onBack={onBackToSeat}
        onNext={onComboNext}
      />
    );
  }

  if (currentScreen === 'payment') {
    return (
      <PaymentScreen
        ticketTotal={pendingSelection ? pendingSelection.ticketTotal : 0}
        comboTotal={comboInfo.comboTotal}
        promoInfo={promoInfo}
        onBack={onBackToCombo}
        onConfirm={onPaymentConfirm}
      />
    );
  }

  if (currentScreen === 'payment-success') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          zIndex: 9999,
          padding: '20px',
        }}
      >
        <div className="card p-4 shadow-sm border-0 card-theme" style={{ maxWidth: 520, width: '100%', borderRadius: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-600) 0%, #ec4899 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: 22,
                boxShadow: '0 18px 30px rgba(124, 58, 237, 0.25)',
              }}
            >
              ✓
            </div>
            <h3 className="fw-bold mb-0" style={{ color: '#c4b5fd' }}>Thanh toán thành công</h3>
          </div>
          <p style={{ color: '#cbd5e1', marginBottom: 24 }}>
            Cảm ơn bạn đã đặt vé tại CinemaHub. Vé của bạn đã được lưu, vui lòng kiểm tra mục "Vé của tôi" trước khi vào rạp.
          </p>
          {paymentResult && (paymentResult.movieTitle || paymentResult.show_date) && (
            <div style={{ marginBottom: 12, color: '#cbd5e1' }}>
              <div className="fw-bold" style={{ color: '#e2e8f0' }}>{paymentResult.movieTitle}</div>
              <div className="small">Suất: {paymentResult.show_date} • {paymentResult.show_time}</div>
            </div>
          )}
          {paymentResult && paymentResult.qrCode && (
            <div className="mt-3">
              <div className="fw-bold" style={{ color: '#e2e8f0', marginBottom: 10 }}>Mã QR thanh toán:</div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 200,
                  height: 88,
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                  border: '1px solid rgba(148, 163, 184, 0.16)',
                  color: '#cbd5e1',
                  fontWeight: 700,
                }}
                className="mt-2"
              >
                QR {paymentResult.qrCode}
              </div>
            </div>
          )}
          {paymentResult && paymentResult.promoInfo && (
            <>
              <div className="mt-3 p-3" style={{ borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                <div className="fw-bold" style={{ color: '#e2e8f0', marginBottom: 8 }}>Chi tiết ưu đãi</div>
                <div className="small text-secondary">Loại ưu đãi: {paymentResult.promoInfo.type || 'Không'}</div>
                {paymentResult.promoInfo.type === 'student' && (
                  <div className="small text-secondary mt-1">Trường: {paymentResult.promoInfo.data?.student?.school || '---'} • Khóa: {paymentResult.promoInfo.data?.student?.course || '---'}</div>
                )}
                {paymentResult.promoInfo.type === 'child' && (
                  <div className="small text-secondary mt-1">Ngày sinh: {paymentResult.promoInfo.data?.child?.birthDate || '---'} • Tuổi: {paymentResult.promoInfo.data?.child?.age ?? '---'}</div>
                )}
                {paymentResult.promoInfo.type === 'group' && (
                  <div className="small text-secondary mt-1">Số thành viên: {paymentResult.promoInfo.data?.group?.members?.length || 0}</div>
                )}
                {paymentResult.promoInfo.type === 'couple' && (
                  <>
                    <div className="small text-secondary mt-1">Ảnh cặp đôi: {paymentResult.promoInfo.data?.couple?.fileName || 'Chưa chọn'}</div>
                    {paymentResult.promoInfo.data?.couple?.comboAdded && (
                      <div className="small text-secondary mt-1">Tặng thêm: 1 × Combo Bắp lớn + Nước</div>
                    )}
                  </>
                )}
                {paymentResult.discount != null && (
                  <div className="small text-success mt-2">Giảm giá: -{paymentResult.discount.toLocaleString()} VNĐ</div>
                )}
              </div>
              <div className="mt-4 p-4" style={{ borderRadius: 18, background: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
                <div className="fw-bold mb-3" style={{ color: '#e2e8f0' }}>Hóa đơn thanh toán</div>
                <div className="small text-secondary mb-2">Mã hóa đơn: <strong style={{ color: '#e2e8f0' }}>{paymentResult.orderId}</strong></div>
                <div className="small text-secondary mb-2">Khách hàng: <strong style={{ color: '#e2e8f0' }}>{paymentResult.customerName}</strong></div>
                <div className="small text-secondary mb-2">Phương thức: <strong style={{ color: '#e2e8f0' }}>{paymentResult.method || '---'}</strong></div>
                <div className="small text-secondary mb-2">Phòng: <strong style={{ color: '#e2e8f0' }}>{paymentResult.roomName}</strong></div>
                <div className="small text-secondary mb-2">Ghế: <strong style={{ color: '#e2e8f0' }}>{(paymentResult.seatNumbers || []).join(', ') || '---'}</strong></div>
                <div className="small text-secondary mb-2">Giá vé: <strong style={{ color: '#e2e8f0' }}>{paymentResult.ticketPrice?.toLocaleString() || '0'} VNĐ</strong></div>
                <div className="small text-secondary mb-2">Số lượng vé: <strong style={{ color: '#e2e8f0' }}>{paymentResult.ticketCount || 0}</strong></div>
                <div className="small text-secondary mb-2">Giá tiền: <strong style={{ color: '#e2e8f0' }}>{paymentResult.ticketTotal?.toLocaleString() || '0'} VNĐ</strong></div>
                <div className="small text-secondary mb-2">Combo: <strong style={{ color: '#e2e8f0' }}>{paymentResult.comboTotal?.toLocaleString() || '0'} VNĐ</strong></div>
                <div className="small text-secondary mb-2">Tổng thanh toán: <strong style={{ color: '#c4b5fd' }}>{paymentResult.total?.toLocaleString() || '0'} VNĐ</strong></div>
                <div className="small text-secondary">Ngày: <strong style={{ color: '#e2e8f0' }}>{paymentResult.orderDate}</strong></div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', borderRadius: 12, padding: '10px 16px' }}
                    onClick={() => window.print()}
                  >
                    In hóa đơn
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="d-flex gap-3 flex-wrap mt-4" style={{ justifyContent: 'center' }}>
            <button className="btn fw-bold py-2 btn-muted" style={{ borderRadius: 14, minWidth: '150px' }} onClick={onBackToHome}>Về trang chủ</button>
            <button className="btn fw-bold text-white py-2 btn-primary" style={{ borderRadius: 14, minWidth: '150px' }} onClick={onViewTickets}>Xem Vé Của Tôi</button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'my-tickets') {
    return (
      <MyTickets
        bookings={currentUser?.role === 'admin' ? bookings : bookings.filter(b => String(b.user_id) === String(currentUser?.id))}
        movies={movies}
        showtimes={showtimes}
        seats={seats}
        rooms={rooms}
        currentUser={currentUser}
        onCancelBooking={onCancelBooking}
        onCancelOrder={onCancelOrder}
        onBackHome={onBackToHome}
      />
    );
  }

  return null;
}

export default BookingFeature;
