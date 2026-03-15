import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// You will need to save the 3 images you provided into the 'public' folder 
// of your project and name them banner1.jpg, banner2.jpg, and banner3.jpg
const slides = [
  { id: 1, image: '/images/banner1.jpg' },
  { id: 2, image: '/images/banner2.jpg' },
  { id: 3, image: '/images/banner3.jpg' }
];

const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [isAnim, setIsAnim] = useState(false);

  // Reliable interval logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3500); // 3.5 seconds as requested
    
    // Clear timer on manual navigation or unmount
    return () => clearInterval(timer);
  }, [current]); // Re-run effect when current changes (e.g. manual click) to reset the 3.5s countdown

  const goNext = () => {
    if (isAnim) return;
    setIsAnim(true);
    setCurrent(p => (p === slides.length - 1 ? 0 : p + 1));
    setTimeout(() => setIsAnim(false), 700);
  };

  const goPrev = () => {
    if (isAnim) return;
    setIsAnim(true);
    setCurrent(p => (p === 0 ? slides.length - 1 : p - 1));
    setTimeout(() => setIsAnim(false), 700);
  };

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Swipe detection
  const minSwipeDistance = 50;
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goNext();
    if (isRightSwipe) goPrev();
  };

  return (
    <div 
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      
      {/* The container for the aspect ratio of the banners */}
      <div className="hero-slideshow" style={{ position: 'relative', width: '100%', backgroundColor: 'var(--color-bg-main)' }}>
        {slides.map((s, i) => (
          <a href="#products" key={s.id} style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.7s ease',
            zIndex: i === current ? 2 : 0,
            cursor: 'pointer',
            display: 'block'
          }} />
        ))}

        {/* Nav dots */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => { if (!isAnim) { setIsAnim(true); setCurrent(i); setTimeout(() => setIsAnim(false), 700); }}}
              style={{ width: i === current ? '24px' : '10px', height: '10px', borderRadius: '99px', border: 'none',
                backgroundColor: i === current ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        {/* Arrows - Only visible on desktop */}
        <button onClick={goPrev} disabled={isAnim} className="slideshow-nav-btn hide-on-mobile" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px' }}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={goNext} disabled={isAnim} className="slideshow-nav-btn hide-on-mobile" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px' }}>
          <ChevronRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default HeroSlideshow;
