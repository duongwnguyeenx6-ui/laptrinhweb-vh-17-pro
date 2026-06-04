import React from 'react';
import './Icon.css';

function Icon({ name = 'play', size = 18, animation = 'none', className = '' }) {
  const cls = ['app-icon', `app-icon--${name}`, animation !== 'none' ? `app-icon--${animation}` : '', className].join(' ').trim();

  switch (name) {
    case 'play':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
        </svg>
      );
    case 'plus':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="currentColor" />
        </svg>
      );
    case 'search':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'flame':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2s4 3.5 4 7.5A4 4 0 0 1 12 17a4 4 0 0 1-4-4c0-4 4-7 4-11z" fill="currentColor" />
        </svg>
      );
    case 'heart':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21s-7-4.35-9-7.02C-1.2 9.14 4.8 4 12 9c7.2-5 13.2.14 9 4.98C19 16.65 12 21 12 21z" fill="currentColor" />
        </svg>
      );
    case 'star':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.3L6.16 20l1.2-6.99L2 10.24l6.92-1.01L12 3l3.08 6.23L22 10.24l-5.36 2.77L17.84 20z" fill="currentColor" />
        </svg>
      );
    case 'grid':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1.8" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="1.8" fill="currentColor" />
          <rect x="3" y="14" width="7" height="7" rx="1.8" fill="currentColor" />
          <rect x="14" y="14" width="7" height="7" rx="1.8" fill="currentColor" />
        </svg>
      );
    case 'bolt':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" fill="currentColor" />
        </svg>
      );
    case 'planet':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="M3 12c2.5-4.5 6-6 10-6s7.5 1.5 10 6c-2.5 4.5-6 6-10 6s-7.5-1.5-10-6z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'ghost':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C7 2 4 5.5 4 11v7c0 1.1.9 2 2 2h1.5C8.33 20 8 19.33 8 18.5S8.33 17 9 17s1 .67 1 .5S11 17 12 17s2 .5 2 .5 1-.5 1-.5.33.17 1 .5.67 1.5.5 1.5H18c1.1 0 2-.9 2-2V11c0-5.5-3-9-8-9z" fill="currentColor" />
          <circle cx="9" cy="11" r="1.1" fill="#fff" />
          <circle cx="15" cy="11" r="1.1" fill="#fff" />
        </svg>
      );
    case 'family':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="9" r="2.5" fill="currentColor" />
          <circle cx="17" cy="9" r="2.5" fill="currentColor" />
          <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'crown':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16l2-8 4 6 4-6 2 8h-12z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
          <circle cx="6" cy="8" r="1" fill="currentColor" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="18" cy="8" r="1" fill="currentColor" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l1.5 4.8L18.5 8l-4 2.9L14 16l-2-2.5L10 16l.5-5.1L6.5 8l5-1.2L12 2z" fill="currentColor" opacity="0.95" />
        </svg>
      );
    case 'film':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M7 6v12M17 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 9h4M4 15h4M16 9h4M16 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l7 4v5.5c0 4-2.7 7.5-7 8-4.3-.5-7-4-7-8V7l7-4z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
        </svg>
      );
    case 'smile':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M8 10h.01M16 10h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 16c1.33-1.5 3.33-1.5 4.66 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'users':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 20H3v-1.5C3 16.67 5.67 15 9 15h6c3.33 0 6 1.67 6 3.5V20h-4" fill="currentColor" />
          <circle cx="9" cy="8" r="4" fill="currentColor" />
          <circle cx="17" cy="8" r="4" fill="currentColor" />
        </svg>
      );

    case 'brain':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3c-2.5 0-4 1.5-4 3v1H7a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1v1c0 1.5 1.5 3 4 3s4-1.5 4-3v-1h1a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3h-1V6c0-1.5-1.5-3-4-3z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.02" />
        </svg>
      );

    case 'mask':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 9c0-3 4-6 8-6s8 3 8 6v2c0 3-4 6-8 6s-8-3-8-6V9z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.02" />
          <path d="M8 11c.9 1.2 3 1.2 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 11c-.9 1.2-3 1.2-4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case 'compass':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 15l6-3-3-6-6 3 3 6z" fill="currentColor" />
        </svg>
      );

    case 'lock':
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.02" />
          <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}

export default Icon;
