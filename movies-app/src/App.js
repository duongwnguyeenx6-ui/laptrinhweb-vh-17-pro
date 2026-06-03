import React, { useState } from 'react';

// Import 4 màn hình con từ thư mục components
import MovieList from './components/MovieList';
import ShowtimeScreen from './components/ShowtimeScreen';
import SeatScreen from './components/SeatScreen';
import AuthScreen from './components/AuthScreen';
import ComboScreen from './components/ComboScreen';
import PaymentScreen from './components/PaymentScreen';
import MyTickets from './components/MyTickets';
import defaultDatabase from './data/database';

function App() {
  const users = defaultDatabase.users;
  const rooms = defaultDatabase.rooms;
  const movies = defaultDatabase.movies;
  const showtimes = defaultDatabase.showtimes;
  const seats = defaultDatabase.seats;
  const [bookings, setBookings] = useState(defaultDatabase.bookings);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('movie-list');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [comboInfo, setComboInfo] = useState({ comboCounts: {}, comboTotal: 0 });
  const [pendingSelection, setPendingSelection] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  return (
    <div className="app-shell">
      <div className="container">
        {currentScreen === 'movie-list' && (
          <MovieList 
            movies={movies} 
            showtimes={showtimes}
            currentUser={currentUser}
            onSelectMovie={(movie) => { 
              setSelectedMovie(movie); 
              setCurrentScreen('showtime-list'); 
            }}
            onGoToAuth={() => setCurrentScreen('auth')}
            onLogout={() => setCurrentUser(null)}
          />
        )}

        {currentScreen === 'showtime-list' && (
          <ShowtimeScreen 
            movie={selectedMovie} 
            showtimes={showtimes} 
            rooms={rooms}
            onSelectShowtime={(st) => { 
              setSelectedShowtime(st); 
              setCurrentScreen('seat-plan'); 
            }}
            onBack={() => setCurrentScreen('movie-list')} 
          />
        )}

        {currentScreen === 'seat-plan' && (
          <SeatScreen 
            showtime={selectedShowtime} 
            movie={selectedMovie}
            seats={seats}
            bookings={bookings}
            onSeatsSelected={(sel) => { setPendingSelection(sel); setCurrentScreen('combo'); }}
            onBack={() => setCurrentScreen('showtime-list')}
          />
        )}

        {currentScreen === 'combo' && (
          <ComboScreen 
            ticketTotal={selectedShowtime ? selectedShowtime.ticket_price * 1 : 0}
            onBack={() => setCurrentScreen('seat-plan')}
            onNext={(info) => { setComboInfo(info); setCurrentScreen('payment'); }}
          />
        )}

        {currentScreen === 'payment' && (
          <PaymentScreen 
            ticketTotal={selectedShowtime ? selectedShowtime.ticket_price * 1 : 0}
            comboTotal={comboInfo.comboTotal}
            onBack={() => setCurrentScreen('combo')}
            onConfirm={(pay) => {
              // create bookings now that payment confirmed
              const seatIds = (pendingSelection && pendingSelection.seat_ids) || [];
              const groupId = `group-${Date.now()}`;
              const newBookings = seatIds.map(id => ({
                id: Math.random().toString(36).substr(2, 9),
                showtime_id: pendingSelection.showtime_id,
                seat_id: id,
                user_id: currentUser ? currentUser.id : null,
                paid: true,
                paymentMethod: pay.method || null,
                qrCode: pay.qrCode || null,
                original_booking_id: groupId
              }));
              setBookings([...bookings, ...newBookings]);
              setPaymentResult(pay);
              setPendingSelection(null);
              setCurrentScreen('payment-success');
            }}
          />
        )}

        {currentScreen === 'payment-success' && (
          <div>
            <div className="card p-4 shadow-sm border-0 bg-white" style={{ backgroundColor: '#faf5ff' }}>
              <h3 className="fw-bold" style={{ color: '#7c3aed' }}>Thanh toán thành công 🎉</h3>
              <p className="text-secondary">Cảm ơn bạn đã thanh toán. Vé của bạn đã được lưu trong mục "Vé của tôi".</p>
              {paymentResult && paymentResult.qrCode && (
                <div className="mt-3">
                  <div className="fw-bold">Mã QR thanh toán:</div>
                  <div style={{ width: 140, height: 80, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }} className="mt-2">QR {paymentResult.qrCode}</div>
                </div>
              )}
              <div className="d-flex gap-2 mt-3">
                <button className="btn w-50 fw-bold py-2" style={{ background: '#f3f4f6', borderRadius: 8 }} onClick={() => setCurrentScreen('movie-list')}>Về trang chủ</button>
                <button className="btn w-50 fw-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', borderRadius: 8 }} onClick={() => setCurrentScreen('my-tickets')}>Xem Vé Của Tôi</button>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'my-tickets' && (
          <MyTickets
            bookings={bookings}
            movies={movies}
            showtimes={showtimes}
            seats={seats}
            rooms={rooms}
            currentUser={currentUser}
            onCancelBooking={(bookingId) => {
              if (!window.confirm('Bạn có chắc muốn hủy vé này?')) return;
              setBookings(prev => prev.filter(b => b.id !== bookingId));
            }}
            onCancelOrder={(originalBookingId) => {
              if (!window.confirm('Bạn có chắc muốn hủy toàn bộ đơn này? (tất cả ghế sẽ bị hủy)')) return;
              setBookings(prev => prev.filter(b => b.original_booking_id !== originalBookingId));
            }}
            onBackHome={() => setCurrentScreen('movie-list')}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen users={users} onLogin={(user) => { setCurrentUser(user); setCurrentScreen('movie-list'); }} onBack={() => setCurrentScreen('movie-list')} />
        )}
      </div>
    </div>
  );
}

export default App;