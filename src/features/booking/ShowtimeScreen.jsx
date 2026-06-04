import React from 'react';

function ShowtimeScreen({ movie, showtimes, rooms, seats, bookings, onSelectShowtime, onBack }) {
  const lichChieuCuaPhim = showtimes.filter(st => String(st.movie_id) === String(movie.id));

  const getAvailabilityForShowtime = (showtime) => {
    const room = rooms.find((roomItem) => String(roomItem.id) === String(showtime.room_id)) || {};
    const roomSeats = seats.filter((seat) => String(seat.room_id) === String(showtime.room_id));
    const totalSeats = roomSeats.length || room.capacity || 0;
    const bookedCount = bookings.filter((booking) => String(booking.showtime_id) === String(showtime.id)).length;
    const available = Math.max(totalSeats - bookedCount, 0);

    if (available === 0) {
      return { text: `Hết vé (0/${totalSeats})`, icon: '🚫', color: '#f87171' };
    }
    if (available <= Math.max(3, Math.floor(totalSeats * 0.12))) {
      return { text: `Còn ít vé (${available}/${totalSeats})`, icon: '👥⚠️', color: '#fbbf24' };
    }
    return { text: `Còn vé ${available}/${totalSeats}`, icon: '👥', color: '#34d399' };
  };

  return (
    <div style={{ color: '#e2e8f0', minHeight: '80vh' }}>
      <button
        className="btn mb-4 fw-bold text-white border-0"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
          boxShadow: '0 18px 30px rgba(124, 58, 237, 0.35)'
        }}
        onClick={onBack}
      >⬅ Quay lại trang chủ</button>

      <div
        className="card p-4 shadow-xl border-0"
        style={{
          background: 'linear-gradient(180deg, rgba(8, 12, 28, 0.98), rgba(15, 23, 42, 0.98))',
          border: '1px solid rgba(124, 58, 237, 0.24)',
          boxShadow: '0 28px 80px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="d-flex align-items-start mb-3 gap-3">
          <div style={{ flex: '0 0 260px' }}>
            <img
              src={movie.image_url}
              alt={movie.title}
              style={{
                width: '100%',
                height: 380,
                objectFit: 'cover',
                borderRadius: 10,
                boxShadow: '0 20px 40px rgba(2,6,23,0.6)',
                filter: 'contrast(1.03) saturate(1.08)',
                display: 'block'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div>
              <h3 className="fw-bold mb-1" style={{ color: '#f9a8d4', fontSize: 36, lineHeight: 1.02 }}>🎬 {movie.title}</h3>
              <p className="mb-2" style={{ color: '#cbd5e1', fontSize: 16, maxWidth: '100%', lineHeight: 1.6 }}>{movie.description}</p>
              <p className="mb-0" style={{ color: '#cbd5e1', fontSize: 15 }}>Vui lòng chọn suất chiếu phù hợp.</p>
            </div>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '12px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: '#fbbf24', border: '1px solid rgba(255,255,255,0.14)', fontWeight: 700 }}>
                ⭐ {movie.rating}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '12px 18px', borderRadius: '999px', background: 'rgba(148,163,184,0.12)', color: '#cbd5e1', border: '1px solid rgba(148,163,184,0.22)', fontWeight: 700 }}>
                👁 {movie.viewers.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          {lichChieuCuaPhim.length > 0 ? (
            lichChieuCuaPhim.map((st) => (
              <div className="col-sm-6 col-md-4 mb-3" key={st.id}>
                <button
                  className="btn p-0 w-100 shadow-lg fw-bold"
                  style={{
                    border: '1px solid rgba(124, 58, 237, 0.35)',
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.96))',
                    color: '#e2e8f0',
                    minHeight: '150px',
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: 16,
                    textAlign: 'left'
                  }}
                  onClick={() => onSelectShowtime(st)}
                >
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px' }}>
                    <div style={{ flex: '0 0 120px' }}>
                      <img
                        src={movie.image_url}
                        alt={movie.title}
                        style={{ width: '120px', height: '94px', objectFit: 'cover', borderRadius: 14, display: 'block', filter: 'contrast(1.08) saturate(1.1)'}}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="fs-6 fw-semibold" style={{ color: '#c7d2fe' }}>
                        🏟 {rooms.find(r => r.id === st.room_id)?.name || 'Phòng chưa xác định'}
                      </div>
                      <div className="fs-2 fw-bold my-1" style={{ color: '#d8b4fe' }}>⏰ {st.show_time}</div>
                      <div className="small" style={{ color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                        Giá vé: {(st.ticket_price + (rooms.find(r => r.id === st.room_id)?.is_vip ? 50000 : 0)).toLocaleString()} VNĐ
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
                        {(() => {
                          const availability = getAvailabilityForShowtime(st);
                          return (
                            <span className="badge px-3 py-2 rounded-pill fw-bold" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: availability.color, border: `1px solid ${availability.color}33` }}>
                              <span style={{ marginRight: 6 }}>{availability.icon}</span>
                              {availability.text}
                            </span>
                          );
                        })()}
                        {rooms.find(r => r.id === st.room_id)?.is_vip && (
                          <span className="badge px-3 py-2 rounded-pill fw-bold" style={{ backgroundColor: 'rgba(248, 113, 113, 0.16)', color: '#fecaca', border: '1px solid rgba(248, 113, 113, 0.25)' }}>
                            VIP +50.000đ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4" style={{ color: '#94a3b8' }}>Hiện tại phim này chưa có lịch chiếu mới.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowtimeScreen;