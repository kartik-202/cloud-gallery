"use client"
import { useState, useEffect, useCallback, useRef } from "react";

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
  { id: 17, src: "/gallery/WhatsApp%20Image%202026-05-27%20at%206.59.07%20PM.jpeg", aspect: "portrait", alt: "Gallery image 17" },
  { id: 18, src: "/gallery/WhatsApp%20Image%202026-05-27%20at%206.59.08%20PM%20(1).jpeg", aspect: "portrait", alt: "Gallery image 18" },
  { id: 19, src: "/gallery/WhatsApp%20Image%202026-05-27%20at%206.59.08%20PM%20(2).jpeg", aspect: "portrait", alt: "Gallery image 19" },
  { id: 20, src: "/gallery/WhatsApp%20Image%202026-05-27%20at%206.59.08%20PM.jpeg", aspect: "portrait", alt: "Gallery image 20" },
  { id: 21, src: "/gallery/WhatsApp%20Image%202026-05-27%20at%206.59.09%20PM%20(1).jpeg", aspect: "portrait", alt: "Gallery image 21" },
  { id: 22, src: "/gallery/WhatsApp%20Image%202026-05-27%20at%206.59.09%20PM%20(2).jpeg", aspect: "portrait", alt: "Gallery image 22" },
  { id: 23, src: "/gallery/WhatsApp%20Image%202026-05-27%20at%206.59.09%20PM.jpeg", aspect: "portrait", alt: "Gallery image 23" },
];

const COVER = "/gallery/WhatsApp Image 2026-05-28 at 12.46.33 AM (1).jpeg";

interface UploadedPhoto {
  id: number;
  src: string;
  alt: string;
  aspect: string;
  status: "uploading" | "done";
  progress: number;
  name: string;
}

export default function LandingPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [lightboxSource, setLightboxSource] = useState<"gallery" | "uploaded">("gallery");
  const [loaded, setLoaded] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [filteredVisible, setFilteredVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 100);
    const t2 = setTimeout(() => setHeaderVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const donePhotos = uploadedPhotos.filter(p => p.status === "done");

  useEffect(() => {
    if (donePhotos.length > 0) setFilteredVisible(true);
  }, [donePhotos.length]);

  const openLightbox = (idx: number, source: "gallery" | "uploaded") => {
    setLightbox(idx);
    setLightboxSource(source);
  };
  const closeLightbox = () => setLightbox(null);

  const currentPhotos = lightboxSource === "gallery" ? PHOTOS : donePhotos;

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
    if (lightbox !== null) setLightbox((lightbox + 1) % currentPhotos.length);
  }, [lightbox, currentPhotos.length]);

  const goPrev = useCallback(() => {
    if (lightbox !== null) setLightbox((lightbox - 1 + currentPhotos.length) % currentPhotos.length);
  }, [lightbox, currentPhotos.length]);

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

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const mockFiles = [
      { name: "WhatsApp Image 2026-05-27 at 6.59.08 PM (1).jpeg", src: "/filteredimages/WhatsApp%20Image%202026-05-27%20at%206.59.08%20PM%20(1).jpeg" },
      { name: "WhatsApp Image 2026-05-27 at 6.59.08 PM (2).jpeg", src: "/filteredimages/WhatsApp%20Image%202026-05-27%20at%206.59.08%20PM%20(2).jpeg" },
      { name: "WhatsApp Image 2026-05-27 at 6.59.09 PM (1).jpeg", src: "/filteredimages/WhatsApp%20Image%202026-05-27%20at%206.59.09%20PM%20(1).jpeg" }
    ];

    mockFiles.forEach((mockFile, index) => {
      const newPhoto: UploadedPhoto = {
        id: Date.now() + Math.random() + index,
        src: mockFile.src,
        alt: mockFile.name,
        aspect: "portrait",
        status: "uploading",
        progress: 0,
        name: mockFile.name,
      };
      setUploadedPhotos(prev => [...prev, newPhoto]);

      // Simulate upload progress taking exactly 3 seconds (3000ms)
      let progress = 0;
      const totalTime = 3000;
      const tick = 100;
      const increment = (tick / totalTime) * 100;
      const interval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedPhotos(prev =>
            prev.map(p => p.id === newPhoto.id ? { ...p, progress: 100, status: "done" } : p)
          );
        } else {
          setUploadedPhotos(prev =>
            prev.map(p => p.id === newPhoto.id ? { ...p, progress } : p)
          );
        }
      }, tick);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

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

        /* UPLOAD PANEL */
        .upload-panel {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px 48px;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, padding 0.4s ease;
        }
        .upload-panel.open {
          max-height: 1200px;
          opacity: 1;
          padding-bottom: 48px;
        }

        .dropzone {
          border: 1.5px dashed #c5bab1;
          border-radius: 4px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: #faf8f5;
          position: relative;
        }
        .dropzone.dragging {
          border-color: #3a3028;
          background: #f0ece5;
        }
        .dropzone-icon {
          font-size: 32px;
          color: #9a8e83;
          margin-bottom: 16px;
          display: block;
        }
        .dropzone-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-style: italic;
          font-size: 22px;
          color: #3a3028;
          margin-bottom: 8px;
        }
        .dropzone-sub {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #9a8e83;
          margin-bottom: 24px;
        }

        /* UPLOAD QUEUE */
        .upload-queue {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .queue-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #faf8f5;
          border: 0.5px solid #ddd6ce;
          border-radius: 4px;
          padding: 10px 16px;
        }
        .queue-thumb {
          width: 44px;
          height: 44px;
          border-radius: 3px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .queue-thumb.placeholder-thumb {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eae3db;
          border: 0.5px solid #c5bab1;
        }
        .queue-info { flex: 1; min-width: 0; }
        .queue-name {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #3a3028;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 5px;
        }
        .queue-progress-bar {
          height: 1.5px;
          background: #ddd6ce;
          border-radius: 2px;
          overflow: hidden;
        }
        .queue-progress-fill {
          height: 100%;
          background: #3a3028;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .queue-status {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .queue-status.uploading { color: #9a8e83; }
        .queue-status.done { color: #4a7c59; }

        /* FILTERED BANNER */
        .filtered-banner {
          margin-top: 24px;
          border: 0.5px solid #c5bab1;
          background: #f5f2ee;
          border-radius: 4px;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .filtered-banner.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .filtered-banner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4a7c59;
          flex-shrink: 0;
        }
        .filtered-banner-text {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #3a3028;
        }
        .filtered-banner-count {
          margin-left: auto;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-style: italic;
          font-size: 18px;
          color: #3a3028;
        }

        /* UPLOADED PHOTOS GRID */
        .uploaded-grid {
          margin-top: 16px;
          columns: 3;
          column-gap: 12px;
          opacity: 0;
          transition: opacity 0.5s ease 0.2s;
        }
        .uploaded-grid.visible { opacity: 1; }
        @media (max-width: 900px) { .uploaded-grid { columns: 2; } }
        @media (max-width: 560px) { .uploaded-grid { columns: 1; } }

        .uploaded-tag {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(58, 48, 40, 0.7);
          color: rgba(255,255,255,0.85);
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 2px;
          backdrop-filter: blur(4px);
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
          <img className="hero-img" src={COVER} alt="KK Studios cover" />
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
          <button
            className="nav-action"
            onClick={() => setShowUploadPanel(p => !p)}
          >
            {showUploadPanel ? "Close Upload" : "Upload Photos"}
          </button>
        </div>

        {/* UPLOAD PANEL */}
        <div className={`upload-panel ${showUploadPanel ? "open" : ""}`}>
          {/* Dropzone */}
          <div
            className={`dropzone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => processFiles(e.target.files)}
            />
            <svg
              className="dropzone-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              style={{ width: 44, height: 44, margin: "0 auto 14px" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="dropzone-title">Drop your images here</p>
            <p className="dropzone-sub">or click to browse · jpg, png, webp</p>
            <button
              className="nav-action"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              style={{ fontSize: "10px" }}
            >
              Select Images
            </button>
          </div>

          {/* Upload queue */}
          {uploadedPhotos.length > 0 && (
            <div className="upload-queue">
              {uploadedPhotos.map((photo) => (
                <div key={photo.id} className="queue-item">
                  {photo.status === "done" ? (
                    <img className="queue-thumb" src={photo.src} alt={photo.name} />
                  ) : (
                    <div className="queue-thumb placeholder-thumb">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20, color: "#9a8e83" }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  <div className="queue-info">
                    <div className="queue-name">{photo.name}</div>
                    <div className="queue-progress-bar">
                      <div
                        className="queue-progress-fill"
                        style={{ width: `${photo.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className={`queue-status ${photo.status}`}>
                    {photo.status === "uploading" ? "Uploading…" : "Done"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Filtered banner */}
          {donePhotos.length > 0 && (
            <div className={`filtered-banner ${filteredVisible ? "visible" : ""}`}>
              <div className="filtered-banner-dot" />
              <span className="filtered-banner-text">Images Filtered</span>
              <span className="filtered-banner-count">
                {donePhotos.length} photo{donePhotos.length !== 1 ? "s" : ""} ready
              </span>
            </div>
          )}

          {/* Uploaded photos grid */}
          {donePhotos.length > 0 && (
            <div className={`uploaded-grid ${filteredVisible ? "visible" : ""}`}>
              {donePhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="photo-item"
                  onClick={() => openLightbox(idx, "uploaded")}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${photo.alt}`}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(idx, "uploaded")}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <div className="photo-hover-overlay">
                    <div className="photo-expand-icon" role="button" aria-label="Expand image">
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
                  <span className="uploaded-tag">Filtered</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MAIN GALLERY */}
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
                onClick={() => openLightbox(idx, "gallery")}
                role="button"
                tabIndex={0}
                aria-label={`Open ${photo.alt}`}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(idx, "gallery")}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <div className="photo-hover-overlay">
                  <div
                    className="photo-expand-icon"
                    onClick={(e) => { e.stopPropagation(); openLightbox(idx, "gallery"); }}
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
                src={currentPhotos[lightbox]?.src}
                alt={currentPhotos[lightbox]?.alt}
              />
            </div>
            <button className="lb-close" onClick={closeLightbox} aria-label="Close">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <button className="lb-download" onClick={(e) => handleDownload(e, currentPhotos[lightbox]?.src)} aria-label="Download">
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
            <span className="lb-counter">{lightbox + 1} / {currentPhotos.length}</span>
          </div>
        )}
      </div>
    </>
  );
}