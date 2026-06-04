import React, { useState } from 'react';

function AdminPanel({
  users = [],
  movies = [],
  showtimes = [],
  rooms = [],
  bookings = [],
  onCancelBooking,
  onCancelOrder,
  onAddShowtime,
  onDeleteShowtime,
  onManageMovies,
  onBackHome,
}) {
  const [newShowtime, setNewShowtime] = useState({ movie_id: '', room_id: '', show_date: '', show_time: '', ticket_price: '' });
  const [formError, setFormError] = useState('');
  const [confirmDeleteShowtime, setConfirmDeleteShowtime] = useState(null);
  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);

  const movieOptions = movies.map(movie => ({ value: movie.id, label: movie.title }));
  const roomOptions = rooms.map(room => ({ value: room.id, label: room.name }));

  const groupedBookings = bookings.reduce((acc, b) => {
    const key = b.original_booking_id || b.id;
    acc[key] = acc[key] || [];
    acc[key].push(b);
    return acc;
  }, {});

  const panelInputStyle = {
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.16)',
    minHeight: 48,
  };

  const selectedMovieShowtimes = showtimes.filter((st) => String(st.movie_id) === String(newShowtime.movie_id));
  const selectedMovieRoomIds = Array.from(new Set(selectedMovieShowtimes.map((st) => String(st.room_id))));
  const selectedMovieRooms = rooms.filter((room) => selectedMovieRoomIds.includes(String(room.id)));

  const handleDeleteShowtimeClick = (showtime) => {
    setConfirmDeleteShowtime(showtime);
  };

  const handleConfirmDeleteShowtime = () => {
    if (!confirmDeleteShowtime || !onDeleteShowtime) return;
    onDeleteShowtime(confirmDeleteShowtime.id);
    setConfirmDeleteShowtime(null);
  };

  const handleCancelDeleteShowtime = () => {
    setConfirmDeleteShowtime(null);
  };

  const handleConfirmCancelOrder = () => {
    if (!confirmCancelOrder || !onCancelOrder) return;
    onCancelOrder(confirmCancelOrder.groupId);
    setConfirmCancelOrder(null);
  };

  const handleCancelCancelOrder = () => {
    setConfirmCancelOrder(null);
  };

  const handleAddShowtime = (e) => {
    e.preventDefault();
    if (!newShowtime.movie_id || !newShowtime.room_id || !newShowtime.show_date || !newShowtime.show_time || !newShowtime.ticket_price) {
      setFormError('Vui lòng nhập đầy đủ thông tin suất chiếu.');
      return;
    }
    setFormError('');
    onAddShowtime({
      ...newShowtime,
      id: `st-${Date.now()}`,
      movie_id: Number(newShowtime.movie_id),
      room_id: Number(newShowtime.room_id),
      ticket_price: Number(newShowtime.ticket_price)
    });
    setNewShowtime({
      movie_id: newShowtime.movie_id,
      room_id: '',
      show_date: '',
      show_time: '',
      ticket_price: ''
    });
  };

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 24px 40px', minHeight: '100vh' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-5" style={{ padding: '16px 0' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(79, 70, 229, 0.18)', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 700 }}>
            ADMIN PANEL
          </div>
          <h2 className="fw-bold mb-2" style={{ color: '#ffffff', fontSize: '2.4rem', lineHeight: 1.04 }}>Bảng điều khiển quản trị</h2>
          <p className="mb-0" style={{ color: '#cbd5e1', maxWidth: 660, fontSize: '1rem' }}>Quản lý phim, suất chiếu và đơn vé với giao diện đồng bộ, hiện đại và dễ sử dụng. Tất cả tác vụ điều hành đều hiển thị rõ ràng ngay trong một trang.</p>
        </div>
        <div className="d-flex flex-wrap gap-3" style={{ justifyContent: 'flex-end' }}>
          <button
            className="btn fw-bold text-white btn-primary"
            style={{ borderRadius: 18, padding: '14px 26px', fontSize: '0.98rem', boxShadow: '0 18px 42px rgba(79, 70, 229, 0.16)' }}
            onClick={onManageMovies}
          >
            Quản lý phim
          </button>
          <button className="btn fw-bold text-white btn-muted" style={{ borderRadius: 18, padding: '14px 26px', fontSize: '0.98rem' }} onClick={onBackHome}>Về trang chủ</button>
        </div>
      </div>

      <div className="row gy-4 align-items-start">
        <div className="col-12 col-xl-5">
          <div className="card-theme p-4 shadow-sm mb-4" style={{ borderRadius: 26, minHeight: 260 }}>
            <h5 className="fw-bold mb-4" style={{ color: '#ffffff', fontSize: '1.1rem' }}>Thống kê nhanh</h5>
            <div className="d-flex justify-content-between align-items-center mb-3"><span style={{ color: '#cbd5e1' }}>Người dùng</span><strong style={{ fontSize: '1rem', color: '#ffffff' }}>{users.length}</strong></div>
            <div className="d-flex justify-content-between align-items-center mb-3"><span style={{ color: '#cbd5e1' }}>Phim</span><strong style={{ fontSize: '1rem', color: '#ffffff' }}>{movies.length}</strong></div>
            <div className="d-flex justify-content-between align-items-center mb-3"><span style={{ color: '#cbd5e1' }}>Suất chiếu</span><strong style={{ fontSize: '1rem', color: '#ffffff' }}>{showtimes.length}</strong></div>
            <div className="d-flex justify-content-between align-items-center"><span style={{ color: '#cbd5e1' }}>Đơn vé</span><strong style={{ fontSize: '1rem', color: '#ffffff' }}>{Object.keys(groupedBookings).length}</strong></div>
          </div>

          <div className="card-theme p-4 shadow-sm" style={{ borderRadius: 26 }}>
            <h5 className="fw-bold mb-4" style={{ color: '#ffffff', fontSize: '1.1rem' }}>Danh sách đơn vé</h5>
            {Object.keys(groupedBookings).length === 0 && <p className="text-white">Chưa có đơn vé nào.</p>}
            {Object.entries(groupedBookings).map(([groupId, group]) => {
              const first = group[0];
              const orderUser = users.find(u => u.id === first.user_id);
              return (
                <div key={groupId} className="p-3 mb-3" style={{ borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.16)' }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div style={{ minWidth: 220 }}>
                      <div className="fw-bold" style={{ color: '#ffffff', fontSize: '0.98rem' }}>Đơn {groupId}</div>
                      <div className="text-white small">Người dùng: {orderUser?.username || 'Khách'}</div>
                      {orderUser && (
                        <>
                          <div className="text-white small">Email: {orderUser.email}</div>
                          <div className="text-white small">Vai trò: {orderUser.role}</div>
                        </>
                      )}
                      <div className="text-white small">Trạng thái: {first.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn btn-sm fw-bold btn-danger" style={{ borderRadius: 14, padding: '10px 16px' }} onClick={() => setConfirmCancelOrder({ groupId, order: first })}>🗑 Hủy đơn</button>
                    </div>
                  </div>
                  <div className="mt-3 small" style={{ color: '#cbd5e1' }}>Ghế: {group.map(b => b.seat_id).join(', ')}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-12 col-xl-7">
          <div className="card-theme p-3 shadow-sm" style={{ borderRadius: 22, minHeight: 'auto', background: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(124, 58, 237, 0.18)' }}>
            <h5 className="fw-bold mb-3" style={{ color: '#ffffff', fontSize: '1.05rem' }}>Tạo suất chiếu mới</h5>
            {formError && (
              <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 14, background: 'rgba(248, 113, 113, 0.14)', border: '1px solid rgba(248, 113, 113, 0.3)', color: '#fee2e2' }}>
                {formError}
              </div>
            )}
            <form onSubmit={handleAddShowtime}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <select className="form-select" style={panelInputStyle} value={newShowtime.movie_id} onChange={(e) => setNewShowtime(prev => ({ ...prev, movie_id: e.target.value }))}>
                    <option value="">Chọn phim</option>
                    {movieOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <select className="form-select" style={panelInputStyle} value={newShowtime.room_id} onChange={(e) => setNewShowtime(prev => ({ ...prev, room_id: e.target.value }))}>
                    <option value="">Chọn phòng</option>
                    {roomOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <input type="date" className="form-control" style={panelInputStyle} value={newShowtime.show_date} onChange={(e) => setNewShowtime(prev => ({ ...prev, show_date: e.target.value }))} />
                </div>
                <div className="col-6">
                  <input type="time" className="form-control" style={panelInputStyle} value={newShowtime.show_time} onChange={(e) => setNewShowtime(prev => ({ ...prev, show_time: e.target.value }))} />
                </div>
                <div className="col-12 col-md-6">
                  <input type="number" min="0" className="form-control" style={panelInputStyle} placeholder="Giá vé" value={newShowtime.ticket_price} onChange={(e) => setNewShowtime(prev => ({ ...prev, ticket_price: e.target.value }))} />
                </div>
                <div className="col-12 col-md-6 d-grid">
                  <button type="submit" className="btn fw-bold text-white btn-primary" style={{ borderRadius: 14, padding: '14px 18px' }}>Lưu suất chiếu</button>
                </div>
              </div>
            </form>

            <div className="mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18 }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0" style={{ color: '#ffffff', fontSize: '0.95rem' }}>Phòng đã tạo cho phim</h6>
                <span className="small" style={{ color: '#94a3b8' }}>{selectedMovieShowtimes.length} suất đang sử dụng</span>
              </div>
              {selectedMovieShowtimes.length === 0 ? (
                <div className="text-white small">Chọn phim để xem phòng đã tạo cho suất chiếu.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <thead>
                      <tr style={{ color: '#94a3b8', textAlign: 'left', fontSize: '0.83rem' }}>
                        <th style={{ padding: '10px 12px' }}>Phòng</th>
                        <th style={{ padding: '10px 12px' }}>VIP</th>
                        <th style={{ padding: '10px 12px' }}>Sức chứa</th>
                        <th style={{ padding: '10px 12px' }}>Suất chiếu</th>
                        <th style={{ padding: '10px 12px' }}>Giá vé</th>
                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMovieShowtimes.map((st) => {
                        const room = rooms.find((r) => r.id === st.room_id) || {};
                        return (
                          <tr key={st.id} style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '12px', color: '#ffffff' }}>{room.name || 'Phòng chưa rõ'}</td>
                            <td style={{ padding: '12px', color: room.is_vip ? '#fbbf24' : '#94a3b8' }}>{room.is_vip ? 'VIP' : 'Thường'}</td>
                            <td style={{ padding: '12px', color: '#ffffff' }}>{room.capacity || '—'}</td>
                            <td style={{ padding: '12px', color: '#ffffff' }}>{st.show_date} {st.show_time}</td>
                            <td style={{ padding: '12px', color: '#ffffff' }}>{st.ticket_price?.toLocaleString('vi-VN')}₫</td>
                            <td style={{ padding: '12px', color: '#ffffff', width: 80 }}>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                style={{ minWidth: 38, padding: '8px 10px', borderRadius: 10 }}
                                onClick={() => handleDeleteShowtimeClick(st)}
                                title="Xóa suất chiếu"
                                aria-label="Xóa suất chiếu"
                              >
                                🗑
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {confirmDeleteShowtime && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 420, borderRadius: 24, background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.96) 100%)', border: '1px solid rgba(99,102,241,0.24)', boxShadow: '0 24px 60px rgba(15,23,42,0.45)', padding: '24px 22px' }}>
            <div style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>Xác nhận xóa suất chiếu</div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: 22 }}>
              Bạn chắc chắn muốn xóa suất chiếu <strong>{confirmDeleteShowtime.show_date} {confirmDeleteShowtime.show_time}</strong>?
            </p>
            <div className="d-flex gap-3 justify-content-end">
              <button type="button" className="btn btn-sm btn-muted" style={{ borderRadius: 12, minWidth: 100, padding: '10px 14px', color: '#cbd5e1', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} onClick={handleCancelDeleteShowtime}>❌ Không</button>
              <button type="button" className="btn btn-sm btn-danger" style={{ borderRadius: 12, minWidth: 100, padding: '10px 14px' }} onClick={handleConfirmDeleteShowtime}>🗑 Có</button>
            </div>
          </div>
        </div>
      )}
      {confirmCancelOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 420, borderRadius: 24, background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.96) 100%)', border: '1px solid rgba(99,102,241,0.24)', boxShadow: '0 24px 60px rgba(15,23,42,0.45)', padding: '24px 22px' }}>
            <div style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>Bạn có chắc muốn hủy đơn này?</div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: 22 }}>
              Đơn <strong>{confirmCancelOrder.groupId}</strong> của <strong>{confirmCancelOrder.order?.user_id ? (users.find((u) => u.id === confirmCancelOrder.order.user_id)?.username || 'Người dùng') : 'Người dùng'}</strong> sẽ bị hủy.
            </p>
            <div className="d-flex gap-3 justify-content-end">
              <button type="button" className="btn btn-sm btn-muted" style={{ borderRadius: 12, minWidth: 100, padding: '10px 14px', color: '#cbd5e1', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} onClick={handleCancelCancelOrder}>❌ Không</button>
              <button type="button" className="btn btn-sm btn-danger" style={{ borderRadius: 12, minWidth: 100, padding: '10px 14px' }} onClick={handleConfirmCancelOrder}>🗑 Có</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
