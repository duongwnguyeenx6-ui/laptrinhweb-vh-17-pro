import React, { useRef, useState } from 'react';

const GENRES = ['Hoạt Hình', 'Hành Động', 'Viễn Tưởng', 'Kinh Dị'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const EMPTY_FORM = {
  title: '',
  duration: '',
  genre: 'Hoạt Hình',
  image_url: '',
  description: '',
  rating: '0/5 ⭐',
  viewers: '0',
  ticket_price: '85000',
  is_hot: false,
};

const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

const formatGenre = (genre) => Array.isArray(genre) ? genre.join(', ') : genre;

const parseTicketPrice = (value) => {
  const digits = digitsOnly(value);
  return digits ? Number(digits) : 0;
};

const inputStyle = {
  borderRadius: '10px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.16)',
};

const listPriceInputStyle = {
  width: 100,
  borderRadius: 10,
  color: '#ffffff',
  backgroundColor: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(124,58,237,0.22)',
  padding: '8px 10px',
  minWidth: 92,
};

const actionButtonStyle = {
  minWidth: 78,
  padding: '7px 10px',
  fontSize: '0.82rem',
  borderRadius: 8,
  lineHeight: 1.1,
};

function MovieManagement({
  movies,
  showtimes = [],
  onCreateMovie,
  onUpdateMovie,
  onDeleteMovie,
  onBack,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('list');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [viewMovie, setViewMovie] = useState(null);
  const [formError, setFormError] = useState('');
  const [confirmDeleteMovie, setConfirmDeleteMovie] = useState(null);
  const [priceDrafts, setPriceDrafts] = useState({});
  const fileInputRef = useRef(null);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getShowtimeCount = (movieId) =>
    showtimes.filter((st) => st.movie_id === movieId).length;

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const HOT_MOVIE_LIMIT = 4;
  const hotMovieCount = movies.filter((movie) => movie.is_hot).length;
  const isHotLimitReached = hotMovieCount >= HOT_MOVIE_LIMIT;

  const openCreate = () => {
    resetForm();
    setMode('form');
  };

  const openEdit = (movie) => {
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      duration: String(movie.duration),
      genre: movie.genre,
      image_url: movie.image_url,
      description: movie.description,
      rating: movie.rating || '0/5 ⭐',
      viewers: String(movie.viewers ?? 0),
      ticket_price: String(movie.ticket_price ?? 85000),
      is_hot: movie.is_hot === true,
    });
    setFormError('');
    setMode('form');
  };

  const openView = (movie) => {
    setViewMovie(movie);
    setMode('detail');
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Vui lòng nhập tên phim.';
    if (!form.duration || Number(form.duration) <= 0) return 'Thời lượng phải lớn hơn 0.';
    if (!form.image_url.trim()) return 'Vui lòng tải ảnh poster từ máy.';
    if (!form.description.trim()) return 'Vui lòng nhập mô tả phim.';
    if (parseTicketPrice(form.ticket_price) <= 0) return 'Giá vé phải lớn hơn 0.';
    if (form.is_hot && !movies.some((movie) => movie.id === editingId && movie.is_hot) && isHotLimitReached) {
      return `Chỉ được đánh dấu tối đa ${HOT_MOVIE_LIMIT} phim hot. Vui lòng gỡ hot một phim hiện tại trước khi chọn phim mới.`;
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    const payload = {
      title: form.title.trim(),
      duration: Number(form.duration),
      genre: form.genre,
      image_url: form.image_url.trim(),
      description: form.description.trim(),
      rating: form.rating.trim() || '0/5 ⭐',
      viewers: Number(form.viewers) || 0,
      ticket_price: parseTicketPrice(form.ticket_price),
      is_hot: Boolean(form.is_hot),
    };

    if (editingId !== null) {
      onUpdateMovie({ ...payload, id: editingId });
    } else {
      const nextId =
        movies.length === 0
          ? 1
          : Math.max(...movies.map((m) => Number(m.id))) + 1;
      onCreateMovie({ ...payload, id: nextId });
    }

    resetForm();
    setMode('list');
  };

  const handleDelete = (movie) => {
    setConfirmDeleteMovie(movie);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteMovie) return;
    onDeleteMovie(confirmDeleteMovie.id);
    if (viewMovie?.id === confirmDeleteMovie.id) {
      setViewMovie(null);
      setMode('list');
    }
    setConfirmDeleteMovie(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteMovie(null);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError('');
  };

  const handleTicketPriceChange = (value) => {
    handleFormChange('ticket_price', digitsOnly(value));
  };

  const getListPriceValue = (movie) =>
    priceDrafts[movie.id] !== undefined
      ? priceDrafts[movie.id]
      : digitsOnly(movie.ticket_price);

  const handleListPriceChange = (movieId, value) => {
    setPriceDrafts((prev) => ({ ...prev, [movieId]: digitsOnly(value) }));
  };

  const commitListPrice = (movie) => {
    const raw =
      priceDrafts[movie.id] !== undefined
        ? priceDrafts[movie.id]
        : digitsOnly(movie.ticket_price);
    const price = parseTicketPrice(raw);

    setPriceDrafts((prev) => {
      const next = { ...prev };
      delete next[movie.id];
      return next;
    });

    if (price > 0 && price !== movie.ticket_price) {
      onUpdateMovie({ ...movie, ticket_price: price });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFormError('Chỉ chấp nhận ảnh JPG, PNG, WebP hoặc GIF.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setFormError('Ảnh tối đa 2MB. Vui lòng chọn file nhỏ hơn.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleFormChange('image_url', reader.result);
    };
    reader.onerror = () => {
      setFormError('Không đọc được file ảnh. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const clearPoster = () => {
    handleFormChange('image_url', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 14px' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-2 border-bottom" style={{ padding: '0 4px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(99,102,241,0.14))', color: '#ffffff', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.16em' }}>
            ADMIN PANEL
          </div>
          <h2 className="fw-bold mt-2 mb-1" style={{ color: '#eef2ff', fontSize: '2rem', letterSpacing: '-0.03em' }}>
            {mode === 'list' ? 'Danh sách phim' : mode === 'form' ? (editingId !== null ? 'Cập nhật phim' : 'Thêm phim mới') : 'Thông tin phim'}
          </h2>
          <p className="mb-0" style={{ color: '#cbd5e1', maxWidth: 620 }}>Giao diện quản trị được đồng bộ với màu tím chủ đạo, nền tối và font chữ rõ ràng giống website trang chủ.</p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {mode === 'list' && (
            <button type="button" className="btn fw-bold text-white btn-primary" style={{ borderRadius: 18, padding: '14px 24px', fontSize: '0.98rem' }} onClick={openCreate}>➕ Thêm phim mới</button>
          )}
          <button
            type="button"
            className="btn fw-bold text-white btn-muted"
            style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.14)', padding: '14px 24px', fontSize: '0.98rem' }}
            onClick={() => {
              if (mode === 'list') onBack();
              else {
                resetForm();
                setViewMovie(null);
                setMode('list');
              }
            }}
          >
            {mode === 'list' ? '⬅ Về trang chủ' : '⬅ Quay lại danh sách'}
          </button>
        </div>
      </div>

      {mode === 'list' && (
        <>
          <div className="card-theme p-4 shadow-sm border-0 mb-4" style={{ borderRadius: '24px', border: '1px solid rgba(148,163,184,0.16)' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div>
                <div style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Tìm phim</div>
                <div style={{ color: '#ffffff', fontSize: '1.02rem' }}>Nhập tên phim để lọc nhanh danh sách.</div>
              </div>
              <div style={{ color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600 }}>
                Phim hot đã đánh dấu: <span style={{ color: '#fbbf24' }}>{hotMovieCount}</span>
              </div>
            </div>
            <input
              type="text"
              className="form-control"
              style={{ ...inputStyle, padding: '14px 16px' }}
              placeholder="Nhập tên phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive card-theme shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden', fontSize: '0.95rem', border: '1px solid rgba(79,70,229,0.18)' }}>
            <table className="table table-dark table-hover table-sm align-middle mb-0" style={{ color: '#ffffff', backgroundColor: 'transparent' }}>
              <thead style={{ backgroundColor: 'rgba(79,70,229,0.20)', color: '#eef2ff' }}>
                <tr>
                  <th className="ps-3 text-white">#</th>
                  <th className="text-white">Poster</th>
                  <th className="text-white">Tên phim</th>
                  <th className="text-white">Phim Hot</th>
                  <th className="text-white">Thể loại</th>
                  <th className="text-white">Thời lượng</th>
                  <th className="text-white">Giá vé</th>
                  <th className="text-white">Lượt xem</th>
                  <th className="text-white">Suất chiếu</th>
                  <th className="text-end pe-4 text-white">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-white py-5">
                      Không có phim nào.
                    </td>
                  </tr>
                ) : (
                  filteredMovies.map((movie, index) => (
                    <tr key={movie.id} style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="ps-3 fw-bold text-white">{index + 1}</td>
                      <td>
                        <img
                          src={movie.image_url}
                          alt={movie.title}
                          className="rounded"
                          style={{ width: 72, height: 96, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.14)' }}
                        />
                      </td>
                      <td style={{ minWidth: 150 }}>
                        <div className="fw-semibold text-white">{movie.title}</div>
                        <div className="small text-white">{movie.rating || 'Chưa có đánh giá'}</div>
                      </td>
                      <td style={{ minWidth: 85 }}>
                        {movie.is_hot ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#fbbf24', fontWeight: 700 }}>
                            🔥 Hot
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td className="text-white" style={{ minWidth: 120 }}>{formatGenre(movie.genre)}</td>
                      <td className="text-white">{movie.duration} phút</td>
                      <td style={{ minWidth: 140 }}>
                        <div className="d-flex align-items-center gap-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            className="form-control form-control-sm fw-bold theme-input"
                            style={listPriceInputStyle}
                            value={getListPriceValue(movie)}
                            onChange={(e) => handleListPriceChange(movie.id, e.target.value)}
                            onBlur={() => commitListPrice(movie)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.currentTarget.blur();
                            }}
                            placeholder="85000"
                            aria-label={`Giá vé ${movie.title}`}
                          />
                          <span className="small text-white">VNĐ</span>
                        </div>
                      </td>
                      <td className="text-white">{Number(movie.viewers).toLocaleString()}</td>
                      <td className="text-white">{getShowtimeCount(movie.id)}</td>
                      <td className="text-end pe-4" style={{ whiteSpace: 'nowrap', minWidth: 220 }}>
                        <div className="d-flex justify-content-end flex-nowrap gap-1">
                          <button type="button" className="btn btn-sm fw-bold btn-primary" style={{ ...actionButtonStyle, minWidth: 72 }} onClick={() => openView(movie)} title="Xem chi tiết">👁 Xem</button>
                          <button type="button" className="btn btn-sm fw-bold btn-muted" style={{ ...actionButtonStyle, minWidth: 72 }} onClick={() => openEdit(movie)} title="Sửa phim">✏️ Sửa</button>
                          <button
                            type="button"
                            className="btn btn-sm fw-bold btn-warning"
                            style={{
                              ...actionButtonStyle,
                              minWidth: 92,
                              background: movie.is_hot ? '#f59e0b' : isHotLimitReached ? '#6b7280' : '#f59e0b',
                              borderColor: movie.is_hot ? '#d97706' : isHotLimitReached ? '#4b5563' : '#d97706',
                              color: '#0f172a'
                            }}
                            onClick={() => onUpdateMovie({ ...movie, is_hot: !movie.is_hot })}
                            title={movie.is_hot ? 'Bỏ hot' : 'Đánh dấu hot'}
                            disabled={!movie.is_hot && isHotLimitReached}
                          >
                            {movie.is_hot ? '⭐ Bỏ hot' : '🔥 Hot'}
                          </button>
                          <button type="button" className="btn btn-sm btn-danger" style={{ ...actionButtonStyle, minWidth: 44, padding: '8px 10px' }} onClick={() => handleDelete(movie)} title="Xóa phim" aria-label="Xóa phim">
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-white small mt-3 mb-0">
            Tổng cộng: <strong>{filteredMovies.length}</strong> / {movies.length} phim
          </p>
        </>
      )}

      {mode === 'detail' && viewMovie && (
        <div className="card-theme border-0 shadow-sm overflow-hidden" style={{ borderRadius: '22px' }}>
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={viewMovie.image_url}
                alt={viewMovie.title}
                className="w-100 h-100"
                style={{ minHeight: 320, objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-8 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <h3 className="fw-bold mb-2 text-white">{viewMovie.title}</h3>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge badge-primary px-3 py-2">
                  🏷 {formatGenre(viewMovie.genre)}
                </span>
                <span className="badge badge-muted px-3 py-2">⏱ {viewMovie.duration} phút</span>
                <span className="badge badge-primary px-3 py-2">
                  🎟 {Number(viewMovie.ticket_price || 0).toLocaleString()} VNĐ
                </span>
                <span className="badge badge-muted px-3 py-2">⭐ {viewMovie.rating}</span>
                <span className="badge badge-muted px-3 py-2">
                  👁 {Number(viewMovie.viewers).toLocaleString()} lượt xem
                </span>
              </div>
              <p className="text-white" style={{ lineHeight: 1.6 }}>
                {viewMovie.description}
              </p>
              <p className="small text-white mb-0">Mã phim: #{viewMovie.id}</p>
              <div className="d-flex gap-2 mt-4">
                <button type="button" className="btn fw-bold text-white btn-primary" onClick={() => openEdit(viewMovie)}>✏️ Chỉnh sửa</button>
                <button type="button" className="btn fw-bold text-white btn-danger" onClick={() => handleDelete(viewMovie)}>🗑 Xóa phim</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'form' && (
        <div
          className="card-theme p-3 shadow-sm border-0 mx-auto"
          style={{ maxWidth: 620, borderRadius: '16px' }}
        >
          <h4 className="fw-bold mb-4" style={{ color: '#ffffff' }}>
            {editingId !== null ? '✏️ Cập nhật phim' : '➕ Thêm phim mới'}
          </h4>

          {formError && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold small text-white">Tên phim *</label>
              <input
                type="text"
                className="form-control theme-input"
                style={inputStyle}
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Nhập tên phim"
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold small text-white">Thể loại *</label>
                <select
                  className="form-select"
                  style={inputStyle}
                  value={form.genre}
                  onChange={(e) => handleFormChange('genre', e.target.value)}
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold small text-white">Thời lượng (phút) *</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  style={inputStyle}
                  value={form.duration}
                  onChange={(e) => handleFormChange('duration', e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 mt-3">
              <label className="form-label fw-bold small text-white">Giá vé (VNĐ) *</label>
              <input
                type="text"
                inputMode="numeric"
                className="form-control"
                style={inputStyle}
                value={form.ticket_price}
                onChange={(e) => handleTicketPriceChange(e.target.value)}
                placeholder="Nhập giá, ví dụ: 85000 hoặc 85.000"
              />
              <p className="text-white small mt-1 mb-0">
                Gõ số bằng bàn phím — có thể nhập 85000 hoặc 85.000
                {form.ticket_price ? (
                  <span className="ms-1 fw-bold" style={{ color: '#ffffff' }}>
                    (= {parseTicketPrice(form.ticket_price).toLocaleString()} VNĐ)
                  </span>
                ) : null}
              </p>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-white">Ảnh poster *</label>
              <input
                ref={fileInputRef}
                type="file"
                className="form-control"
                style={inputStyle}
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
              />
              <p className="text-white small mt-1 mb-0">
                Chọn ảnh từ máy (JPG, PNG, WebP, GIF — tối đa 2MB)
              </p>
              {form.image_url && (
                <div className="mt-3">
                  <img
                    src={form.image_url}
                    alt="Xem trước poster"
                    className="rounded shadow-sm"
                    style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'cover' }}
                  />
                  <button type="button" className="btn btn-sm fw-bold btn-danger mt-2" onClick={clearPoster}>🗑 Xóa ảnh đã chọn</button>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-white">Mô tả *</label>
              <textarea
                className="form-control"
                rows={4}
                style={inputStyle}
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Mô tả nội dung phim..."
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold small text-white">Đánh giá</label>
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  value={form.rating}
                  onChange={(e) => handleFormChange('rating', e.target.value)}
                  placeholder="4.8/5 ⭐"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold small text-white">Lượt xem</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  style={inputStyle}
                  value={form.viewers}
                  onChange={(e) => handleFormChange('viewers', e.target.value)}
                />
              </div>
            </div>

            <div className="form-check form-switch mt-4 mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="hotCheckbox"
                checked={form.is_hot}
                onChange={(e) => handleFormChange('is_hot', e.target.checked)}
                disabled={isHotLimitReached && !(editingId !== null && movies.some((movie) => movie.id === editingId && movie.is_hot))}
                style={{ width: 22, height: 14, cursor: isHotLimitReached ? 'not-allowed' : 'pointer' }}
              />
              <label className="form-check-label text-white ms-2" htmlFor="hotCheckbox">
                Đánh dấu phim hot
              </label>
            </div>
            {isHotLimitReached && !(editingId !== null && movies.some((movie) => movie.id === editingId && movie.is_hot)) && (
              <p className="small text-warning mb-3">
                Đã đạt giới hạn {HOT_MOVIE_LIMIT} phim hot. Gỡ hot một phim hiện tại trước khi chọn phim mới.
              </p>
            )}

            <div className="d-flex flex-wrap gap-3 mt-4">
              <button type="submit" className="btn flex-grow-1 fw-bold text-white btn-primary py-3" style={{ borderRadius: '14px', fontSize: '1rem' }}>{editingId !== null ? '💾 Lưu thay đổi' : '✅ Thêm phim'}</button>
              <button
                type="button"
                className="btn fw-bold py-3 px-4"
                style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '14px', color: '#ffffff', border: '1px solid rgba(255,255,255,0.14)' }}
                onClick={() => {
                  resetForm();
                  setMode('list');
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
      {confirmDeleteMovie && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 440, borderRadius: 24, background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(99,102,241,0.24)', boxShadow: '0 24px 60px rgba(15,23,42,0.35)', padding: '24px 24px' }}>
            <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>Xác nhận xóa phim</div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: 22 }}>
              Phim <strong>{confirmDeleteMovie.title}</strong> có {getShowtimeCount(confirmDeleteMovie.id)} suất chiếu. Xóa phim sẽ xóa luôn các suất chiếu liên quan.
            </p>
            <div className="d-flex gap-3 justify-content-end flex-wrap">
              <button type="button" className="btn btn-muted" style={{ borderRadius: 14, padding: '12px 18px', color: '#cbd5e1', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }} onClick={handleCancelDelete}>Hủy</button>
              <button type="button" className="btn btn-danger" style={{ borderRadius: 14, padding: '12px 18px' }} onClick={handleConfirmDelete}>🗑 Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieManagement;
