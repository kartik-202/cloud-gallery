"use client"
import { useState, useEffect, useCallback } from "react";

const PHOTOS = [
    { id: 1, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.45.36%20AM%20(1).jpeg", aspect: "portrait", alt: "Gallery image 1" },
    { id: 2, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.45.36%20AM%20(2).jpeg", aspect: "portrait", alt: "Gallery image 2" },
    { id: 3, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.45.36%20AM%20(3).jpeg", aspect: "portrait", alt: "Gallery image 3" },
    { id: 4, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.45.36%20AM%20(4).jpeg", aspect: "portrait", alt: "Gallery image 4" },
    { id: 5, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.45.36%20AM%20(5).jpeg", aspect: "portrait", alt: "Gallery image 5" },
    { id: 6, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.45.36%20AM%20(6).jpeg", aspect: "portrait", alt: "Gallery image 6" },
    { id: 7, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.45.36%20AM%20(7).jpeg", aspect: "portrait", alt: "Gallery image 7" },
    { id: 8, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.45.36%20AM.jpeg", aspect: "portrait", alt: "Gallery image 8" },
    { id: 9, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.46.32%20AM.jpeg", aspect: "landscape", alt: "Gallery image 9" },
    { id: 10, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.46.33%20AM%20(1).jpeg", aspect: "portrait", alt: "Gallery image 10" },
    { id: 11, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.46.33%20AM%20(2).jpeg", aspect: "portrait", alt: "Gallery image 11" },
    { id: 12, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.46.33%20AM.jpeg", aspect: "landscape", alt: "Gallery image 12" },
    { id: 13, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.46.34%20AM%20(1).jpeg", aspect: "portrait", alt: "Gallery image 13" },
    { id: 14, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.46.34%20AM%20(2).jpeg", aspect: "portrait", alt: "Gallery image 14" },
    { id: 15, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.46.34%20AM.jpeg", aspect: "portrait", alt: "Gallery image 15" },
    { id: 16, src: "/gallery/WhatsApp%20Image%202026-05-28%20at%2012.46.35%20AM.jpeg", aspect: "landscape", alt: "Gallery image 16" },
];

const COVER = "/gallery/WhatsApp Image 2026-05-28 at 12.46.33 AM (1).jpeg";

export default function LandingPage() {
    const [lightbox, setLightbox] = useState<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setLoaded(true), 100);
        const t2 = setTimeout(() => setHeaderVisible(true), 400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const openLightbox = (idx: number) => setLightbox(idx);
    const closeLightbox = () => setLightbox(null);

    const handleDownload = (e: React.MouseEvent, src: string) => {
        e.stopPropagation();
        const link = document.createElement("a");
        link.href = src;
        const filename = src.split("/").pop() || "photo.jpeg";
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const goNext = useCallback(() => {
        if (lightbox !== null) setLightbox((lightbox + 1) % PHOTOS.length);
    }, [lightbox]);

    const goPrev = useCallback(() => {
        if (lightbox !== null) setLightbox((lightbox - 1 + PHOTOS.length) % PHOTOS.length);
    }, [lightbox]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (lightbox === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightbox, goNext, goPrev]);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body, #root {
          background: #f5f2ee;
          min-height: 100vh;
          font-family: 'Jost', sans-serif;
        }

        .gallery-wrap {
          background: #f5f2ee;
          min-height: 100vh;
        }

        /* HERO */
        .hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(${loaded ? "1.02" : "1.08"});
          transition: transform 2.4s cubic-bezier(0.16, 1, 0.3, 1);
          filter: brightness(0.62);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 0 24px;
          opacity: ${headerVisible ? "1" : "0"};
          transform: translateY(${headerVisible ? "0" : "20px"});
          transition: opacity 1s ease, transform 1s ease;
        }
        .hero-eyebrow {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 11px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          margin-bottom: 18px;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 1;
          letter-spacing: -0.01em;
          margin-bottom: 12px;
        }
        .hero-title em {
          font-style: italic;
          font-weight: 300;
        }
        .hero-ampersand {
          font-size: 0.65em;
          opacity: 0.7;
          display: block;
          margin: 4px 0;
        }
        .hero-date {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-top: 20px;
        }
        .hero-scroll {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: ${headerVisible ? "1" : "0"};
          transition: opacity 1s 0.6s ease;
        }
        .hero-scroll-line {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.5);
          animation: scrollLine 1.8s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          40% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          60% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
        .hero-scroll-text {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }

        /* NAV */
        .gallery-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 48px;
          background: #f5f2ee;
        }
        .nav-brand {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 18px;
          letter-spacing: 0.08em;
          color: #3a3028;
        }
        .nav-brand em { font-style: italic; }
        .nav-count {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #9a8e83;
        }
        .nav-action {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #3a3028;
          background: none;
          border: 1px solid #c5bab1;
          padding: 10px 22px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .nav-action:hover {
          background: #3a3028;
          color: #f5f2ee;
          border-color: #3a3028;
        }

        /* GALLERY GRID */
        .gallery-section {
          padding: 0 32px 80px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .section-divider {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: #d5ccc4;
        }
        .divider-label {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #9a8e83;
          white-space: nowrap;
        }

        .photo-grid {
          columns: 3;
          column-gap: 12px;
        }
        @media (max-width: 900px) { .photo-grid { columns: 2; } }
        @media (max-width: 560px) { .photo-grid { columns: 1; } }

        .photo-item {
          break-inside: avoid;
          margin-bottom: 12px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          display: block;
        }
        .photo-item img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
          filter: brightness(0.97) saturate(0.95);
        }
        .photo-item:hover img {
          transform: scale(1.03);
          filter: brightness(0.88) saturate(1);
        }
        .photo-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(30, 22, 15, 0);
          transition: background 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .photo-item:hover .photo-hover-overlay {
          background: rgba(30, 22, 15, 0.18);
        }
        .photo-expand-icon, .photo-download-icon {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease, border-color 0.2s ease;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(4px);
        }
        .photo-expand-icon svg, .photo-download-icon svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.5;
        }
        .photo-expand-icon:hover, .photo-download-icon:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: #fff;
          color: #fff;
        }
        .photo-item:hover .photo-expand-icon, .photo-item:hover .photo-download-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* LIGHTBOX */
        .lightbox-bg {
          position: fixed;
          inset: 0;
          background: rgba(10, 8, 5, 0.97);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .lightbox-inner {
          position: relative;
          max-width: 92vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
        }
        .lightbox-img {
          max-width: 88vw;
          max-height: 88vh;
          object-fit: contain;
          display: block;
          animation: imgFade 0.3s ease;
        }
        @keyframes imgFade { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

        .lb-btn {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 1001;
        }
        .lb-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.5);
          color: #fff;
        }
        .lb-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.5; }
        .lb-prev { left: 24px; }
        .lb-next { right: 24px; }
        .lb-close {
          position: fixed;
          top: 24px;
          right: 24px;
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 1001;
        }
        .lb-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .lb-close svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.5; }
        .lb-download {
          position: fixed;
          top: 24px;
          right: 76px;
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 1001;
        }
        .lb-download:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .lb-download svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.5; }
        .lb-counter {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 11px;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.45);
          z-index: 1001;
        }

        /* FOOTER */
        .gallery-footer {
          text-align: center;
          padding: 40px 24px 60px;
          border-top: 1px solid #ddd6ce;
        }
        .footer-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 15px;
          letter-spacing: 0.15em;
          color: #3a3028;
          margin-bottom: 8px;
        }
        .footer-tagline {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #9a8e83;
        }
      `}</style>

            <div className="gallery-wrap">
                {/* HERO */}
                <div className="hero">
                    <img className="hero-img" src={COVER} alt="Meghan and Desmond wedding cover" />
                    <div className="hero-overlay" />
                    <div className="hero-content">
                        <p className="hero-eyebrow">Photography by kk Studios</p>
                        <h1 className="hero-title">
                            <em>Example</em>

                        </h1>

                    </div>
                    <div className="hero-scroll">
                        <div className="hero-scroll-line" />
                        <span className="hero-scroll-text">Scroll</span>
                    </div>
                </div>

                {/* NAV BAR */}
                <div className="gallery-nav">
                    <span className="nav-brand"><em>KK Studios</em> Photography</span>
                    <span className="nav-count">{PHOTOS.length} photographs</span>

                </div>

                {/* PHOTOS */}
                <div className="gallery-section">
                    <div className="section-divider">
                        <div className="divider-line" />
                        <span className="divider-label">The Collection</span>
                        <div className="divider-line" />
                    </div>

                    <div className="photo-grid">
                        {PHOTOS.map((photo, idx) => (
                            <div
                                key={photo.id}
                                className="photo-item"
                                onClick={() => openLightbox(idx)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Open ${photo.alt}`}
                                onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
                            >
                                <img src={photo.src} alt={photo.alt} loading="lazy" />
                                <div className="photo-hover-overlay">
                                    <div 
                                        className="photo-expand-icon" 
                                        onClick={(e) => { e.stopPropagation(); openLightbox(idx); }}
                                        role="button"
                                        aria-label="Expand image"
                                    >
                                        <svg viewBox="0 0 24 24">
                                            <polyline points="15 3 21 3 21 9" />
                                            <polyline points="9 21 3 21 3 15" />
                                            <line x1="21" y1="3" x2="14" y2="10" />
                                            <line x1="3" y1="21" x2="10" y2="14" />
                                        </svg>
                                    </div>
                                    <div 
                                        className="photo-download-icon"
                                        onClick={(e) => handleDownload(e, photo.src)}
                                        role="button"
                                        aria-label="Download image"
                                    >
                                        <svg viewBox="0 0 24 24">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="gallery-footer">
                    <p className="footer-name">KK Studios Photography</p>
                    <p className="footer-tagline">Timeless wedding photography · kkstudios.com</p>
                </div>

                {/* LIGHTBOX */}
                {lightbox !== null && (
                    <div className="lightbox-bg" onClick={closeLightbox}>
                        <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
                            <img
                                key={lightbox}
                                className="lightbox-img"
                                src={PHOTOS[lightbox].src.replace("w=800", "w=1400")}
                                alt={PHOTOS[lightbox].alt}
                            />
                        </div>

                        <button className="lb-close" onClick={closeLightbox} aria-label="Close">
                            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                        <button className="lb-download" onClick={(e) => handleDownload(e, PHOTOS[lightbox].src)} aria-label="Download">
                            <svg viewBox="0 0 24 24">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </button>
                        <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next">
                            <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                        <span className="lb-counter">{lightbox + 1} / {PHOTOS.length}</span>
                    </div>
                )}
            </div>
        </>
    );
}