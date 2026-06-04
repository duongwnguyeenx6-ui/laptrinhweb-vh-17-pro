import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturedMovies from './FeaturedMovies';
import MovieCategories from './MovieCategories';
import Icon from './Icon';
import PopularMovies from './PopularMovies';
import Footer from './Footer';

function HomePage({ currentUser, movies: initialMovies = [], onNavigate, onGoToAuth, onGoToTickets, onGoToAdmin, onLogout, scrollTarget, onClearScrollTarget }) {
  const [movies, setMovies] = useState(initialMovies);
  const [filteredMovies, setFilteredMovies] = useState(initialMovies);
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMovies(initialMovies || []);
    setFilteredMovies(initialMovies || []);
  }, [initialMovies]);

  useEffect(() => {
    if (!scrollTarget) return;
    const targetElement = document.getElementById(scrollTarget);
    if (targetElement) {
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const top = scrollTop + rect.top - headerHeight - 12; // small gap under header
      window.scrollTo({ top, behavior: 'smooth' });
    }
    onClearScrollTarget();
  }, [scrollTarget, onClearScrollTarget]);

  // Lọc phim theo thể loại
  useEffect(() => {
    let filtered = movies;

    if (selectedGenre !== 'Tất cả') {
      filtered = filtered.filter(movie => {
        if (!movie.genre) return false;
        if (Array.isArray(movie.genre)) {
          return movie.genre.includes(selectedGenre);
        }
        return movie.genre === selectedGenre;
      });
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [selectedGenre, searchTerm, movies]);

  const handleSelectMovie = (movie) => {
    onNavigate('showtime-list', movie);
  };

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);
    const targetElement = document.getElementById('new');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const heroMovies = (() => {
    const hotMovies = movies.filter((movie) => movie.is_hot);
    if (hotMovies.length >= 4) return hotMovies.slice(0, 4);
    const remaining = movies
      .filter((movie) => !movie.is_hot)
      .sort((a, b) => Number(b.viewers || 0) - Number(a.viewers || 0));
    return [...hotMovies, ...remaining].slice(0, 4);
  })();

  const handleScrollToMovie = (movie) => {
    const card = document.getElementById(`movie-card-${movie.id}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('highlight-movie');
      setTimeout(() => card.classList.remove('highlight-movie'), 1800);
    }
  };

  const getAllGenres = () => {
    const genresSet = new Set(['Tất cả']);
    movies.forEach(movie => {
      if (movie.genre && Array.isArray(movie.genre)) {
        movie.genre.forEach(g => genresSet.add(g));
      }
    });
    return Array.from(genresSet);
  };

  return (
    <div className="home-page" id="home">
      <Header 
        currentUser={currentUser} 
        onGoToAuth={onGoToAuth}
        onGoToTickets={onGoToTickets}
        onGoToAdmin={onGoToAdmin}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />
      
      <HeroSection 
        movies={heroMovies}
        onNavigate={onNavigate}
      />

      <div className="homepage-content">
        {/* Search Section */}
        <section className="search-section" id="movies">
            <div className="search-container">
            <input
              id="homepage-search-input"
              type="text"
              autoComplete="off"
              placeholder="Nhập tên phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button
              type="button"
              className="search-action"
              onClick={() => document.getElementById('homepage-search-input')?.focus()}
            >
              <Icon name="search" />
            </button>
          </div>
          {searchTerm.trim() && (
            <>
              <div className="search-feedback">
                <p>
                  Kết quả tìm kiếm cho <strong>"{searchTerm}"</strong>: {filteredMovies.length} phim
                </p>
              </div>
              <div className="search-suggestions">
                {filteredMovies.length > 0 ? (
                  filteredMovies.slice(0, 6).map((movie) => (
                    <button key={movie.id} type="button" className="suggestion-card" onClick={() => handleScrollToMovie(movie)}>
                      <div className="suggestion-image">
                        <img src={movie.image_url} alt={movie.title} />
                      </div>
                      <div className="suggestion-text">
                        <div className="suggestion-title">{movie.title}</div>
                        <div className="suggestion-subtitle">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="search-empty">Không tìm thấy phim phù hợp.</div>
                )}
              </div>
            </>
          )}
        </section>

        <section>
          <FeaturedMovies 
            movies={(() => {
              const hotMovies = movies.filter((movie) => movie.is_hot);
              if (hotMovies.length >= 4) return hotMovies.slice(0, 4);

              const popularRest = movies
                .filter((movie) => !movie.is_hot)
                .sort((a, b) => Number(b.viewers || 0) - Number(a.viewers || 0));
              return [...hotMovies, ...popularRest].slice(0, 4);
            })()}
            onSelectMovie={handleSelectMovie}
          />

          <div id="deals" className="promo-section" style={{ marginTop: 40 }}>
            <div className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ color: '#eef2ff', fontSize: '1.85rem', margin: 0 }}>✨ Ưu đãi nổi bật</h2>
              <p style={{ color: '#94a3b8', margin: 0, maxWidth: 520 }}>Khuyến mãi hấp dẫn dành cho sinh viên, gia đình và nhóm đông người. Nhận ngay ưu đãi khi chọn vé và combo.</p>
            </div>
            <div className="d-flex flex-wrap gap-3" style={{ justifyContent: 'space-between' }}>
              <div style={{ flex: '1 1 220px', minWidth: 220, padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(129, 140, 248, 0.08))', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 12px 30px rgba(99, 102, 241, 0.08)' }}>
                <div style={{ color: '#c7d2fe', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>🎓 Sinh viên giảm 30%</div>
                <div style={{ color: '#e2e8f0', lineHeight: 1.6 }}>Xuất trình thẻ sinh viên tại quầy để áp dụng giảm 30% cho vé xem phim.</div>
              </div>
              <div style={{ flex: '1 1 220px', minWidth: 220, padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(110, 231, 183, 0.08))', border: '1px solid rgba(16, 185, 129, 0.2)', boxShadow: '0 12px 30px rgba(16, 185, 129, 0.08)' }}>
                <div style={{ color: '#bbf7d0', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>🧒 Trẻ em dưới 14 giảm 50%</div>
                <div style={{ color: '#e2e8f0', lineHeight: 1.6 }}>Khách hàng nhí dưới 14 tuổi được giảm 50% trên giá vé gốc.</div>
              </div>
              <div style={{ flex: '1 1 220px', minWidth: 220, padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.16), rgba(192, 132, 252, 0.08))', border: '1px solid rgba(168, 85, 247, 0.2)', boxShadow: '0 12px 30px rgba(168, 85, 247, 0.08)' }}>
                <div style={{ color: '#e9d5ff', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>👥 Đi 5 người tặng nước</div>
                <div style={{ color: '#e2e8f0', lineHeight: 1.6 }}>Đặt vé cho nhóm từ 5 người trở lên sẽ được tặng thêm 1 nước miễn phí.</div>
              </div>
              <div style={{ flex: '1 1 220px', minWidth: 220, padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.16), rgba(251, 113, 133, 0.08))', border: '1px solid rgba(244, 63, 94, 0.2)', boxShadow: '0 12px 30px rgba(244, 63, 94, 0.08)' }}>
                <div style={{ color: '#fecaca', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>💑 Cặp đôi tặng combo</div>
                <div style={{ color: '#e2e8f0', lineHeight: 1.6 }}>Đặt vé đôi nhận ưu đãi combo bắp + nước với giá giảm mạnh.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Movie Categories */}
        <section id="genres">
          <MovieCategories 
            genres={getAllGenres()}
            selectedGenre={selectedGenre}
            onSelectGenre={handleSelectGenre}
          />
        </section>

        {/* Popular Movies */}
        <section id="new">
          <PopularMovies 
            movies={filteredMovies}
            onSelectMovie={handleSelectMovie}
          />
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default HomePage;
