import React from 'react';
import './FeaturedMovies.css';
import Icon from './Icon';

function FeaturedMovies({ movies, onSelectMovie }) {
  return (
    <section className="featured-movies">
      <div className="featured-header">
        <h2>🔥 Phim Hot</h2>
        <p>4 bộ phim hot nhất tuần, đang được săn đón &amp; xem nhiều nhất</p>
      </div>

      <div className="featured-grid">
        {
          // ensure we always render 4 cards; add placeholders if not enough movies
          (() => {
            const display = (movies || []).slice(0, 4);
            while (display.length < 4) {
              display.push({ id: `placeholder-${display.length}`, placeholder: true });
            }
            return display.map((movie, idx) => (
              <div
                key={movie.id}
                className={`featured-card ${movie.placeholder ? 'placeholder' : ''}`}
                onClick={() => !movie.placeholder && onSelectMovie(movie)}
              >
                <div className="featured-image">
                  {movie.placeholder ? (
                    <div className="featured-placeholder" />
                  ) : (
                    <>
                      <img src={movie.image_url} alt={movie.title} />
                                <div className="featured-overlay">
                                  <button className="play-button"><Icon name="play" size={18} animation="pulse" /></button>
                                  <div className="featured-info">
                          <h3>{movie.title}</h3>
                          <div className="featured-meta">
                                      <span className="duration">⏱ {movie.duration} phút</span>
                                      <span className="rating"><Icon name="star" size={14} animation="rotate" /> {String(movie.rating).replace('⭐','')}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="featured-details">
                  <p className="featured-title">{movie.placeholder ? '...' : movie.title}</p>
                  <p className="featured-genre">
                    {movie.placeholder ? '' : (movie.genre && (Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre))}
                  </p>
                  <div className="featured-stats">
                    <span className="viewers">{movie.placeholder ? '' : (<><Icon name="users" size={14} /> {movie.viewers} lượt xem</>)}</span>
                  </div>
                </div>
              </div>
            ));
          })()
        }
      </div>
    </section>
  );
}

export default FeaturedMovies;
