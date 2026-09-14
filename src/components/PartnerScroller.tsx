import { useEffect, useRef } from 'react';

export default function PartnerScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) {
      return;
    }

    let position = 0;
    let animationId = 0;

    const scroll = () => {
      position -= 0.5;

      const firstImage = track.children[0] as HTMLElement;
      const imgWidth =
        firstImage.offsetWidth +
        10 * parseFloat(getComputedStyle(document.documentElement).fontSize);

      if (Math.abs(position) >= imgWidth) {
        position += imgWidth;
        track.appendChild(track.children[0]);
      }

      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationId = requestAnimationFrame(scroll);
        } else {
          cancelAnimationFrame(animationId);
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="partner-scrolling" ref={containerRef}>
      <div className="partner-scrolling-partners" ref={trackRef}>
        <img src="/partner.svg" alt="Partner 1" />
        <img src="/partner.svg" alt="Partner 2" />
        <img src="/partner.svg" alt="Partner 3" />
        <img src="/partner.svg" alt="Partner 4" />
        <img src="/partner.svg" alt="Partner 5" />
      </div>
      <div className="partner-scrolling-fade-left"></div>
      <div className="partner-scrolling-fade-right"></div>
    </div>
  );
}
