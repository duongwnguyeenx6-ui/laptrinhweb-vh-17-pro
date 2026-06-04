import rawDb from './database.json';

const toNumberIfPossible = (v) => {
  if (v === null || v === undefined) return v;
  const n = Number(v);
  return Number.isNaN(n) ? v : n;
};

const normalizeMovie = (m) => ({
  id: toNumberIfPossible(m.id),
  title: m.title,
  duration: m.duration,
  genre: Array.isArray(m.genre) ? m.genre : (m.genre ? [m.genre] : []),
  image_url: m.image_url,
  description: m.description,
  rating: m.rating,
  viewers: m.viewers
});

const normalizeShowtime = (s) => ({
  id: toNumberIfPossible(s.id),
  movie_id: toNumberIfPossible(s.movie_id),
  room_id: toNumberIfPossible(s.room_id),
  show_date: s.show_date,
  show_time: s.show_time,
  ticket_price: Number(s.ticket_price)
});

const normalizeSeat = (s) => ({
  id: toNumberIfPossible(s.id),
  room_id: toNumberIfPossible(s.room_id),
  seat_number: s.seat_number
});

const normalizeBooking = (b) => {
  // convert bookings that contain seat_ids array into multiple single-seat bookings
  const seatIds = Array.isArray(b.seat_ids) ? b.seat_ids : (b.seat_id ? [b.seat_id] : []);
  return seatIds.map((seatId, idx) => ({
    id: `${b.id || 'bk'}-${seatId}-${idx}`,
    original_booking_id: b.id || null,
    user_id: toNumberIfPossible(b.user_id),
    showtime_id: toNumberIfPossible(b.showtime_id),
    seat_id: toNumberIfPossible(seatId),
    paid: b.status === 'completed',
    total_price: b.total_price,
    created_at: b.created_at || null
  }));
};

const defaultDatabase = {
  users: Array.isArray(rawDb.users) ? rawDb.users.map(u => ({ ...u, id: toNumberIfPossible(u.id) })) : [],
  rooms: Array.isArray(rawDb.rooms) ? rawDb.rooms.map(r => ({ ...r, id: toNumberIfPossible(r.id) })) : [],
  movies: Array.isArray(rawDb.movies) ? rawDb.movies.map(normalizeMovie) : [],
  showtimes: Array.isArray(rawDb.showtimes) ? rawDb.showtimes.map(normalizeShowtime) : [],
  seats: Array.isArray(rawDb.seats) ? rawDb.seats.map(normalizeSeat) : [],
  bookings: Array.isArray(rawDb.bookings) ? rawDb.bookings.flatMap(normalizeBooking) : []
};

export default defaultDatabase;
