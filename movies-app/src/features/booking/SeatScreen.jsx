/* eslint-disable unicode-bom */
import React, { useState, useEffect } from 'react';
import Notification from '../home/Notification';

const generateSeatLayout = (roomId, capacity) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rows = Math.ceil(capacity / 10);
  const seats = [];
  let index = 1;

  for (let row = 0; row < rows && row < letters.length; row += 1) {
    for (let col = 1; col <= 10 && index <= capacity; col += 1) {
      seats.push({
        id: `gen-${roomId}-${letters[row]}${col}`,
        room_id: roomId,
        seat_number: `${letters[row]}${col}`
      });
      index += 1;
    }
  }

  return seats;
};

function SeatScreen({ showtime, movie, rooms, seats, bookings, onSeatsSelected, onBack }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = setTimeout(() => setNotification(null), 2800);
    return () => clearTimeout(timer);
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const isSeatBooked = (seatId) => bookings.some((b) => b.showtime_id === showtime.id && b.seat_id === seatId);

  const currentRoom = rooms.find((room) => room.id === showtime.room_id) || {};
  const isVipRoom = currentRoom.is_vip === true;
  const effectiveRoomCapacity = isVipRoom ? Math.min(currentRoom.capacity || 0, 50) : (currentRoom.capacity || 0);
  const actualTicketPrice = showtime.ticket_price + (isVipRoom ? 50000 : 0);

  const getSeatRow = (seatNumber) => {
    const match = seatNumber.match(/^([A-Za-z]+)/);
    return match ? match[1].toUpperCase() : '';
  };

  const getSeatIndex = (seatNumber) => {
    const match = seatNumber.match(/(\d+)$/);
    return match ? Number(match[1]) : 0;
  };

  const roomSeats = seats.filter((seat) => String(seat.room_id) === String(showtime.room_id));
  const isGeneratedLayout = roomSeats.length === 0 && currentRoom.capacity;
  const seatLayout = isGeneratedLayout
    ? generateSeatLayout(currentRoom.id, effectiveRoomCapacity)
    : roomSeats;

  const MAX_SELECTABLE_SEATS = effectiveRoomCapacity || 45;
  const sortedSeats = [...seatLayout].sort((a, b) => {
    const rowA = getSeatRow(a.seat_number);
    const rowB = getSeatRow(b.seat_number);
    if (rowA !== rowB) return rowA.localeCompare(rowB);
    return getSeatIndex(a.seat_number) - getSeatIndex(b.seat_number);
  });

  const displayedSeats = sortedSeats.slice(0, MAX_SELECTABLE_SEATS);

  const seatRows = displayedSeats.reduce((acc, seat) => {
    const row = getSeatRow(seat.seat_number);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const selectedTotal = selectedSeats.length * actualTicketPrice;
  const displayedCapacity = roomSeats.length || effectiveRoomCapacity;

  const handleSeatClick = (seat) => {
    if (isSeatBooked(seat.id)) return;
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.id));
      return;
    }
    if (selectedSeats.length >= MAX_SELECTABLE_SEATS) {
      showNotification(`Chỉ được chọn tối đa ${MAX_SELECTABLE_SEATS} ghế.`, 'warning');
      return;
    }
    setSelectedSeats([...selectedSeats, seat.id]);
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      showNotification('Vui lòng chọn ít nhất 1 ghế trước khi bấm xác nhận!', 'warning');
      return;
    }

    showNotification(`Đặt vé thành công! Bạn đã chọn ${selectedSeats.length} ghế.`, 'success');
    onSeatsSelected({
      showtime_id: showtime.id,
      movie_id: movie.id,
      seat_ids: selectedSeats,
      ticketTotal: selectedTotal,
    });
    setSelectedSeats([]);
  };

  return (
    <div style={{ color: '#e2e8f0', minHeight: '80vh', padding: '24px 14px', backgroundColor: 'rgba(15, 23, 42, 0.98)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <button
          className="btn mb-4 fw-bold text-white border-0"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            boxShadow: '0 18px 30px rgba(124, 58, 237, 0.30)',
          }}
          onClick={onBack}
        >
          ⬅ Quay lại suất chiếu
        </button>

        <div className="card-theme p-4 shadow-sm mb-4" style={{ borderRadius: 26, background: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(79, 70, 229, 0.24)' }}>
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <img
              src={movie.image_url}
              alt={movie.title}
              style={{ width: 140, height: 210, borderRadius: 20, objectFit: 'cover', boxShadow: '0 18px 30px rgba(0, 0, 0, 0.18)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 className="fw-bold mb-2" style={{ color: '#f9a8d4', fontSize: '1.8rem' }}>{movie.title}</h3>
              <div className="small mb-2" style={{ color: '#cbd5e1' }}>
                Phòng chiếu: <strong style={{ color: '#e2e8f0' }}>{currentRoom.name || 'Chưa rõ'}</strong>
                {isVipRoom && <span style={{ marginLeft: 10, color: '#fecaca' }}>• VIP</span>}
              </div>
              <div className="small mb-2" style={{ color: '#cbd5e1' }}>
                Suất chiếu: <strong style={{ color: '#e2e8f0' }}>{showtime.show_date} • {showtime.show_time}</strong>
              </div>
              <div className="small" style={{ color: '#cbd5e1' }}>
                Sức chứa phòng: <strong style={{ color: '#e2e8f0' }}>{displayedCapacity}</strong> ghế
              </div>
            </div>
          </div>
        </div>

        <div className="row gx-4">
          <div className="col-lg-8 mb-4">
            <div
              className="card p-4 shadow-lg border-0 text-center"
              style={{
                background: 'rgba(15, 23, 42, 0.96)',
                border: '1px solid rgba(79, 70, 229, 0.24)',
                minHeight: 'calc(100vh - 170px)',
              }}
            >
              <div
                className="mx-auto"
                style={{
                  width: '100%',
                  maxWidth: 740,
                  padding: '18px 24px',
                  borderRadius: 30,
                  background: 'rgba(255,255,255,0.08)',
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.25)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: 12,
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08), rgba(255,255,255,0.35))',
                    boxShadow: '0 0 18px rgba(255,255,255,0.2)',
                  }}
                />
                <div
                  style={{
                    marginTop: 14,
                    borderRadius: 24,
                    background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.95), rgba(255,255,255,0.6))',
                    padding: '18px 20px',
                    boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <div className="fw-bold text-center" style={{ color: '#0f172a', letterSpacing: '2px', fontSize: '1.05rem' }}>
                    MÀN HÌNH CHIẾU
                  </div>
                </div>
              </div>
              {roomSeats.length > MAX_SELECTABLE_SEATS && (
                <p className="mt-3 mb-0 text-center" style={{ color: '#fbbf24', fontWeight: 600 }}>
                  Lưu ý: chỉ hiển thị tối đa {MAX_SELECTABLE_SEATS} ghế để phù hợp layout.
                </p>
              )}

              <div className="mx-auto mt-4" style={{ width: '100%', overflowX: 'auto' }}>
                {Object.keys(seatRows).map((row) => (
                  <div key={row} className="d-flex align-items-center mb-3" style={{ gap: '16px' }}>
                    <div className="fw-bold" style={{ minWidth: '30px', color: '#cbd5e1', fontSize: '0.95rem' }}>
                      {row}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 84px)', justifyContent: 'center', gap: '14px', minWidth: 900 }}>
                      {seatRows[row].map((seat) => {
                        const booked = isSeatBooked(seat.id);
                        const selected = selectedSeats.includes(seat.id);

                        let btnClass = 'btn fw-bold';
                        let btnStyle = {
                          width: '78px',
                          height: '70px',
                          backgroundColor: 'rgba(15, 23, 42, 0.92)',
                          color: '#e2e8f0',
                          border: '1px solid rgba(148, 163, 184, 0.18)',
                          borderRadius: 16,
                          fontSize: '0.95rem',
                        };

                        if (booked) {
                          btnClass = 'btn fw-bold disabled text-white';
                          btnStyle = {
                            ...btnStyle,
                            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                            color: 'white',
                            border: '1px solid rgba(236, 72, 153, 0.45)',
                            cursor: 'not-allowed',
                          };
                        }

                        if (selected) {
                          btnClass = 'btn fw-bold text-white shadow';
                          btnStyle = {
                            ...btnStyle,
                            background: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)',
                            color: '#0f172a',
                            border: '1px solid rgba(250, 204, 21, 0.45)',
                          };
                        }

                        return (
                          <button key={seat.id} className={btnClass} style={btnStyle} onClick={() => handleSeatClick(seat)}>
                            {seat.seat_number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center gap-4 mt-5 border-top pt-3 small fw-bold" style={{ color: '#94a3b8' }}>
                <div>
                  <span className="badge me-1" style={{ width: '15px', height: '15px', backgroundColor: '#475569' }} /> Trống
                </div>
                <div>
                  <span className="badge me-1" style={{ width: '15px', height: '15px', backgroundColor: '#facc15' }} /> Đang chọn
                </div>
                <div>
                  <span className="badge me-1" style={{ width: '15px', height: '15px', backgroundColor: '#ec4899' }} /> Đã đặt
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card p-4 shadow-sm border-0 sticky-top"
              style={{
                top: '20px',
                background: 'rgba(15, 23, 42, 0.94)',
                border: '1px solid rgba(79, 70, 229, 0.18)',
              }}
            >
              <h4 className="fw-bold border-bottom pb-2" style={{ color: '#e2e8f0' }}>
                Thông Tin Đặt Vé
              </h4>
              <div className="mb-3 mt-2" style={{ color: '#cbd5e1' }}>
                Phim: <strong className="fs-5 d-block" style={{ color: '#f472b6' }}>{movie.title}</strong>
              </div>
              <div className="mb-2" style={{ color: '#cbd5e1' }}>
                Suất Chiếu: <strong style={{ color: '#e2e8f0' }}>{showtime.show_time} | {showtime.show_date}</strong>
              </div>
              <div className="mb-4" style={{ color: '#cbd5e1' }}>
                Số lượng ghế: <strong className="badge fs-6" style={{ backgroundColor: 'rgba(124, 58, 237, 0.18)', color: '#e2e8f0' }}>{selectedSeats.length} ghế</strong>
              </div>

              <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                <span className="fw-bold" style={{ color: '#cbd5e1' }}>Tổng Vé:</span>
                <h3 className="fw-bold m-0" style={{ color: '#facc15' }}>{selectedTotal.toLocaleString()} VNĐ</h3>
              </div>
              <div className="small mt-2" style={{ color: '#94a3b8' }}>
                Giá mỗi ghế: {actualTicketPrice.toLocaleString()} VNĐ{isVipRoom ? ' (Phòng VIP +50.000 VNĐ)' : ''}
              </div>

              <button
                className="btn w-100 fw-bold mt-4 py-3 fs-5 shadow text-white border-0"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                }}
                onClick={handleConfirm}
              >
                ✓ XÁC NHẬN ĐẶT VÉ
              </button>
            </div>
          </div>
        </div>
      </div>
      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
}

export default SeatScreen;
