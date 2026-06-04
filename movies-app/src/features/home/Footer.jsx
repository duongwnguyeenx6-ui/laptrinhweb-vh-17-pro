import React, { useState } from 'react';
import './Footer.css';
import Icon from './Icon';

function Footer({ onNavigate }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubscribe = () => {
    const email = newsletterEmail.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setNewsletterMessage('Vui lòng nhập email.');
      return;
    }
    if (!validEmail.test(email)) {
      setNewsletterMessage('Email không hợp lệ.');
      return;
    }

    try {
      const stored = localStorage.getItem('movieApp_subscriptions');
      const list = stored ? JSON.parse(stored) : [];
      const nextList = Array.isArray(list) ? [...new Set([...list, email])] : [email];
      localStorage.setItem('movieApp_subscriptions', JSON.stringify(nextList));
      setNewsletterMessage('Cảm ơn bạn đã đăng ký!');
      setNewsletterEmail('');
    } catch (error) {
      console.error('Lỗi lưu email đăng ký:', error);
      setNewsletterMessage('Không thể lưu email hiện tại.');
    }
  };

  const handleNewsletterKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleNewsletterSubscribe();
    }
  };

  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Về CinemaHub</h3>
            <p>
              CinemaHub là hệ thống rạp chiếu phim hiện đại, phục vụ trải nghiệm điện ảnh 4K, IMAX, 3D và phòng VIP.
              Khám phá lịch chiếu, vé ưu đãi và bộ phim chất lượng cho cả gia đình.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">f</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">𝕏</a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">📷</a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube"><Icon name="play" size={16} animation="pulse" /></a>
            </div>
            <div className="footer-contact">
              <p>Hotline: <strong>1800.1234 (miễn phí)</strong></p>
              <p>Email: <strong>support@cinemahub.vn</strong></p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Liên Kết Nhanh</h3>
            <ul>
              <li><button type="button" className="footer-link-button" onClick={() => onNavigate('home')}>Trang Chủ</button></li>
              <li><button type="button" className="footer-link-button" onClick={() => onNavigate('movies')}>Tất Cả Phim</button></li>
              <li><button type="button" className="footer-link-button" onClick={() => onNavigate('deals')}>Khuyến Mãi</button></li>
              <li><button type="button" className="footer-link-button" onClick={() => onNavigate('genres')}>Phim Mới</button></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Hỗ Trợ</h3>
            <ul>
              <li><button type="button" className="footer-link-button" onClick={() => onNavigate('faq')}>Câu Hỏi Thường Gặp</button></li>
              <li><button type="button" className="footer-link-button" onClick={() => onNavigate('support')}>Liên Hệ Hỗ Trợ</button></li>
              <li><button type="button" className="footer-link-button" onClick={() => onNavigate('terms')}>Điều Khoản Dịch Vụ</button></li>
              <li><button type="button" className="footer-link-button" onClick={() => onNavigate('privacy')}>Chính Sách Riêng Tư</button></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Theo Dõi Cập Nhật</h3>
              <p>Đăng ký email để nhận thông báo về phim chiếu mới, suất chiếu đặc biệt và ưu đãi độc quyền tại rạp.</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Email của bạn..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={handleNewsletterKeyDown}
              />
              <button type="button" onClick={handleNewsletterSubscribe}>Đăng Ký</button>
            </div>
            {newsletterMessage && <p className="newsletter-message">{newsletterMessage}</p>}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 CinemaHub. Tất cả quyền được bảo lưu.</p>
          <div className="footer-links">
            <button type="button" className="footer-link-button" onClick={() => onNavigate('privacy')}>Chính Sách</button>
            <span>|</span>
            <button type="button" className="footer-link-button" onClick={() => onNavigate('terms')}>Điều Khoản</button>
            <span>|</span>
            <button type="button" className="footer-link-button" onClick={() => onNavigate('cookies')}>Cookie</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
