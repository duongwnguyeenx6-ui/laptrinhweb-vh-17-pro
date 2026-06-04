import React, { useState, useEffect } from 'react';
import './AuthScreen.css';

function AuthScreen({ users, onLogin, onRegister, onForgotPassword, onBack, mode, onSwitchMode, statusMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);

  // Tải danh sách tài khoản đã lưu từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem('movieApp_users');
    if (stored) {
      const parsedUsers = JSON.parse(stored);
      // Lấy danh sách email duy nhất từ tài khoản đã lưu
      const uniqueEmails = [...new Set(parsedUsers.map(u => u.email))];
      setSavedAccounts(uniqueEmails);
    }
  }, []);

  // Xóa form khi chuyển mode
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [mode]);

  // Tự động điền email khi chọn từ danh sách tài khoản đã lưu
  const handleSelectSavedAccount = (selectedEmail) => {
    setEmail(selectedEmail);
    setShowSavedAccounts(false);
    // Lấy mật khẩu từ tài khoản đã lưu để thuận tiện
    const user = users.find(u => u.email === selectedEmail);
    if (user) {
      setPassword(user.password);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'login') {
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
        return;
      }
      alert('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        alert('Mật khẩu và xác nhận mật khẩu phải giống nhau.');
        return;
      }
      const success = onRegister({ email, password, username: email.split('@')[0] });
      if (success) {
        return;
      }
      return;
    }

    if (mode === 'forgot') {
      const success = onForgotPassword(email);
      if (success) {
        return;
      }
      return;
    }
  };

  return (
    <div className="auth-screen">
      <button className="auth-back-button" onClick={onBack}>⬅ Quay lại trang chủ</button>

      <div className="auth-card">
        <div className="auth-header">
          <h3 className="auth-title">
            {mode === 'login' && <span>ĐĂNG NHẬP</span>}
            {mode === 'register' && <span>ĐĂNG KÝ</span>}
            {mode === 'forgot' && <span>QUÊN MẬT KHẨU</span>}
          </h3>
        </div>

        {statusMessage && (
          <div className="auth-alert">{statusMessage}</div>
        )}

        {/* Hiển thị danh sách tài khoản đã lưu ở chế độ đăng nhập */}
        {mode === 'login' && savedAccounts.length > 0 && (
          <div className="saved-accounts-section">
            <button 
              type="button" 
              className="saved-accounts-toggle"
              onClick={() => setShowSavedAccounts(!showSavedAccounts)}
            >
              💾 Tài khoản đã lưu ({savedAccounts.length})
            </button>
            {showSavedAccounts && (
              <div className="saved-accounts-list">
                {savedAccounts.map((email) => (
                  <button
                    key={email}
                    type="button"
                    className="saved-account-item"
                    onClick={() => handleSelectSavedAccount(email)}
                  >
                    📧 {email}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Địa chỉ Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div className="auth-field">
              <label className="auth-label">Mật khẩu</label>
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="auth-field">
              <label className="auth-label">Xác nhận mật khẩu</label>
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit">
            {mode === 'login' && 'ĐĂNG NHẬP'}
            {mode === 'register' && 'ĐĂNG KÝ'}
            {mode === 'forgot' && 'GỬI YÊU CẦU'}
          </button>
        </form>

        <div className="auth-links">
          {mode === 'login' && (
            <button type="button" className="auth-link" onClick={() => onSwitchMode('forgot')}>Quên mật khẩu?</button>
          )}
          {mode !== 'login' && (
            <button type="button" className="auth-link" onClick={() => onSwitchMode('login')}>Quay lại đăng nhập</button>
          )}
        </div>

        <div className="auth-switch">
          {mode !== 'register' && (
            <button type="button" className="auth-link" onClick={() => onSwitchMode('register')}>Chưa có tài khoản? Đăng ký ngay</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;