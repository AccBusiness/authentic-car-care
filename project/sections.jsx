/* ========== Authentic Car Care — services, menu, booking ========== */
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM, useCallback: useCB } = React;

/* ---------- Services ---------- */
function Services({ selected, onSelect, addons, setAddons, waxAllowed, total, service, addonTotal }) {
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-title">
          <div>
            <div className="section-kicker">/ 01 — Services</div>
            <h2 className="display">Pick the level of <em>care</em>.<br />We do the driving.</h2>
          </div>
          <div className="sub">Tap a service to set up your quote. Add-ons can be combined below. All prices in CAD.</div>
        </div>

        <div className="services-grid">
          {SERVICES.map((s, i) =>
          <ServiceCard key={s.id} svc={s} selected={selected === s.id} onSelect={() => onSelect(s.id)} idx={i} />
          )}
        </div>

        <AddOns addons={addons} setAddons={setAddons} waxAllowed={waxAllowed} />

        <QuoteBar service={service} addons={addons} addonTotal={addonTotal} total={total} />
      </div>
    </section>);

}

function ServiceCard({ svc, selected, onSelect, idx }) {
  return (
    <div
      className={`svc-card-wrap ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}>
      
      <div className="svc-card-inner">
        <div className="svc-face svc-front">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="svc-num">{svc.num} / 04</div>
            {svc.badge && <div className="eyebrow" style={{ padding: '4px 10px', fontSize: '10px', marginRight: '38px' }}>{svc.badge}</div>}
          </div>
          <div className="svc-icon"><ServiceIcon id={svc.id} /></div>
          <h3>{svc.name}</h3>
          <div className="tag">{svc.tag}</div>
          <div className="price-block">
            {svc.fromLabel && <div className="from">Starting from</div>}
            <div className="price">{fmt(svc.price)}</div>
          </div>
          <div className="svc-hint">Hover to see what's included →</div>
          <div className="check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5 9-11" />
            </svg>
          </div>
        </div>
        <div className="svc-face svc-back">
          <div className="svc-num">{svc.num} — Included</div>
          <h3 style={{ marginTop: 14 }}>{svc.name}</h3>
          <ul>
            {svc.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <button className={`btn ${selected ? 'btn-ice' : ''}`} style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
            {selected ? '✓ Selected' : 'Choose this'} {!selected && <Arrow />}
          </button>
        </div>
      </div>
    </div>);

}

function ServiceIcon({ id }) {
  const stroke = "#2678b0";
  const props = { fill: "none", stroke, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  if (id === 'express') return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...props}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
    </svg>);

  if (id === 'interior') return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...props}>
      <path d="M4 18v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
      <path d="M6 18v3M18 18v3" />
      <path d="M8 12V8a4 4 0 018 0v4" />
    </svg>);

  if (id === 'exterior') return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...props}>
      <path d="M3 17h18l-2-7H5l-2 7z" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M5 10l2-4h10l2 4" />
    </svg>);

  if (id === 'complete') return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...props}>
      <path d="M12 2l2.4 5 5.6.8-4 4 1 5.6L12 14.8 6.9 17.4 8 11.8 4 7.8l5.6-.8z" />
    </svg>);

  return null;
}

/* ---------- Add-ons ---------- */
function AddOns({ addons, setAddons, waxAllowed }) {
  return (
    <div className="addons-card">
      <div className="addons-header">
        <div>
          <h3>Add-ons</h3>
          <p>Toggle extras for your selected service. Available add-ons depend on the package.</p>
        </div>
      </div>
      <div className="addons-row">
        {ADDONS.map((a) => {
          const disabled = a.id === 'wax' && !waxAllowed;
          const on = !!addons[a.id] && !disabled;
          return (
            <button
              key={a.id}
              className={`addon-chip ${on ? 'on' : ''}`}
              disabled={disabled}
              onClick={() => setAddons((prev) => ({ ...prev, [a.id]: !prev[a.id] }))}>
              
              <span className="plus">+{a.price}</span>
              <span>{a.name}</span>
              <span className="note">{disabled ? 'not available with this service' : a.note}</span>
            </button>);

        })}
      </div>
    </div>);

}

/* ---------- Quote bar ---------- */
function QuoteBar({ service, addons, addonTotal, total }) {
  const activeAddons = ADDONS.filter((a) => addons[a.id]);
  return (
    <div className="quote-bar">
      <div className="left">
        <div className="label">Your quote so far</div>
        <div className="total">
          <em>{fmt(total)}</em>
          <span style={{ fontSize: 14, color: 'var(--fg-mute)', marginLeft: 8 }}> CAD</span>
        </div>
        <div className="breakdown">
          {service?.name} {service?.fromLabel ? '(from)' : ''} · {fmt(service?.price || 0)}
          {activeAddons.length > 0 &&
          <> + {activeAddons.map((a) => `${a.name} (${fmt(a.price)})`).join(' + ')}</>
          }
        </div>
      </div>
      <a href="#book" className="btn btn-ice btn-lg">Continue to booking <Arrow /></a>
    </div>);

}

/* ---------- Gallery / Before–After ---------- */
function Gallery() {
  const [active, setActive] = useS(0);
  const [filter, setFilter] = useS('All');
  const filtered = useM(() => filter === 'All' ? GALLERY : GALLERY.filter((g) => g.category === filter), [filter]);
  useE(() => {if (active >= filtered.length) setActive(0);}, [filter]);
  const item = filtered[active] || GALLERY[0];

  return (
    <section id="menu" style={{ paddingTop: 60 }}>
      <div className="wrap">
        <div className="section-title">
          <div>
            <div className="section-kicker">/ 02 — Before / After</div>
            <h2 className="display">Drag to see the <em>difference</em>.</h2>
          </div>
          <div className="sub">Real cars, real driveways. Drag the handle on each photo to scrub between before and after.</div>
        </div>

        <div className="menu-tabs">
          {['All', 'Express Wash', 'Interior Care', 'Exterior Care', 'Complete Care'].map((t) =>
          <button key={t} className={`menu-tab ${filter === t ? 'on' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          )}
        </div>

        <div className="ba-wrap">
          <BeforeAfter item={item} key={item.id} />
          <div className="ba-meta">
            <div className="tag-pill">{item.category}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <div className="detail-list">
              {item.details.map(([k, v], i) =>
              <div key={i}><span>{k}</span><span>{v}</span></div>
              )}
            </div>
            <div className="ba-thumbs">
              {filtered.map((g, i) =>
              <button
                key={g.id}
                className={`ba-thumb ${i === active ? 'on' : ''}`}
                onClick={() => setActive(i)}
                aria-label={g.title}>
                
                  <div className="fake-photo fp-after">
                    <FakeCar tone={g.id} />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function BeforeAfter({ item }) {
  const [pos, setPos] = useS(50);
  const stageRef = useR(null);
  const dragging = useR(false);

  const setFromClient = (clientX) => {
    const el = stageRef.current;if (!el) return;
    const r = el.getBoundingClientRect();
    const v = (clientX - r.left) / r.width * 100;
    setPos(Math.max(0, Math.min(100, v)));
  };

  useE(() => {
    const onMove = (e) => {if (dragging.current) setFromClient(e.touches ? e.touches[0].clientX : e.clientX);};
    const onUp = () => {dragging.current = false;};
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div
      className="ba-stage"
      ref={stageRef}
      onMouseDown={(e) => {dragging.current = true;setFromClient(e.clientX);}}
      onTouchStart={(e) => {dragging.current = true;setFromClient(e.touches[0].clientX);}}>
      
      <div className="ba-img ba-img-before">
        <div className="fake-photo fp-before">
          <div className="grain" />
          <div className="fake-car"><FakeCar tone={item.id} dirty /></div>
        </div>
      </div>
      <div className="ba-img ba-img-after">
        <div className="ba-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="fake-photo fp-after">
            <div className="shine" />
            <div className="grain" />
            <div className="fake-car"><FakeCar tone={item.id} /></div>
          </div>
        </div>
      </div>
      <div className="ba-label before">Before</div>
      <div className="ba-label after">After</div>
      <div className="ba-handle" style={{ left: `${pos}%` }} />
      <div className="ba-knob" style={{ left: `${pos}%` }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6l-4 6 4 6M16 6l4 6-4 6" />
        </svg>
      </div>
    </div>);

}

function FakeCar({ tone, dirty }) {
  // simple, large stylized car silhouette to fill the photo placeholder
  const bodyTop = dirty ? '#3a322a' : '#1c2632';
  const bodyBot = dirty ? '#1a1410' : '#05080b';
  return (
    <svg viewBox="0 0 360 160" width="100%" height="100%">
      <defs>
        <linearGradient id={`b-${tone}-${dirty ? 'd' : 'c'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bodyTop} />
          <stop offset="1" stopColor={bodyBot} />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="142" rx="150" ry="8" fill="#000" opacity="0.5" />
      <path d="M20 110 Q35 80 80 70 L130 55 Q180 42 230 47 L300 70 Q340 80 350 105 L350 130 Q350 138 342 138 L28 138 Q20 138 20 130 Z"
      fill={`url(#b-${tone}-${dirty ? 'd' : 'c'})`} />
      <path d="M105 70 Q132 35 195 32 Q260 35 280 65 Z" fill={dirty ? '#2a241d' : '#0a0e12'} />
      <path d="M120 70 Q145 45 190 41 L190 70 Z" fill={dirty ? '#5a4c3a' : '#2678b0'} opacity={dirty ? '0.6' : '0.5'} />
      <path d="M198 41 Q250 45 275 65 L198 70 Z" fill={dirty ? '#5a4c3a' : '#2678b0'} opacity={dirty ? '0.6' : '0.5'} />
      <circle cx="90" cy="138" r="22" fill="#040608" />
      <circle cx="270" cy="138" r="22" fill="#040608" />
      <circle cx="90" cy="138" r="17" fill={dirty ? '#171210' : '#0a0c0f'} stroke="#2678b0" strokeOpacity={dirty ? '0.15' : '0.4'} strokeWidth="1" />
      <circle cx="270" cy="138" r="17" fill={dirty ? '#171210' : '#0a0c0f'} stroke="#2678b0" strokeOpacity={dirty ? '0.15' : '0.4'} strokeWidth="1" />
      {!dirty &&
      <>
          <path d="M20 110 Q35 80 80 70 L130 55 Q180 42 230 47 L300 70" fill="none" stroke="#2678b0" strokeOpacity="0.5" strokeWidth="0.8" />
        </>
      }
      {dirty &&
      <>
          <ellipse cx="80" cy="100" rx="30" ry="8" fill="#6a523a" opacity="0.5" />
          <ellipse cx="200" cy="120" rx="40" ry="6" fill="#5a4530" opacity="0.4" />
          <ellipse cx="280" cy="110" rx="20" ry="6" fill="#6a523a" opacity="0.45" />
        </>
      }
    </svg>);

}

/* ---------- Booking ---------- */
function Booking({ service, addons, total, onChangeService, onToggleAddon, waxAllowed }) {
  const [step, setStep] = useS(1);
  const [form, setForm] = useS({ name: '', email: '', phone: '', address: '', vehicle: '', date: '', time: '', notes: '' });
  const [photos, setPhotos] = useS([]); // [{id, url}]
  const [dragging, setDragging] = useS(false);
  const [submitted, setSubmitted] = useS(false);
  const inputRef = useR(null);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onFiles = (files) => {
    const arr = Array.from(files).slice(0, 6);
    const next = arr.map((f) => ({ id: Math.random().toString(36).slice(2, 9), url: URL.createObjectURL(f) }));
    setPhotos((p) => [...p, ...next].slice(0, 6));
  };

  const removePhoto = (id) => setPhotos((p) => p.filter((x) => x.id !== id));

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
    // reset
    setStep(1);
    setForm({ name: '', email: '', phone: '', address: '', vehicle: '', date: '', time: '', notes: '' });
    setPhotos([]);
  };

  const canAdvance =
  step === 1 ||
  step === 2 && form.vehicle.trim().length > 1 ||
  step === 3 && form.name && form.email && form.phone && form.address;

  return (
    <section id="book">
      <div className="wrap">
        <div className="section-title">
          <div>
            <div className="section-kicker">/ 03 — Book</div>
            <h2 className="display">Three steps. <em>Real quote.</em><br />Then we show up.</h2>
          </div>
          <div className="sub">Upload a couple of phone photos of your vehicle so we can confirm pricing before we arrive. No deposit required.</div>
        </div>

        <div className="book-wrap">
          <div className="book-card">
            <div className="book-step-label">
              <span>Step {step} of 3</span>
              <span>{step === 1 ? 'Service & add-ons' : step === 2 ? 'Vehicle photos' : 'When & where'}</span>
            </div>
            <div className="book-steps">
              {[1, 2, 3].map((n) =>
              <div key={n} className={`book-step ${n < step ? 'done' : n === step ? 'active' : ''}`} />
              )}
            </div>

            {step === 1 &&
            <Step1 service={service} addons={addons} onChangeService={onChangeService} onToggleAddon={onToggleAddon} waxAllowed={waxAllowed} />
            }

            {step === 2 &&
            <Step2
              inputRef={inputRef}
              photos={photos}
              onFiles={onFiles}
              removePhoto={removePhoto}
              dragging={dragging}
              setDragging={setDragging}
              form={form}
              update={update} />

            }

            {step === 3 &&
            <Step3 form={form} update={update} service={service} />
            }

            <div className="book-actions">
              <button className="btn" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} style={{ opacity: step === 1 ? 0.4 : 1 }}>
                ← Back
              </button>
              {step < 3 ?
              <button className="btn btn-ice" disabled={!canAdvance} onClick={() => setStep((s) => s + 1)} style={{ opacity: canAdvance ? 1 : 0.4 }}>
                  Next step <Arrow />
                </button> :

              <button className="btn btn-ice" disabled={!canAdvance} onClick={submit} style={{ opacity: canAdvance ? 1 : 0.4 }}>
                  Send booking request <Arrow />
                </button>
              }
            </div>
          </div>

          <BookSummary service={service} addons={addons} total={total} form={form} photos={photos} />
        </div>
      </div>
      {submitted && <div className="toast">✓ Booking sent — we'll text you within an hour.</div>}
    </section>);

}

function Step1({ service, addons, onChangeService, onToggleAddon, waxAllowed }) {
  return (
    <div>
      <div className="field">
        <label>Service package</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {SERVICES.map((s) =>
          <button
            key={s.id}
            className="btn"
            onClick={() => onChangeService(s.id)}
            style={{
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: service.id === s.id ? 'var(--ice)' : 'rgba(0,0,0,0.03)',
              color: service.id === s.id ? '#061018' : 'var(--fg)',
              border: service.id === s.id ? '1px solid var(--ice)' : '1px solid var(--line-strong)'
            }}>
            
              <span style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontWeight: 700 }}>{s.name}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{s.tag}</span>
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{s.fromLabel ? 'from ' : ''}{fmt(s.price)}</span>
            </button>
          )}
        </div>
      </div>
      <div className="field">
        <label>Add-ons</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {ADDONS.map((a) => {
            const disabled = a.id === 'wax' && !waxAllowed;
            const on = !!addons[a.id] && !disabled;
            return (
              <button
                key={a.id}
                className={`addon-chip ${on ? 'on' : ''}`}
                disabled={disabled}
                onClick={() => onToggleAddon(a.id)}>
                
                <span className="plus">+{a.price}</span>
                <span>{a.name}</span>
              </button>);

          })}
        </div>
      </div>
    </div>);

}

function Step2({ inputRef, photos, onFiles, removePhoto, dragging, setDragging, form, update }) {
  return (
    <div>
      <div className="field">
        <label>Vehicle (year, make, model)</label>
        <input value={form.vehicle} onChange={(e) => update('vehicle', e.target.value)} placeholder="2019 Subaru Outback, blue" />
      </div>
      <div className="field">
        <label>Photos for quote (up to 6)</label>
        <div
          className={`dropzone ${dragging ? 'dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {e.preventDefault();setDragging(true);}}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {e.preventDefault();setDragging(false);onFiles(e.dataTransfer.files);}}>
          
          <div className="icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2678b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <path d="M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>
          <h4>Drop photos here, or tap to browse</h4>
          <p>Phone shots are great — exterior, wheels, interior, problem areas.</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => onFiles(e.target.files)} />
          
        </div>
        {photos.length > 0 &&
        <div className="photo-grid">
            {photos.map((p, i) =>
          <div className="photo-thumb" key={p.id} style={{ transform: `rotate(${(i % 2 ? 1 : -1) * (Math.random() * 2)}deg)` }}>
                <img src={p.url} alt="" />
                <button className="x" onClick={() => removePhoto(p.id)}>×</button>
              </div>
          )}
          </div>
        }
      </div>
      <div className="field">
        <label>Anything we should know? (optional)</label>
        <textarea
          rows="3"
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Spilled coffee on the back seat last week, pet hair in the trunk, etc." />
        
      </div>
    </div>);

}

function Step3({ form, update, service }) {
  // Only weekends — we're mobile on Saturdays & Sundays. Generate next ~8 weekend days.
  const days = useM(() => {
    const out = [];
    const now = new Date();
    let i = 1;
    while (out.length < 8) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dow = d.getDay(); // 0 = Sun, 6 = Sat
      if (dow === 0 || dow === 6) out.push(d.toISOString().slice(0, 10));
      i++;
    }
    return out;
  }, []);

  // Time options adapt to how long the chosen service takes.
  const mode = service?.slotMode || 'window';
  const timeOptions = useM(() => {
    if (mode === 'window') {
      // Quick job — pick an exact 2-hour window.
      return [
        '8:00 — 10:00 am',
        '10:00 am — 12:00 pm',
        '12:00 — 2:00 pm',
        '2:00 — 4:00 pm',
        '4:00 — 6:00 pm'];
    }
    if (mode === 'arrival') {
      // Multi-hour job — pick when we arrive, we keep the car a few hours.
      return [
        'Morning — we arrive 8:00 am',
        'Midday — we arrive 11:30 am',
        'Afternoon — we arrive 1:30 pm'];
    }
    // Half-day job — one block, morning or afternoon.
    return [
      'Morning block — 8:00 am start',
      'Afternoon block — 12:30 pm start'];
  }, [mode]);

  // If the chosen service changes the valid options, drop a stale time.
  useE(() => {
    if (form.time && !timeOptions.includes(form.time)) update('time', '');
  }, [timeOptions]);

  const timeHint =
    mode === 'window' ? 'Express Wash is quick (~45 min) — pick any 2-hour window.' :
    mode === 'arrival' ? `${service?.name} takes ${service?.durationLabel} — choose when we arrive and we'll have your car for the afternoon.` :
    `${service?.name} is a half-day job (${service?.durationLabel}) — we take one booking per block.`;

  return (
    <div>
      <div className="row-2">
        <div className="field">
          <label>Full name</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="First & last" />
        </div>
        <div className="field">
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(902) 555-0123" />
        </div>
      </div>
      <div className="field">
        <label>Email</label>
        <input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="field">
        <label>Service address (PEI)</label>
        <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="123 Water St, Charlottetown" />
      </div>
      <div className="row-2">
        <div className="field">
          <label>Preferred date <span style={{ color: 'var(--fg-mute)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>· weekends only</span></label>
          <select value={form.date} onChange={(e) => update('date', e.target.value)}>
            <option value="">Pick a weekend day</option>
            {days.map((d) => <option key={d} value={d}>{new Date(d + 'T12:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Preferred {mode === 'window' ? 'window' : 'arrival'}</label>
          <select value={form.time} onChange={(e) => update('time', e.target.value)}>
            <option value="">{mode === 'window' ? 'Pick a window' : 'Pick when we arrive'}</option>
            {timeOptions.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--fg-mute)', margin: '-4px 0 0', lineHeight: 1.5 }}>{timeHint}</p>
    </div>);

}

function BookSummary({ service, addons, total, form, photos }) {
  const activeAddons = ADDONS.filter((a) => addons[a.id]);
  return (
    <aside className="book-summary">
      <h3>Your booking</h3>
      <div className="sub">Quote locks in once we confirm photos.</div>
      <div className="sum-row"><span className="lbl">Service</span><span className="val">{service?.name || '—'}</span></div>
      <div className="sum-row"><span className="lbl">Base price</span><span className="val">{fmt(service?.price || 0)}</span></div>
      {activeAddons.length === 0 ?
      <div className="sum-empty">No add-ons selected</div> :
      activeAddons.map((a) =>
      <div className="sum-row" key={a.id}><span className="lbl">+ {a.name}</span><span className="val">{fmt(a.price)}</span></div>
      )
      }
      {form.vehicle && <div className="sum-row"><span className="lbl">Vehicle</span><span className="val" style={{ maxWidth: 160, textAlign: 'right', fontSize: 13 }}>{form.vehicle}</span></div>}
      {photos.length > 0 && <div className="sum-row"><span className="lbl">Photos</span><span className="val">{photos.length} attached</span></div>}
      {form.date && <div className="sum-row"><span className="lbl">When</span><span className="val" style={{ fontSize: 13 }}>{new Date(form.date + 'T12:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}{form.time && ` · ${form.time}`}</span></div>}
      <div className="sum-row total"><span className="lbl">Estimated total</span><span className="val">{fmt(total)}</span></div>
      <p style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 18, lineHeight: 1.5 }}>
        Prices in CAD. Final quote may adjust based on vehicle condition.
      </p>
    </aside>);

}

/* ---------- FAQ ---------- */
const FAQ_ITEMS = [
{
  q: 'Do you actually come to me?',
  a: "Yes — that's the whole point. We're fully mobile across PEI. As long as we can park within a hose-length of your vehicle (driveway, parking lot, condo lot with permission), we set up our own equipment."
},
{
  q: 'Do you need water and power?',
  a: "Yes — we need access to an outdoor water tap and a regular power outlet within roughly 50 feet of where the vehicle is parked. We bring our own hoses, extension cords, pressure washer and vacuum. If your spot doesn't have access, just let us know and we'll suggest the closest option."
},
{
  q: 'How long does each service take?',
  a: 'Express Wash is about 45 minutes. Interior or Exterior Care runs 3–4 hours. Complete Care is a full half-day, usually 5–6 hours depending on the vehicle and condition.'
},
{
  q: 'Why is the price "starting from"?',
  a: 'Pricing varies with vehicle size and condition. A clean compact takes less time and product than a muddy SUV. We confirm the exact price after you send a few photos in the booking form — no surprises on the day.'
},
{
  q: 'Do I need to be home?',
  a: "Not at all. Many clients book us while they're at work. Leave the keys somewhere we agreed on, we send before-and-after photos when we're done, and you pay by e-transfer or card."
},
{
  q: 'What about pet hair and bad smells?',
  a: 'Pet hair is +$30 on any interior service — we use specialized rubber tools and brushes. For odours, our steam extraction and ozone treatment handle most things, including smoke and food spills.'
},
{
  q: 'When can I add hand wax?',
  a: 'Hand wax (+$50) is available with Express Wash or Exterior Care. It\'s already included in Complete Care, and it doesn\'t apply to Interior Care alone.'
},
{
  q: 'What if it rains?',
  a: "We're in PEI — we know the weather. If it rains, we'll reach out the morning of to reschedule for the next available dry slot. No charge to move bookings."
},
{
  q: 'How do I pay?',
  a: 'Right now we only accept cash or e-transfer — no credit or debit cards yet. Payment is due on the day of service. No deposit required to book.'
}];


function FAQ() {
  const [open, setOpen] = useS(0);
  return (
    <section id="faq">
      <div className="wrap">
        <div className="section-title">
          <div>
            <div className="section-kicker">/ 04 — FAQ</div>
            <h2 className="display">The <em>questions</em> we hear most.</h2>
          </div>
          <div className="sub">Don't see your question? Text us at (902) 555-1234 — we usually reply within an hour.</div>
        </div>
        <div className="faq-list">
          {FAQ_ITEMS.map((f, i) =>
          <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="faq-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq-text">{f.q}</span>
                <span className="faq-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="brand" style={{ marginBottom: 18 }}>
              <div className="brand-mark"><img src="assets/logo.png" alt="" /></div>
              <div className="brand-name">
                <b>Authentic Car Care</b>
                <span>Mobile detail · PEI</span>
              </div>
            </div>
            <p style={{ maxWidth: 320, fontSize: 14, color: 'var(--fg-dim)' }}>

            </p>
          </div>
          <div>
            <h5>Services</h5>
            <a href="#services">Express Wash</a>
            <a href="#services">Interior Care</a>
            <a href="#services">Exterior Care</a>
            <a href="#services">Complete Care</a>
          </div>
          <div>
            <h5>Contact</h5>
            <a href="tel:+19025551234">(902) 213-0825</a>
            <a href="mailto:hi@authenticcarcare.ca">getauthenticcare@gmail.com</a>
            <p>Weekends</p>
          </div>
          <div>
            <h5>Service area</h5>
            <p>All over PEI</p>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 Authentic Car Care. Built with with hard work and honesty..</span>
          <span>v1.0 · Mobile detail</span>
        </div>
      </div>
    </footer>);

}

Object.assign(window, { Services, ServiceCard, ServiceIcon, AddOns, QuoteBar, Gallery, BeforeAfter, FakeCar, Booking, Step1, Step2, Step3, BookSummary, FAQ, FAQ_ITEMS, Footer });