'use client';

import { useState, useRef, useEffect } from 'react';

const LOGOS = [
  { id: 1, business: 'Sparkle Auto Detailing', industry: 'Car Detailing', before: '/logos/sparkle-before.png', after: '/logos/sparkle-after.png' },
  { id: 2, business: 'Green Touch Landscaping', industry: 'Landscaping', before: '/logos/greentouch-before.png', after: '/logos/greentouch-after.png' },
  { id: 3, business: 'Chafe Catering', industry: 'Catering', before: '/logos/chafe-before.png', after: '/logos/chafe-after.png' },
  { id: 4, business: 'Sweet Treats Bakery', industry: 'Bakery', before: '/logos/sweetTreats-before.png', after: '/logos/sweetTreats-after.png' },
  { id: 5, business: 'Snap Happy Photo Studio', industry: 'Photography', before: '/logos/snaphappy-before.png', after: '/logos/snaphappy-after.png' },
  { id: 6, business: 'On The Go Mobile Detailing', industry: 'Mobile Detailing', before: '/logos/onthego-before.png', after: '/logos/onthego-after.png' },
];

function LogoCard({ logo }) {
  const [dividerPos, setDividerPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newPos = ((e.clientX - rect.left) / rect.width) * 100;
      setDividerPos(Math.max(0, Math.min(100, newPos)));
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const newPos = ((touch.clientX - rect.left) / rect.width) * 100;
      setDividerPos(Math.max(0, Math.min(100, newPos)));
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging]);

  return (
    <div className="logo-card-wrapper">
      <div className="industry-pill">{logo.industry}</div>

      <div
        ref={containerRef}
        className="logo-card"
        style={{
          '--divider-pos': `${dividerPos}%`,
        }}
      >
        {/* BEFORE Image */}
        <div className="logo-side before-side">
          <img src={logo.before} alt={`${logo.business} - Before`} />
          <div className="badge before-badge">BEFORE</div>
        </div>

        {/* AFTER Image */}
        <div className="logo-side after-side">
          <img src={logo.after} alt={`${logo.business} - After`} />
          <div className="badge after-badge">AFTER</div>
        </div>

        {/* Divider */}
        <div
          className="divider"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ left: `calc(var(--divider-pos) - 20px)` }}
        >
          <div className="divider-handle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 6L6 8M8 6L6 4M8 6H12M12 6L14 8M12 6L14 4M12 6H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Clip mask for AFTER image */}
        <div
          className="after-overlay"
          style={{ width: `calc(100% - var(--divider-pos))` }}
        >
          <img src={logo.after} alt={`${logo.business} - After`} />
        </div>
      </div>

      <div className="business-name">{logo.business}</div>
    </div>
  );
}

export default function LogoSlider() {
  return (
    <div className="logo-slider-container">
      <style>{`
        :root {
          --bg: ${`var(--background, #111111)`};
          --text: ${`var(--text-color, #ffffff)`};
          --accent: ${`var(--accent-color, #d4af37)`};
          --border: ${`var(--border-color, rgba(255, 255, 255, 0.1))`};
        }

        .logo-slider-container {
          background-color: var(--bg);
          color: var(--text);
          min-height: 100vh;
          padding: 60px 20px;
          font-family: 'DM Sans', sans-serif;
        }

        .slider-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
        }

        .watermark {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 2px;
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 8vw, 64px);
          font-weight: 700;
          letter-spacing: 8px;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .title-underline {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }

        .page-subheader {
          font-size: 14px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 2px;
          margin-top: 30px;
        }

        .logos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .logos-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        @media (min-width: 768px) and (max-width: 1200px) {
          .logos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1200px) {
          .logos-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .logo-card-wrapper {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .industry-pill {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--accent);
          background: rgba(212, 175, 55, 0.1);
          padding: 6px 12px;
          border-radius: 20px;
          width: fit-content;
          border: 1px solid var(--border);
        }

        .logo-card {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          cursor: grab;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .logo-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .logo-card:active {
          cursor: grabbing;
        }

        .logo-side {
          position: absolute;
          top: 0;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .before-side {
          left: 0;
        }

        .after-side {
          right: 0;
        }

        .logo-side img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .after-overlay {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          overflow: hidden;
          z-index: 2;
        }

        .after-overlay img {
          width: 200%;
          height: 100%;
          object-fit: cover;
          margin-left: calc(var(--divider-pos) - 100%);
        }

        .badge {
          position: absolute;
          top: 15px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 4px;
          z-index: 3;
        }

        .before-badge {
          left: 15px;
          background-color: #dc2626;
          color: white;
        }

        .after-badge {
          right: 15px;
          background-color: #16a34a;
          color: white;
        }

        .divider {
          position: absolute;
          top: 0;
          width: 40px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
          cursor: grab;
          user-select: none;
        }

        .divider:active {
          cursor: grabbing;
        }

        .divider::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 100%;
          background: rgba(255, 255, 255, 0.5);
        }

        .divider-handle {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          color: var(--bg);
          cursor: grab;
        }

        .divider:active .divider-handle {
          cursor: grabbing;
        }

        .business-name {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text);
          text-align: center;
          margin-top: 10px;
        }
      `}</style>

      <div className="slider-header">
        <div className="watermark">MayhemTBD</div>
        <h1 className="page-title">
          BRAND TRANSFORMATIONS
          <div className="title-underline" />
        </h1>
        <p className="page-subheader">Drag to reveal</p>
      </div>

      <div className="logos-grid">
        {LOGOS.map((logo) => (
          <LogoCard key={logo.id} logo={logo} />
        ))}
      </div>
    </div>
  );
}
