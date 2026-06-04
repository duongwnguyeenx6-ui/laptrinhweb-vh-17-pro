import React, { useState } from 'react';

function MovieList({ movies, showtimes, currentUser, onSelectMovie, onGoToAuth, onLogout, onGoToAdmin }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('Tất Cả');
  const [maxPrice, setMaxPrice] = useState(130000);
  const [sortBy, setSortBy] = useState('default');

  const genres = ['Tất Cả', 'Hoạt Hình', 'Hành Động', 'Viễn Tưởng', 'Kinh Dị'];

  const getMoviePrice = (movie) => {
    if (movie.ticket_price > 0) return movie.ticket_price;
    const movieShowtimes = showtimes.filter((item) => String(item.movie_id) === String(movie.id));
    if (!movieShowtimes.length) return 0;
    return Math.min(...movieShowtimes.map((item) => item.ticket_price));
  };

  const filteredMovies = movies
    .filter((movie) => {
      const titleMatch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      const genreMatch = genre === 'Tất Cả' || (Array.isArray(movie.genre) ? movie.genre.includes(genre) : movie.genre === genre);
      const priceMatch = getMoviePrice(movie) <= maxPrice;
      return titleMatch && genreMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'duration') return b.duration - a.duration;
      if (sortBy === 'price-asc') return getMoviePrice(a) - getMoviePrice(b);
      if (sortBy === 'price-desc') return getMoviePrice(b) - getMoviePrice(a);
      return 0;
    });

  return (
    <div>
      {/* Hàng tiêu đề song song với nút Đăng ký / Đăng nhập */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-uppercase m-0 text-accent" style={{ letterSpacing: '0.5px' }}>
            🎬 Phim Đang Chiếu
          </h2>
          {currentUser && (
            <div className="text-secondary small mt-1">Xin chào, <strong>{currentUser.username}</strong></div>
          )}
        </div>
        
        <div className="d-flex gap-2 flex-wrap justify-content-end">
          {onGoToAdmin && (
            <button
              type="button"
              className="btn fw-bold px-4 py-2 rounded-pill shadow-sm text-white border-0 btn-primary"
              onClick={onGoToAdmin}
            >
              🛠 Quản Lý Phim
            </button>
          )}
          {currentUser && (
            <button 
              className="btn fw-bold px-4 py-2 rounded-pill shadow-sm text-white border-0 btn-danger"
              onClick={onLogout}
            >
              🚪 Đăng Xuất
            </button>
          )}
          <button 
            className={`btn fw-bold px-4 py-2 rounded-pill shadow-sm text-white border-0 ${currentUser ? 'btn-muted' : 'btn-primary'}`}
            onClick={onGoToAuth}
            disabled={!!currentUser}
          >
            🔑 {currentUser ? 'Đã Đăng Nhập' : 'Đăng Nhập / Đăng Ký'}
          </button>
        </div>
      </div>

      {/* BỘ LỌC TÌM KIẾM */}
      <div className="card p-4 shadow-sm border-0 mb-5 card-theme">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <label className="form-label fw-bold text-secondary small">Tìm kiếm tên phim</label>
            <input 
              type="text" 
              className="form-control border-0 shadow-sm theme-input" 
              style={{ borderRadius: '10px', padding: '10px 15px', borderBottom: '2px solid var(--primary-600)' }}
              placeholder="Nhập tên phim ..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold text-secondary small">
              Giá vé tối đa: <span className="fw-black text-accent">{maxPrice.toLocaleString()} VNĐ</span>
            </label>
            <input 
              type="range" 
              className="form-range range-accent" 
              min="80000" 
              max="130000" 
              step="5000" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold text-secondary small">Sắp xếp theo</label>
            <select 
              className="form-select border-0 shadow-sm theme-input" 
              style={{ borderRadius: '10px', padding: '10px', borderBottom: '2px solid var(--primary-600)' }}
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Mặc định</option>
              <option value="duration">Thời lượng (Giảm dần)</option>
              <option value="price-asc">Giá vé (Thấp đến Cao)</option>
              <option value="price-desc">Giá vé (Cao đến Thấp)</option>
            </select>
          </div>
        </div>

        {/* NÚT THỂ LOẠI */}
        <div className="mt-4 border-top pt-3">
          <div className="d-flex flex-wrap gap-2">
            {genres.map((genreItem) => (
              <button
                key={genreItem}
                className={`btn btn-sm px-4 py-2 rounded-pill fw-bold ${genre === genreItem ? 'btn-genre-active' : 'btn-genre'}`}
                onClick={() => setGenre(genreItem)}
              >
                {genreItem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DANH SÁCH CARD PHIM */}
      <div className="row">
        {filteredMovies.map((movie) => {
          const minPrice = getMoviePrice(movie);
          return (
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={movie.id}>
              <div className="card h-100 border-0 shadow-lg overflow-hidden" style={{ borderRadius: '22px', background: 'linear-gradient(180deg, rgba(15, 23, 42, 1), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(124, 58, 237, 0.16)' }}>
                  <div className="position-relative overflow-hidden">
                    <img src={movie.image_url} className="card-img-top" alt={movie.title} style={{ width: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'center center', backgroundColor: '#000', transition: 'transform 0.35s ease', filter: 'contrast(1.05) saturate(1.1)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0) 40%, rgba(15,23,42,0.9) 100%)' }} />
                  <span className="position-absolute badge px-3 py-2 rounded-pill text-white fw-bold" style={{ top: '16px', left: '16px', backgroundColor: 'rgba(124, 58, 237, 0.95)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="star" size={14} animation="rotate" /> {String(movie.rating).replace('⭐','')}</span>
                  </span>
                  <span className="position-absolute badge px-3 py-2 rounded-pill fw-bold" style={{ top: '16px', right: '16px', backgroundColor: 'rgba(0, 0, 0, 0.55)' }}>
                    ⏱ {movie.duration}p
                  </span>
                </div>
                <div className="card-body d-flex flex-column p-4 card-body-dark">
                  <h5 className="card-title fw-bold text-white mb-2" style={{ fontSize: '1.6rem', lineHeight: 1.02, letterSpacing: '0.4px' }}>{movie.title}</h5>
                  <p className="card-text text-secondary flex-grow-1" style={{ fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '18px', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {movie.description}
                  </p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge px-3 py-2 rounded-pill fw-bold badge-primary">
                      🏷 {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                    </span>
                    <span className="badge px-3 py-2 rounded-pill fw-bold badge-muted">
                      <Icon name="users" size={14} /> {movie.viewers.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-top pt-3 mt-auto d-flex justify-content-between align-items-center">
                    <span className="text-secondary small fw-medium">Giá vé</span>
                    <strong className="fs-4 fw-black text-accent">
                      {minPrice > 0 ? `${minPrice.toLocaleString()} VNĐ` : 'Hết vé'}
                    </strong>
                  </div>
                  <button 
                    className="btn w-100 fw-bold mt-3 py-2 text-white border-0 btn-primary rounded-14" 
                    style={{ boxShadow: '0 16px 30px rgba(124, 58, 237, 0.24)' }}
                    onClick={() => onSelectMovie(movie)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="play" size={16} animation="pulse" /> Mua Vé Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MovieList;
