/**
 * Dịch vụ quản lý lưu trữ dữ liệu người dùng và trạng thái đăng nhập
 * Sử dụng localStorage để lưu lại tài khoản, mật khẩu và trạng thái đăng nhập
 */

const STORAGE_KEYS = {
  USERS: 'movieApp_users',
  CURRENT_USER: 'movieApp_currentUser',
  MOVIES: 'movieApp_movies',
  SHOWTIMES: 'movieApp_showtimes',
  BOOKINGS: 'movieApp_bookings',
};

/**
 * Lưu danh sách người dùng vào localStorage
 */
export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Lỗi khi lưu người dùng:', error);
  }
};

/**
 * Lưu danh sách phim vào localStorage
 */
export const saveMovies = (movies) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  } catch (error) {
    console.error('Lỗi khi lưu phim:', error);
  }
};

/**
 * Tải danh sách phim từ localStorage
 */
export const loadMovies = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MOVIES);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Lỗi khi tải phim:', error);
    return null;
  }
};

/**
 * Lưu danh sách suất chiếu vào localStorage
 */
export const saveShowtimes = (showtimes) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOWTIMES, JSON.stringify(showtimes));
  } catch (error) {
    console.error('Lỗi khi lưu suất chiếu:', error);
  }
};

/**
 * Tải danh sách suất chiếu từ localStorage
 */
export const loadShowtimes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SHOWTIMES);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Lỗi khi tải suất chiếu:', error);
    return null;
  }
};

/**
 * Lưu danh sách booking vào localStorage
 */
export const saveBookings = (bookings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (error) {
    console.error('Lỗi khi lưu booking:', error);
  }
};

/**
 * Tải danh sách booking từ localStorage
 */
export const loadBookings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Lỗi khi tải booking:', error);
    return null;
  }
};

/**
 * Tải danh sách người dùng từ localStorage
 */
export const loadUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Lỗi khi tải người dùng:', error);
    return null;
  }
};

/**
 * Lưu thông tin người dùng hiện tại vào localStorage
 */
export const saveCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Lỗi khi lưu người dùng hiện tại:', error);
  }
};

/**
 * Tải thông tin người dùng hiện tại từ localStorage
 */
export const loadCurrentUser = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Lỗi khi tải người dùng hiện tại:', error);
    return null;
  }
};

/**
 * Xóa tất cả dữ liệu đã lưu (khi đăng xuất)
 */
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu:', error);
  }
};
