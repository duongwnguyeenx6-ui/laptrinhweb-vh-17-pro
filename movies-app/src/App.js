import React, { useState, useEffect } from 'react';
import './App.css';

import InfoPage from './features/home/InfoPage';
import defaultDatabase from './data/database';
import AuthFeature from './features/auth/AuthFeature';
import HomeFeature from './features/home/HomeFeature';
import BookingFeature from './features/booking/BookingFeature';
import AdminFeature from './features/admin/AdminFeature';
import { saveUsers, loadUsers, saveCurrentUser, loadCurrentUser, saveMovies, loadMovies, saveShowtimes, loadShowtimes, saveBookings, loadBookings, clearStorage } from './services/storageService';

function App() {
  // Tải dữ liệu từ localStorage hoặc sử dụng dữ liệu mặc định
  const [users, setUsers] = useState(() => {
    const stored = loadUsers();
    return stored || defaultDatabase.users;
  });
  
  const [rooms] = useState(defaultDatabase.rooms);
  const parseNumericValue = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
    return value;
  };

  const normalizeShowtime = (showtime) => ({
    ...showtime,
    id: parseNumericValue(showtime.id),
    movie_id: parseNumericValue(showtime.movie_id),
    room_id: parseNumericValue(showtime.room_id),
    ticket_price: Number(showtime.ticket_price) || 0,
  });

  const [movies, setMovies] = useState(() => {
    const stored = loadMovies();
    return stored || defaultDatabase.movies;
  });
  const [showtimes, setShowtimes] = useState(() => {
    const stored = loadShowtimes();
    return Array.isArray(stored) ? stored.map(normalizeShowtime) : defaultDatabase.showtimes;
  });
  const [seats] = useState(defaultDatabase.seats);
  const [bookings, setBookings] = useState(() => {
    const stored = loadBookings();
    return stored || defaultDatabase.bookings;
  });

  // Tải currentUser từ localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    return loadCurrentUser();
  });
  const [currentScreen, setCurrentScreen] = useState('movie-list');

  // Lưu users vào localStorage khi có thay đổi
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  // Lưu danh sách phim vào localStorage khi có thay đổi
  useEffect(() => {
    saveMovies(movies);
  }, [movies]);

  // Lưu suất chiếu vào localStorage khi có thay đổi
  useEffect(() => {
    saveShowtimes(showtimes);
  }, [showtimes]);

  // Lưu booking vào localStorage khi có thay đổi
  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  // Lưu currentUser vào localStorage khi có thay đổi
  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [comboInfo, setComboInfo] = useState({ comboCounts: {}, comboTotal: 0 });
  const [promoInfo, setPromoInfo] = useState({ type: 'none', valid: true, data: {} });
  const [pendingSelection, setPendingSelection] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [statusMessage, setStatusMessage] = useState('');
  const [scrollTarget, setScrollTarget] = useState(null);
  const [adminView, setAdminView] = useState('panel');

  const handleNavigate = (screen, data) => {
    if (screen === 'showtime-list' && data) {
      setSelectedMovie(data);
      setCurrentScreen('showtime-list');
      return;
    }

    if (screen === 'home' || screen === 'movies' || screen === 'genres' || screen === 'deals' || screen === 'contact') {
      setCurrentScreen('movie-list');
      setScrollTarget(screen);
      return;
    }

    if (screen === 'faq' || screen === 'support' || screen === 'terms' || screen === 'privacy' || screen === 'cookies') {
      setCurrentScreen(screen);
      return;
    }

    if (screen === 'my-tickets') {
      setCurrentScreen('my-tickets');
      return;
    }

    if (screen === 'admin') {
      setCurrentScreen('admin');
      return;
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentScreen('movie-list');
    setStatusMessage('');
  };

  const handleRegister = (newUser) => {
    const existing = users.find(u => u.email === newUser.email);
    if (existing) {
      setStatusMessage('Email đã tồn tại, vui lòng dùng email khác.');
      return false;
    }
    const createdUser = { ...newUser, id: `u-${Date.now()}` };
    setUsers(prev => [...prev, createdUser]);
    setCurrentUser(createdUser);
    setCurrentScreen('movie-list');
    setStatusMessage('Đăng ký thành công. Chào mừng bạn!');
    return true;
  };

  const handleForgotPassword = (email) => {
    const user = users.find((u) => u.email === email);
    if (!user) {
      setStatusMessage('Không tìm thấy email. Vui lòng kiểm tra lại.');
      return false;
    }
    setStatusMessage(`Mật khẩu của bạn là: ${user.password}`);
    return true;
  };

  const handleAddShowtime = (showtimeData) => {
    setShowtimes(prev => [
      ...prev,
      {
        ...showtimeData,
        movie_id: parseNumericValue(showtimeData.movie_id),
        room_id: parseNumericValue(showtimeData.room_id),
        ticket_price: Number(showtimeData.ticket_price) || 0,
      }
    ]);
  };

  const handleDeleteShowtime = (showtimeId) => {
    const removedId = String(showtimeId);
    setShowtimes((prev) => prev.filter((showtime) => String(showtime.id) !== removedId));
    setBookings((prev) => prev.filter((booking) => String(booking.showtime_id) !== removedId));
  };

  const handleCreateMovie = (movie) => {
    setMovies((prev) => [...prev, movie]);
  };

  const handleDeleteMovie = (movieId) => {
    setMovies(prev => prev.filter((movie) => String(movie.id) !== String(movieId)));

    const remainingShowtimes = showtimes.filter((showtime) => String(showtime.movie_id) !== String(movieId));
    const removedShowtimeIds = showtimes
      .filter((showtime) => String(showtime.movie_id) === String(movieId))
      .map((showtime) => String(showtime.id));

    setShowtimes(remainingShowtimes);
    setBookings((prev) => prev.filter((booking) => !removedShowtimeIds.includes(String(booking.showtime_id))));
  };

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    setCurrentScreen('seat-plan');
  };

  const handleSeatsSelected = (selection) => {
    setPendingSelection(selection);
    setCurrentScreen('combo');
  };

  const handleComboNext = (info) => {
    setComboInfo({ comboCounts: info.comboCounts || {}, comboTotal: info.comboTotal || 0 });
    setPromoInfo(info.promoInfo || { type: 'none', valid: true, data: {} });
    setCurrentScreen('payment');
  };

  const handleConfirmPayment = (pay) => {
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
      original_booking_id: groupId,
      promoType: promoInfo.type,
      promoData: promoInfo.data,
      promoDiscount: pay.discount || 0
    }));
    setBookings([...bookings, ...newBookings]);
    const showtime = showtimes.find(s => s.id === (pendingSelection && pendingSelection.showtime_id));
    const seatNumbers = seatIds.map(id => seats.find(s => s.id === id)?.seat_number).filter(Boolean);
    const room = rooms.find(r => r.id === showtime?.room_id);
    const ticketCount = seatIds.length;
    const ticketPrice = ticketCount > 0 ? Math.round((pendingSelection?.ticketTotal || 0) / ticketCount) : 0;
    setPaymentResult({
      ...pay,
      orderId: groupId,
      orderDate: new Date().toLocaleString(),
      customerName: currentUser?.username || 'Khách',
      seatNumbers,
      roomName: room?.name || 'Chưa rõ',
      ticketPrice,
      ticketCount,
      ticketTotal: pendingSelection?.ticketTotal || 0,
      comboTotal: comboInfo.comboTotal || 0,
      show_date: showtime?.show_date,
      show_time: showtime?.show_time,
      movieTitle: selectedMovie ? selectedMovie.title : undefined,
      promoInfo: promoInfo
    });
    setPendingSelection(null);
    setPromoInfo({ type: 'none', valid: true, data: {} });
    setComboInfo({ comboCounts: {}, comboTotal: 0 });
    setCurrentScreen('payment-success');
  };

  const handleBackToShowtime = () => setCurrentScreen('showtime-list');
  const handleBackToSeat = () => setCurrentScreen('seat-plan');
  const handleBackToCombo = () => setCurrentScreen('combo');
  const handleViewTickets = () => setCurrentScreen('my-tickets');

  const handleCancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const handleCancelOrder = (originalBookingId) => {
    setBookings(prev => prev.filter(b => b.original_booking_id !== originalBookingId));
  };

  return (
    <div className="app-shell">
      <div className="container">
        <HomeFeature
          currentScreen={currentScreen}
          currentUser={currentUser}
          movies={movies}
          onNavigate={handleNavigate}
          onGoToAuth={() => setCurrentScreen('auth')}
          onGoToTickets={() => setCurrentScreen('my-tickets')}
          onGoToAdmin={() => setCurrentScreen('admin')}
          onLogout={() => {
            setCurrentUser(null);
            clearStorage();
            setCurrentScreen('movie-list');
          }}
          scrollTarget={scrollTarget}
          onClearScrollTarget={() => setScrollTarget(null)}
        />

        <BookingFeature
          currentScreen={currentScreen}
          selectedMovie={selectedMovie}
          selectedShowtime={selectedShowtime}
          showtimes={showtimes}
          rooms={rooms}
          seats={seats}
          movies={movies}
          bookings={bookings}
          currentUser={currentUser}
          pendingSelection={pendingSelection}
          comboInfo={comboInfo}
          promoInfo={promoInfo}
          paymentResult={paymentResult}
          onBackToHome={() => setCurrentScreen('movie-list')}
          onSelectShowtime={handleSelectShowtime}
          onSeatsSelected={handleSeatsSelected}
          onComboNext={handleComboNext}
          onPaymentConfirm={handleConfirmPayment}
          onCancelBooking={(bookingId, reason) => {
            handleCancelBooking(bookingId);
            console.log('Lý do hủy ghế:', reason);
          }}
          onCancelOrder={(originalBookingId, reason) => {
            handleCancelOrder(originalBookingId);
            console.log('Lý do hủy đơn:', reason);
          }}
          onBackToShowtime={handleBackToShowtime}
          onBackToSeat={handleBackToSeat}
          onBackToCombo={handleBackToCombo}
          onViewTickets={handleViewTickets}
        />

        <AdminFeature
          currentScreen={currentScreen}
          currentUser={currentUser}
          adminView={adminView}
          users={users}
          movies={movies}
          showtimes={showtimes}
          rooms={rooms}
          bookings={bookings}
          onCancelBooking={handleCancelBooking}
          onCancelOrder={handleCancelOrder}
          onAddShowtime={handleAddShowtime}
          onDeleteShowtime={handleDeleteShowtime}
          onBackHome={() => setCurrentScreen('movie-list')}
          onManageMovies={() => setAdminView('movies')}
          onCreateMovie={handleCreateMovie}
          onUpdateMovie={(m) => setMovies((prev) => prev.map(x => (String(x.id) === String(m.id) ? m : x)))}
          onDeleteMovie={handleDeleteMovie}
          onBack={() => setAdminView('panel')}
        />

        <AuthFeature
          currentScreen={currentScreen}
          users={users}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onForgotPassword={handleForgotPassword}
          mode={authMode}
          onSwitchMode={setAuthMode}
          statusMessage={statusMessage}
          onBack={() => setCurrentScreen('movie-list')}
        />


        {currentScreen === 'faq' && (
          <InfoPage
            title="Câu Hỏi Thường Gặp"
            subtitle="Các câu hỏi phổ biến về vé, thanh toán và hỗ trợ khách hàng."
            sections={[
              { heading: 'Làm sao để mua vé?', text: 'Bạn có thể chọn phim, suất chiếu và ghế ngay trên trang chủ. Sau đó tiếp tục chọn combo và thanh toán để hoàn tất.' },
              { heading: 'Thanh toán bằng cách nào?', text: 'Ứng dụng hỗ trợ thanh toán MoMo, ZaloPay và mã QR. Chọn phương thức phù hợp khi vào trang thanh toán.' },
              { heading: 'Làm sao xem vé đã mua?', text: 'Sau khi thanh toán thành công, bạn có thể vào mục "Vé của tôi" để xem lại vé và mã QR thanh toán.' },
            ]}
            onBack={() => setCurrentScreen('movie-list')}
          />
        )}

        {currentScreen === 'support' && (
          <InfoPage
            title="Liên Hệ Hỗ Trợ"
            subtitle="Cần giúp đỡ? Chúng tôi luôn sẵn sàng hỗ trợ bạn nhanh chóng."
            sections={[
              { heading: 'Hotline hỗ trợ', text: 'Gọi ngay 999.999.9999 để được hỗ trợ trực tiếp về đặt vé, combo và sự cố thanh toán.' },
              { heading: 'Email hỗ trợ', text: 'Gửi yêu cầu đến duongwnguyenx6@gmail.com. Chúng tôi sẽ trả lời bạn trong vòng 24 giờ.' },
              { heading: 'Thời gian phục vụ', text: 'Bộ phận hỗ trợ hoạt động từ 08:00 đến 22:00 mỗi ngày. Ngoài giờ, bạn vẫn có thể gửi email và nhận phản hồi sớm nhất.' },
            ]}
            onBack={() => setCurrentScreen('movie-list')}
          />
        )}

        {currentScreen === 'terms' && (
          <InfoPage
            title="Điều Khoản Dịch Vụ"
            subtitle="Các điều khoản quan trọng khi sử dụng dịch vụ CinemaHub."
            sections={[
              { heading: 'Đặt vé và hoàn vé', text: 'Vé mua qua ứng dụng được xem là hợp lệ khi thanh toán thành công. Hoàn vé chỉ áp dụng theo chính sách của rạp và suất chiếu.' },
              { heading: 'Quyền sử dụng', text: 'CinemaHub có quyền thay đổi nội dung, giá vé và các chương trình khuyến mãi mà không cần báo trước.' },
              { heading: 'Trách nhiệm', text: 'Người dùng chịu trách nhiệm bảo mật thông tin cá nhân và thông tin tài khoản. Mọi hành vi vi phạm sẽ bị xử lý theo quy định.' },
            ]}
            onBack={() => setCurrentScreen('movie-list')}
          />
        )}

        {currentScreen === 'privacy' && (
          <InfoPage
            title="Chính Sách Riêng Tư"
            subtitle="Cách chúng tôi thu thập, lưu trữ và bảo vệ thông tin của bạn."
            sections={[
              { heading: 'Dữ liệu cá nhân', text: 'Chúng tôi lưu thông tin cơ bản như tên, email và lịch sử đặt vé để cải thiện trải nghiệm sử dụng.' },
              { heading: 'Bảo mật', text: 'Thông tin của bạn được bảo vệ bằng các biện pháp kỹ thuật. Chúng tôi không chia sẻ dữ liệu cho bên thứ ba trái phép.' },
              { heading: 'Quyền người dùng', text: 'Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân theo quy định hiện hành.' },
            ]}
            onBack={() => setCurrentScreen('movie-list')}
          />
        )}

        {currentScreen === 'cookies' && (
          <InfoPage
            title="Chính Sách Cookie"
            subtitle="Cách chúng tôi sử dụng cookie để cải thiện trải nghiệm khách hàng."
            sections={[
              { heading: 'Cookie là gì?', text: 'Cookie là tệp nhỏ lưu trữ trên trình duyệt để ghi nhớ lựa chọn và hoạt động của bạn trên website.' },
              { heading: 'Mục đích sử dụng', text: 'Chúng tôi dùng cookie để giữ phiên đăng nhập, phân tích truy cập và gợi ý phim phù hợp.' },
              { heading: 'Quản lý cookie', text: 'Bạn có thể xóa cookie trong cài đặt trình duyệt hoặc từ chối bằng công cụ bảo mật nếu muốn.' },
            ]}
            onBack={() => setCurrentScreen('movie-list')}
          />
        )}


      </div>
    </div>
  );
}

export default App;