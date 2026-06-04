import React from 'react';
import './InfoPage.css';
import Icon from './Icon';

function InfoPage({ title, subtitle, sections, onBack }) {
  return (
    <div className="info-page">
      <div className="info-page-shell">
        <button
          type="button"
          className="btn info-back-button fw-bold text-white border-0"
          onClick={onBack}
        >
          ⬅ Quay lại
        </button>

        <div className="info-page-card">
          <div className="info-page-header">
            <div className="info-page-icon">
              <Icon name="play" size={20} />
            </div>
            <div>
              <h2 className="fw-bold info-page-title">{title}</h2>
              <p className="info-page-subtitle">{subtitle}</p>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.heading} className="info-page-section">
              <h3>{section.heading}</h3>
              <p>{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
