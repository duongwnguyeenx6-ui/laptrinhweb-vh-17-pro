import React, { useState } from 'react';
import './Header.css';

function Header({ currentUser, onGoToAuth, onGoToTickets, onGoToAdmin, onLogout, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">CinemaHub</span>
        </div>

        {/* Navigation Menu */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <button type="button" className="nav-link" onClick={() => onNavigate('home')}>Trang Chủ</button>
          <button type="button" className="nav-link" onClick={() => onNavigate('movies')}>Phim</button>
          <button type="button" className="nav-link" onClick={() => onNavigate('genres')}>Thể Loại</button>
          <button type="button" className="nav-link" onClick={() => onNavigate('deals')}>Khuyến Mãi</button>
          <button type="button" className="nav-link" onClick={() => onNavigate('support')}>Hỗ Trợ</button>
        </nav>

        {/* User Section */}
        <div className="user-section">
          {currentUser ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-name">{currentUser.username}</span>
              </div>
              <div className="user-actions">
                <button className="nav-button" onClick={onGoToTickets}>Vé của tôi</button>
                {currentUser.role === 'admin' && (
                  <button className="nav-button" onClick={onGoToAdmin}>Quản trị</button>
                )}
                <button 
                  className="logout-btn"
                  onClick={onLogout}
                >
                  Đăng Xuất
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={onGoToAuth}
            >
              Đăng Nhập
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
