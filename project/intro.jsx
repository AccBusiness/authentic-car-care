/* ========== Authentic Car Care — White Intro ========== */

function IntroAnimation({ onReveal, onComplete }) {
  const [phase, setPhase] = React.useState(0);
  const doneRef = React.useRef(false);

  const skip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase(4);
    document.body.style.overflow = '';
    onReveal();
    setTimeout(onComplete, 60);
  };

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';

    const t = [
      setTimeout(() => setPhase(1), 400),        // car fades in
      setTimeout(() => setPhase(2), 1800),        // text appears
      setTimeout(() => setPhase(3), 4500),        // begin fade out
      setTimeout(() => onReveal(), 4800),          // page starts showing
      setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          setPhase(4);
          document.body.style.overflow = '';
          onComplete();
        }
      }, 6800),
    ];

    return () => { t.forEach(clearTimeout); document.body.style.overflow = ''; };
  }, []);

  if (phase >= 4) return null;

  return (
    <div className={`intro intro-p${phase}`} onClick={skip}>
      <div className="intro-car">
        <img src="assets/hero-car-clean.png" alt="" />
      </div>

      <div className="intro-logo">
        <img src="assets/logo-glyph.png" alt="" />
      </div>

      <div className="intro-hero">
        <div className="intro-hero-inner">
          <h1 className="display intro-h1">
            <span>Authentic</span>{' '}<em>Car Care</em>
          </h1>
          <p className="intro-sub">Mobile detailing across Prince Edward Island</p>
        </div>
      </div>

      <div className="intro-skip">Click anywhere to skip</div>
    </div>
  );
}

Object.assign(window, { IntroAnimation });
