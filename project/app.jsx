/* ========== Authentic Car Care — main React app ========== */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- Data ---------- */
const SERVICES = [
{
  id: 'express',
  num: '01',
  name: 'Express Wash',
  tag: 'In & out in 45 minutes',
  durationLabel: '~45 minutes',
  slotMode: 'window',
  price: 60,
  fromLabel: false,
  bullets: [
  'Hand foam wash + rinse',
  'Wheels & tire shine',
  'Quick interior vacuum',
  'Windows (outside only)'],

  allowWax: true
},
{
  id: 'interior',
  num: '02',
  name: 'Interior Care',
  tag: 'Deep clean every surface',
  durationLabel: '3–4 hours',
  slotMode: 'arrival',
  price: 110,
  fromLabel: true,
  bullets: [
  'Full vacuum & steam',
  'Carpet & seat shampoo',
  'Dash, trim & vent detail',
  'Leather conditioning'],

  allowWax: false
},
{
  id: 'exterior',
  num: '03',
  name: 'Exterior Care',
  tag: 'Showroom paint correction',
  durationLabel: '3–4 hours',
  slotMode: 'arrival',
  price: 110,
  fromLabel: true,
  bullets: [
  'Two-bucket hand wash',
  'Clay bar decontamination',
  'Wheels, arches, tires',
  'Glass + paint sealant'],

  allowWax: true
},
{
  id: 'complete',
  num: '04',
  name: 'Complete Care',
  tag: 'The full Authentic treatment',
  durationLabel: '5–6 hours · half day',
  slotMode: 'halfday',
  price: 200,
  fromLabel: true,
  bullets: [
  'Everything in Interior + Exterior',
  'Sealant wax + tire dressing',
  'Fragrance refresh'],

  allowWax: false, // included in complete
  badge: 'Most popular'
}];


const ADDONS = [
{ id: 'pet', name: 'Pet hair removal', price: 30, note: 'All services' },
{ id: 'wax', name: 'Hand wax', price: 50, note: 'Express + Exterior only' }];


const GALLERY = [
{
  id: 'mud',
  title: 'Charlottetown red mud → mirror gloss',
  category: 'Exterior Care',
  desc: 'Subaru Outback pulled off a side road. Iron decon + clay bar + hand wax left the panel ready to shoot.',
  details: [
  ['Service', 'Exterior Care'],
  ['Time on site', '3h 20m'],
  ['Add-ons', 'Hand wax'],
  ['Vehicle', 'Subaru Outback']]

},
{
  id: 'dog',
  title: 'Family wagon, golden retriever edition',
  category: 'Interior Care',
  desc: 'Six months of beach trips. Steam extraction on every seat, pet hair removal, leather rehab.',
  details: [
  ['Service', 'Interior Care'],
  ['Time on site', '4h 10m'],
  ['Add-ons', 'Pet hair removal'],
  ['Vehicle', 'Honda Pilot']]

},
{
  id: 'truck',
  title: 'Worksite truck, Cavendish to new',
  category: 'Complete Care',
  desc: 'Cement dust, gull marks, the works. Engine bay clean and full interior reset before resale.',
  details: [
  ['Service', 'Complete Care'],
  ['Time on site', '6h 00m'],
  ['Add-ons', '—'],
  ['Vehicle', 'Ford F-150']]

},
{
  id: 'sedan',
  title: 'Express wash, lunch-break turnaround',
  category: 'Express Wash',
  desc: 'Pulled into the driveway in Stratford at 12, back to spotless by 12:45.',
  details: [
  ['Service', 'Express Wash'],
  ['Time on site', '0h 45m'],
  ['Add-ons', 'Hand wax'],
  ['Vehicle', 'Toyota Camry']]

}];


/* ---------- Helpers ---------- */
const fmt = (n) => `$${n.toFixed(0)}`;

/* ---------- App root ---------- */
function App() {
  const [selectedService, setSelectedService] = useState('complete');
  const [activeAddons, setActiveAddons] = useState({});
  const service = SERVICES.find((s) => s.id === selectedService);
  const waxAllowed = service?.allowWax ?? false;

  // auto-remove wax if service doesn't allow it
  useEffect(() => {
    if (!waxAllowed && activeAddons.wax) {
      setActiveAddons((a) => ({ ...a, wax: false }));
    }
  }, [waxAllowed]);

  const addonTotal = ADDONS.reduce((sum, a) => sum + (activeAddons[a.id] ? a.price : 0), 0);
  const total = (service?.price || 0) + addonTotal;

  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Services
        selected={selectedService}
        onSelect={setSelectedService}
        addons={activeAddons}
        setAddons={setActiveAddons}
        waxAllowed={waxAllowed}
        total={total}
        service={service}
        addonTotal={addonTotal} />
      
      <Gallery />
      <Booking
        service={service}
        addons={activeAddons}
        total={total}
        onChangeService={setSelectedService}
        onToggleAddon={(id) => setActiveAddons((a) => ({ ...a, [id]: !a[id] }))}
        waxAllowed={waxAllowed} />
      
      <FAQ />
      <Footer />
    </>);

}

/* ---------- Nav ---------- */
function Nav() {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="brand">
          <div className="brand-mark"><img src="assets/logo.png" alt="" /></div>
          <div className="brand-name">
            <b>Authentic Car Care</b>
            <span>Mobile detail · PEI</span>
          </div>
        </a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#menu">Before / After</a>
          <a href="#book">Book</a>
          <a href="#faq">FAQ</a>
          <a href="tel:+19025551234">(902) 213-0825</a>
        </div>
        <a href="#book" className="btn btn-ice">Book now <Arrow /></a>
      </div>
    </nav>);

}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <header className="hero-post" id="top">
      <div className="hero-post-body">
        <div className="eyebrow"><span className="dot"></span> Mobile detail · PEI</div>
        <h1 className="display hero-post-title">
          Authentic<br /><em>Car Care</em>
        </h1>
        <p className="hero-post-sub">Mobile car detailing across Prince Edward Island</p>
        <div className="hero-post-cta">
          <a href="#book" className="btn btn-ice btn-lg">Book a detail <Arrow /></a>
          <a href="#services" className="btn btn-lg">See services</a>
        </div>
      </div>
      <div className="hero-car-wrap">
        <img src="assets/hero-car-clean.png" alt="" />
      </div>
    </header>);

}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>);

}

function CarHeroSVG() {
  // Front-view dark coupe — silhouette with subtle paint reflections, two glowing headlights.
  // Modeled after the studio reference: dark body, faint windshield gleam, twin DRL strips.
  return (
    <svg viewBox="0 0 900 460" xmlns="http://www.w3.org/2000/svg" className="hero-car-svg" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="cBody" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#1a2026" />
          <stop offset="0.45" stopColor="#0a0d12" />
          <stop offset="1" stopColor="#020305" />
        </linearGradient>
        <linearGradient id="cWindshield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1015" />
          <stop offset="0.5" stopColor="#161e26" />
          <stop offset="1" stopColor="#070a0e" />
        </linearGradient>
        <linearGradient id="cHoodHL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(185,214,236,0)" />
          <stop offset="0.5" stopColor="rgba(185,214,236,0.55)" />
          <stop offset="1" stopColor="rgba(185,214,236,0)" />
        </linearGradient>
        <radialGradient id="cHead" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.25" stopColor="#e8f3ff" />
          <stop offset="0.6" stopColor="#7fb6e0" stopOpacity="0.6" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
        <filter id="cGlow"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>

      {/* tire dust / ground shadow */}
      <ellipse cx="450" cy="420" rx="380" ry="14" fill="#000" opacity="0.85" />
      <ellipse cx="450" cy="415" rx="320" ry="8" fill="#000" opacity="0.7" />

      {/* main body — wide low coupe */}
      <path
        d="M70 405 Q80 320 180 290 Q260 270 320 250 L350 230 Q450 210 550 230 L580 250 Q640 270 720 290 Q820 320 830 405 L830 410 Q830 415 820 415 L80 415 Q70 415 70 410 Z"
        fill="url(#cBody)" />

      {/* upper cabin — windshield + roof line */}
      <path
        d="M320 250 Q345 220 380 215 L520 215 Q555 220 580 250 Q450 235 320 250 Z"
        fill="url(#cWindshield)" />

      {/* windshield top highlight */}
      <path
        d="M328 244 Q356 226 388 222 L512 222 Q544 226 572 244"
        fill="none" stroke="url(#cHoodHL)" strokeWidth="2.5" strokeLinecap="round" />

      {/* hood crease — soft top reflection */}
      <path
        d="M340 268 Q450 252 560 268"
        fill="none" stroke="rgba(185,214,236,0.32)" strokeWidth="1.4" />
      <path
        d="M210 318 Q450 285 690 318"
        fill="none" stroke="rgba(185,214,236,0.15)" strokeWidth="1.2" />

      {/* DRL light strips — slim crisp lines */}
      <path d="M140 320 L240 320" stroke="#cce5fa" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" filter="url(#cGlow)" />
      <path d="M660 320 L760 320" stroke="#cce5fa" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" filter="url(#cGlow)" />
      <path d="M140 320 L240 320" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
      <path d="M660 320 L760 320" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />

      {/* headlights — twin circular */}
      <ellipse cx="195" cy="350" rx="58" ry="22" fill="url(#cHead)" opacity="0.85" />
      <ellipse cx="705" cy="350" rx="58" ry="22" fill="url(#cHead)" opacity="0.85" />
      <ellipse cx="195" cy="350" rx="26" ry="10" fill="#ffffff" opacity="0.95" />
      <ellipse cx="705" cy="350" rx="26" ry="10" fill="#ffffff" opacity="0.95" />
      <ellipse cx="195" cy="349" rx="8" ry="3" fill="#fff" />
      <ellipse cx="705" cy="349" rx="8" ry="3" fill="#fff" />

      {/* lower bumper grille — very subtle */}
      <path d="M280 390 Q450 395 620 390" fill="none" stroke="#1a2026" strokeWidth="3" strokeLinecap="round" />
      <rect x="395" y="385" width="110" height="3" rx="1.5" fill="#0a0d12" />

      {/* tire silhouettes peeking at corners */}
      <ellipse cx="125" cy="410" rx="48" ry="12" fill="#000" />
      <ellipse cx="775" cy="410" rx="48" ry="12" fill="#000" />

      {/* side body sheen */}
      <path d="M85 380 Q90 340 130 320" fill="none" stroke="rgba(185,214,236,0.15)" strokeWidth="1" />
      <path d="M815 380 Q810 340 770 320" fill="none" stroke="rgba(185,214,236,0.15)" strokeWidth="1" />
    </svg>);

}

/* ---------- Marquee ---------- */
function Marquee() {
  const items = ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Cavendish', 'Borden', 'Montague', 'Souris', 'Kensington', 'Mount Stewart'];
  const phrase =
  <>
      {items.map((it, i) =>
    <span key={i}>{it} <em>✦</em></span>
    )}
    </>;


  return (
    <div className="marquee">
      <div className="marquee-track">{phrase}{phrase}{phrase}</div>
    </div>);

}

/* expose components to other scripts */
Object.assign(window, { App, Nav, Hero, Marquee, SERVICES, ADDONS, GALLERY, fmt, Arrow });