import React, { useState } from 'react';

function MyTickets({ bookings = [], movies = [], showtimes = [], seats = [], rooms = [], currentUser = null, onCancelBooking = null, onCancelOrder = null, onBackHome }) {
  const [cancelDialog, setCancelDialog] = useState({ open: false, mode: null, targetId: null, title: '', reason: '' });
  const findShowtime = (id) => showtimes.find(s => s.id === id) || {};
  const findMovie = (movie_id) => movies.find(m => m.id === movie_id) || {};
  const findSeat = (id) => seats.find(s => s.id === id) || {};
  const findRoom = (id) => rooms.find(r => r.id === id) || {};

  // group bookings by original_booking_id (fallback to individual id)
  const groups = bookings.reduce((acc, b) => {
    const key = b.original_booking_id || b.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const groupKeys = Object.keys(groups);

  const openCancelDialog = (mode, targetId, title) => {
    setCancelDialog({ open: true, mode, targetId, title, reason: '' });
  };

  const closeCancelDialog = () => {
    setCancelDialog({ open: false, mode: null, targetId: null, title: '', reason: '' });
  };

  const confirmCancel = () => {
    if (!cancelDialog.reason.trim()) return;
    if (cancelDialog.mode === 'order') {
      onCancelOrder?.(cancelDialog.targetId, cancelDialog.reason.trim());
    } else {
      onCancelBooking?.(cancelDialog.targetId, cancelDialog.reason.trim());
    }
    closeCancelDialog();
  };

  return (
    <div style={{ color: '#e2e8f0', minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-0" style={{ color: '#c4b5fd' }}>Vé của tôi</h3>
        <button
          className="btn fw-bold py-2 px-3"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            color: 'white',
            borderRadius: 10,
            boxShadow: '0 14px 30px rgba(124, 58, 237, 0.28)'
          }}
          onClick={onBackHome}
        >Quay lại trang chủ</button>
      </div>
      <div className="row">
        {bookings.length === 0 && (
          <div className="col-12" style={{ color: '#94a3b8' }}>Bạn chưa có vé nào.</div>
        )}

        {groupKeys.map((gk) => {
          const group = groups[gk];
          const first = group[0];
          const st = findShowtime(first.showtime_id);
          const movie = findMovie(st.movie_id);
          const room = findRoom(st.room_id);
          return (
            <div key={gk} className="col-12 col-md-6 mb-3">
              <div
                className="card p-3 shadow-sm"
                style={{
                  position: 'relative',
                  borderRadius: 18,
                  background: 'rgba(15, 23, 42, 0.94)',
                  border: '1px solid rgba(79, 70, 229, 0.18)'
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold" style={{ color: '#f8fafc' }}>{movie.title}</div>
                    <div className="small" style={{ color: '#94a3b8' }}>{st.show_date} • {st.show_time}</div>
                    <div className="mt-2" style={{ color: '#cbd5e1' }}>Phòng: <strong style={{ color: '#e2e8f0' }}>{room.name || 'Chưa rõ'}</strong></div>
                    <div className="mt-2" style={{ color: '#cbd5e1' }}>Ghế: <strong style={{ color: '#e2e8f0' }}>{group.map(b => findSeat(b.seat_id).seat_number).join(', ')}</strong></div>
                    <div className="mt-3 p-3" style={{ borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                      <div className="small text-secondary mb-2">Thông tin ưu đãi</div>
                      {first.promoType ? (
                        <>
                          <div className="fw-bold" style={{ color: '#e2e8f0', fontSize: 14 }}>{first.promoType === 'none' ? 'Không áp dụng ưu đãi' : `Ưu đãi: ${first.promoType}`}</div>
                          {first.promoType === 'student' && (
                            <div className="small text-secondary mt-1">Trường: {first.promoData?.student?.school || '---'} • Khóa: {first.promoData?.student?.course || '---'}</div>
                          )}
                          {first.promoType === 'child' && (
                            <div className="small text-secondary mt-1">Ngày sinh: {first.promoData?.child?.birthDate || '---'} • Tuổi: {first.promoData?.child?.age ?? '---'}</div>
                          )}
                          {first.promoType === 'group' && (
                            <div className="small text-secondary mt-1">Số thành viên: {first.promoData?.group?.members?.length || 0}</div>
                          )}
                          {first.promoType === 'couple' && (
                            <>
                              <div className="small text-secondary mt-1">Ảnh cặp đôi: {first.promoData?.couple?.fileName || 'Chưa chọn'}</div>
                              {first.promoData?.couple?.comboAdded && (
                                <div className="small text-secondary mt-1">Tặng thêm: 1 × Combo Bắp lớn + Nước</div>
                              )}
                            </>
                          )}
                          {first.promoDiscount > 0 && (
                            <div className="small text-success mt-2">Giảm giá: -{first.promoDiscount.toLocaleString()} VNĐ</div>
                          )}
                        </>
                      ) : (
                        <div className="small text-secondary">Chưa có thông tin ưu đãi.</div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      className="badge"
                      style={{
                        background: first.paid ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : '#334155',
                        color: first.paid ? 'white' : '#cbd5e1',
                        padding: '8px 12px',
                        borderRadius: 8
                      }}
                    >{first.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                    {currentUser && String(first.user_id) === String(currentUser.id) && onCancelOrder && (
                      <div style={{ position: 'absolute', right: 20, bottom: 20 }}>
                        <button className="btn btn-sm btn-danger d-flex align-items-center gap-2" style={{ borderRadius: 14, padding: '10px 14px', boxShadow: '0 10px 24px rgba(220, 38, 38, 0.28)' }} onClick={() => openCancelDialog('order', first.original_booking_id || gk, 'Hủy cả đơn vé')}>
                          <span role="img" aria-label="hủy">🗑️</span>
                          Hủy đơn
                        </button>
                      </div>
                    )}
                    {currentUser && String(first.user_id) === String(currentUser.id) && onCancelBooking && (
                      <div className="mt-2 small" style={{ color: '#94a3b8' }}>Bạn cũng có thể hủy từng ghế bên dưới.</div>
                    )}
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2 flex-wrap">
                  {group.map(b => {
                    const seat = findSeat(b.seat_id);
                    return (
                      <div key={b.id} style={{ minWidth: 120 }}>
                        <div className="small" style={{ color: '#94a3b8' }}>{seat.seat_number}</div>
                        {currentUser && String(b.user_id) === String(currentUser.id) && onCancelBooking && (
                          <button className="btn btn-sm btn-outline-danger mt-1 d-flex align-items-center gap-2" onClick={() => openCancelDialog('booking', b.id, `Hủy ghế ${seat.seat_number}`)}>
                            <span role="img" aria-label="hủy">🗑️</span>
                            Hủy ghế
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cancelDialog.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 520, background: '#0f172a', borderRadius: 24, padding: 28, boxShadow: '0 24px 80px rgba(15, 23, 42, 0.9)', border: '1px solid rgba(148, 163, 184, 0.18)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div className="fw-bold" style={{ color: '#eef2ff', fontSize: '1.1rem' }}>{cancelDialog.title}</div>
                <div className="small" style={{ color: '#94a3b8' }}>Vui lòng nhập lý do hủy đặt vé để hoàn tất.</div>
              </div>
              <button onClick={closeCancelDialog} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: 24, lineHeight: 1, cursor: 'pointer' }}>×</button>
            </div>
            <textarea
              value={cancelDialog.reason}
              onChange={(e) => setCancelDialog(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Nhập lý do hủy..."
              style={{ width: '100%', minHeight: 120, resize: 'vertical', borderRadius: 16, border: '1px solid rgba(148, 163, 184, 0.18)', background: '#0f172a', color: '#e2e8f0', padding: 14, fontSize: 15, outline: 'none' }}
            />
            <div className="d-flex gap-3 justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', borderRadius: 12, padding: '10px 18px' }}
                onClick={closeCancelDialog}
              >
                Quay lại
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: 12, padding: '10px 18px' }}
                onClick={confirmCancel}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTickets;
