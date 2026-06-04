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
  onManageMovies,
  onBackHome,
}) {
  const [newShowtime, setNewShowtime] = useState({ movie_id: '', room_id: '', show_date: '', show_time: '', ticket_price: '' });

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

  const handleAddShowtime = (e) => {
    e.preventDefault();
    if (!newShowtime.movie_id || !newShowtime.room_id || !newShowtime.show_date || !newShowtime.show_time || !newShowtime.ticket_price) {
      alert('Vui lòng nhập đầy đủ thông tin suất chiếu.');
      return;
    }
    onAddShowtime({
      ...newShowtime,
      id: `st-${Date.now()}`,
      movie_id: Number(newShowtime.movie_id),
      room_id: Number(newShowtime.room_id),
      ticket_price: Number(newShowtime.ticket_price)
    });
    setNewShowtime({ movie_id: '', room_id: '', show_date: '', show_time: '', ticket_price: '' });
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 16px' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4" style={{ padding: '16px 0' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(79, 70, 229, 0.18)', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 700 }}>
            ADMIN PANEL
          </div>
          <h2 className="fw-bold mb-2" style={{ color: '#ffffff', fontSize: '2rem' }}>Bảng điều khiển quản trị</h2>
          <p className="mb-0" style={{ color: '#ffffff', maxWidth: 560, fontSize: '0.98rem' }}>Quản lý phim, suất chiếu và đơn vé với giao diện đồng bộ, hiện đại và dễ sử dụng.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn fw-bold text-white btn-primary"
            style={{ borderRadius: 18, padding: '12px 22px', fontSize: '0.98rem', boxShadow: '0 18px 42px rgba(79, 70, 229, 0.16)' }}
            onClick={onManageMovies}
          >
            Quản lý phim
          </button>
          <button className="btn fw-bold text-white btn-muted" style={{ borderRadius: 18, padding: '12px 22px', fontSize: '0.98rem' }} onClick={onBackHome}>Về trang chủ</button>
        </div>
      </div>

      <div className="row gy-4">
        <div className="col-12 col-lg-4">
          <div className="card-theme p-4 shadow-sm" style={{ borderRadius: 24, minHeight: 220 }}>
            <h5 className="fw-bold mb-4" style={{ color: '#ffffff', fontSize: '1.05rem' }}>Thống kê nhanh</h5>
            <div className="d-flex justify-content-between align-items-center mb-3"><span style={{ color: '#ffffff' }}>Người dùng</span><strong style={{ fontSize: '1rem', color: '#ffffff' }}>{users.length}</strong></div>
            <div className="d-flex justify-content-between align-items-center mb-3"><span style={{ color: '#ffffff' }}>Phim</span><strong style={{ fontSize: '1rem', color: '#ffffff' }}>{movies.length}</strong></div>
            <div className="d-flex justify-content-between align-items-center mb-3"><span style={{ color: '#ffffff' }}>Suất chiếu</span><strong style={{ fontSize: '1rem', color: '#ffffff' }}>{showtimes.length}</strong></div>
            <div className="d-flex justify-content-between align-items-center"><span style={{ color: '#ffffff' }}>Đơn vé</span><strong style={{ fontSize: '1rem', color: '#ffffff' }}>{Object.keys(groupedBookings).length}</strong></div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card-theme p-3 shadow-sm mb-4" style={{ borderRadius: 22 }}>
            <h5 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Tạo suất chiếu mới</h5>
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
                  <button type="submit" className="btn fw-bold text-white btn-primary" style={{ borderRadius: 10, padding: '10px 18px' }}>Lưu suất chiếu</button>
                </div>
              </div>
            </form>
          </div>

          <div className="card-theme p-3 shadow-sm" style={{ borderRadius: 22 }}>
            <h5 className="fw-bold mb-4" style={{ color: '#ffffff' }}>Danh sách đơn vé</h5>
            {Object.keys(groupedBookings).length === 0 && <p className="text-white">Chưa có đơn vé nào.</p>}
            {Object.entries(groupedBookings).map(([groupId, group]) => {
              const first = group[0];
              const orderUser = users.find(u => u.id === first.user_id);
              return (
                <div key={groupId} className="p-3 mb-3" style={{ borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.16)' }}>
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
                      <button className="btn btn-sm fw-bold btn-danger" style={{ borderRadius: 12, padding: '10px 16px' }} onClick={() => onCancelOrder(groupId)}>Hủy đơn</button>
                    </div>
                  </div>
                  <div className="mt-3 small" style={{ color: '#ffffff' }}>Ghế: {group.map(b => b.seat_id).join(', ')}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
