import React from 'react';
import './MovieCategories.css';
import Icon from './Icon';

function MovieCategories({ genres, selectedGenre, onSelectGenre }) {
  const getIconForGenre = (g) => {
    const key = (g || '').toLowerCase();
    if (key.includes('tất')) return <Icon name="grid" size={20} className="genre-icon genre-icon--all" />;
    if (key.includes('hoạt')) return <Icon name="film" size={20} className="genre-icon genre-icon--film" />;
    if (key.includes('hành')) return <Icon name="bolt" size={20} animation="pulse" className="genre-icon genre-icon--action" />;
    if (key.includes('viễn') || key.includes('khoa học')) return <Icon name="planet" size={20} animation="rotate" className="genre-icon genre-icon--sci" />;
    if (key.includes('kinh')) return <Icon name="ghost" size={20} className="genre-icon genre-icon--horror" />;
    if (key.includes('tình')) return <Icon name="heart" size={20} animation="heartbeat" className="genre-icon genre-icon--romance" />;
    if (key.includes('hài')) return <Icon name="mask" size={20} className="genre-icon genre-icon--comedy" />;
    if (key.includes('tâm')) return <Icon name="brain" size={20} className="genre-icon genre-icon--psych" />;
    if (key.includes('phiêu') || key.includes('dạo') || key.includes('phiêu lưu')) return <Icon name="compass" size={20} className="genre-icon genre-icon--adventure" />;
    if (key.includes('trinh') || key.includes('thám')) return <Icon name="search" size={20} className="genre-icon genre-icon--detective" />;
    if (key.includes('gia')) return <Icon name="family" size={20} className="genre-icon genre-icon--family" />;
    if (key.includes('sử')) return <Icon name="crown" size={20} className="genre-icon genre-icon--epic" />;
    if (key.includes('siêu') || key.includes('anh hùng')) return <Icon name="shield" size={20} className="genre-icon genre-icon--hero" />;
    if (key.includes('tù') || key.includes('tù nhân')) return <Icon name="lock" size={20} className="genre-icon genre-icon--prison" />;
    return <Icon name="sparkle" size={20} className="genre-icon" />;
  };

  return (
    <section className="movie-categories">
      <h2>Khám Phá Thể Loại</h2>
      <p className="genre-subtitle">Chọn thể loại phù hợp với tâm trạng và kéo ngay xuống phần phim để chọn tiếp.</p>
      <div className="categories-list">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`category-button ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => onSelectGenre(genre)}
          >
            <span className="genre-emoji">{getIconForGenre(genre)}</span>
            <span className="genre-name">{genre}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default MovieCategories;
