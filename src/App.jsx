import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SceneLoadBoundary from './components/SceneLoadBoundary.jsx';
import SceneLoading from './components/SceneLoading.jsx';
import MentalMap from './components/MentalMap.jsx';
import SystemExplorer from './components/SystemExplorer.jsx';

const PaymentScene = lazy(() => import('./components/PaymentScene.jsx'));
import { useReducedMotion, useSceneActivity } from './hooks.js';

const experiences = [
  {
    company: 'Juspay',
    role: 'Solution Engineer',
    period: 'JUL 2025 — PRESENT',
    description:
      'Working across payment orchestration, production incident analysis, technical troubleshooting, and payment-system reliability.',
    current: true,
  },
  {
    company: 'Ticket Buddy',
    role: 'Full-stack Developer',
    period: 'OCT 2024 — JAN 2025',
    description:
      'Developed and maintained MERN applications, contributed to backend services and UI improvements, and worked with AWS and GCP.',
  },
  {
    company: 'Tecnonauts Technology Services',
    role: 'Full-stack Developer',
    period: 'JUN — JUL 2024',
    description:
      'Developed responsive React interfaces, integrated backend APIs, and worked with Node.js, PostgreSQL, and Azure deployments.',
  },
];

const skillGroups = [
  {
    title: 'Application engineering',
    icon: 'code',
    groups: [
      ['Frontend', 'JavaScript · HTML · CSS · React · Angular · Ionic · Styled Components'],
      ['Backend', 'Node.js · Express.js · REST APIs · JWT'],
      ['Databases', 'MongoDB · PostgreSQL · MySQL'],
      ['Cloud & tools', 'AWS · Azure · GCP · Vercel · Git · GitHub · Postman'],
    ],
  },
  {
    title: 'Systems engineering',
    icon: 'network',
    groups: [
      ['Domain', 'Payment orchestration · Payment infrastructure · Fintech systems'],
      ['Practice', 'Production incident analysis · Troubleshooting · Reliability practices'],
      ['Foundations', 'Data structures · Algorithms · Problem-solving'],
    ],
  },
];

function Icon({ name, size = 20, className = '' }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    diagonal: <><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,
    route: <><circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h5a4 4 0 0 1 4 4v4a4 4 0 0 0 4 4"/><path d="m12 14 4 4-4 4"/></>,
    pulse: <><path d="M3 12h4l2-7 4 14 2-7h6"/></>,
    shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    code: <><path d="m8 9-3 3 3 3"/><path d="m16 9 3 3-3 3"/><path d="m14 5-4 14"/></>,
    network: <><rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    github: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7.4A5.8 5.8 0 0 0 19.3 3 5.4 5.4 0 0 0 19.1 0S17.9-.4 15 1.5a13.4 13.4 0 0 0-7 0C5.1-.4 3.9 0 3.9 0a5.4 5.4 0 0 0-.2 3A5.8 5.8 0 0 0 2.2 7.1c0 5.8 3.5 7 6.8 7.4A4.8 4.8 0 0 0 8 18v4M8 19c-3 .9-3-1.5-4.2-2" transform="translate(1 1) scale(.88)"/>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2a5 5 0 0 1 2-2Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    cursor: <><path d="m4 3 7.5 17 2.1-7.4L21 10.5 4 3Z"/><path d="m13.6 12.6 5 5"/></>,
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function ExternalLink({ href, children, className = '', icon = 'diagonal' }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <Icon name={icon} size={18} />
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}

function TiltCard({ children, className = '' }) {
  const card = useRef(null);
  const frame = useRef(0);
  const pendingPoint = useRef(null);
  const canTilt = useRef(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => { canTilt.current = !motion.matches && hover.matches; };
    update();
    motion.addEventListener('change', update);
    hover.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      hover.removeEventListener('change', update);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  const handleMove = (event) => {
    if (!canTilt.current || event.pointerType === 'touch') return;
    pendingPoint.current = { x: event.clientX, y: event.clientY };
    if (frame.current) return;

    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      const element = card.current;
      const point = pendingPoint.current;
      if (!element || !point || !canTilt.current) return;
      const bounds = element.getBoundingClientRect();
      const x = (point.x - bounds.left) / Math.max(bounds.width, 1);
      const y = (point.y - bounds.top) / Math.max(bounds.height, 1);
      element.style.setProperty('--rotate-x', `${(0.5 - y) * 5}deg`);
      element.style.setProperty('--rotate-y', `${(x - 0.5) * 5}deg`);
      element.style.setProperty('--glow-x', `${x * 100}%`);
      element.style.setProperty('--glow-y', `${y * 100}%`);
    });
  };

  const reset = () => {
    if (frame.current) window.cancelAnimationFrame(frame.current);
    frame.current = 0;
    pendingPoint.current = null;
    card.current?.style.setProperty('--rotate-x', '0deg');
    card.current?.style.setProperty('--rotate-y', '0deg');
  };

  return (
    <div
      ref={card}
      className={`tilt-card ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);
  const navigation = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      setScrolled(window.scrollY > 24);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    if (main) main.inert = open;
    if (footer) footer.inert = open;

    if (!open) return () => document.body.classList.remove('menu-open');

    const focusFrame = window.requestAnimationFrame(() => navigation.current?.querySelector('a')?.focus());
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus({ preventScroll: true });
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [menuButton.current, ...navigation.current.querySelectorAll('a[href]')].filter(Boolean);
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', onKeyDown);
      if (main) main.inert = false;
      if (footer) footer.inert = false;
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="Sarish R V, home" onClick={() => setOpen(false)}>
        <span className="brand-mark">S<span>/</span>V</span>
        <span className="brand-name">Sarish R V<small>Solution Engineer</small></span>
      </a>
      <button
        ref={menuButton}
        className={`menu-toggle ${open ? 'is-open' : ''}`}
        type="button"
        aria-label="Toggle navigation"
        aria-controls="main-navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span /><span />
      </button>
      <nav ref={navigation} id="main-navigation" className={open ? 'is-open' : ''} aria-label="Main navigation">
        <a href="#experience" onClick={() => setOpen(false)}>Experience</a>
        <a href="#work" onClick={() => setOpen(false)}>Project</a>
        <a href="#approach" onClick={() => setOpen(false)}>Approach</a>
        <a href="#system" onClick={() => setOpen(false)}>System</a>
        <a href="#stack" onClick={() => setOpen(false)}>Stack</a>
        <ExternalLink href="https://www.linkedin.com/in/sarishrv/" className="nav-connect">
          Let’s connect
        </ExternalLink>
      </nav>
    </header>
  );
}

function Hero() {
  const rotation = useRef({ x: 0.18, y: -0.35 });
  const drag = useRef(null);
  const sceneShell = useRef(null);
  const [pulse, setPulse] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const reducedMotion = useReducedMotion();
  const active = useSceneActivity(sceneShell);

  const pointerDown = (event) => {
    if (event.button !== 0 || !event.isPrimary || event.target.closest('button, a')) return;
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rotationX: rotation.current.x,
      rotationY: rotation.current.y,
      distance: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setInteracting(true);
  };

  const pointerMove = (event) => {
    if (reducedMotion || !drag.current || drag.current.id !== event.pointerId) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.distance = Math.max(drag.current.distance, Math.hypot(dx, dy));
    rotation.current.y = drag.current.rotationY + dx * 0.006;
    rotation.current.x = Math.max(-0.8, Math.min(0.8, drag.current.rotationX + dy * 0.004));
  };

  const endInteraction = (event, allowPulse) => {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    if (allowPulse && drag.current.distance < 9) setPulse((value) => value + 1);
    drag.current = null;
    setInteracting(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const pointerUp = (event) => endInteraction(event, true);
  const pointerCancel = (event) => endInteraction(event, false);

  const sceneKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
      event.preventDefault();
      setPulse((value) => value + 1);
      return;
    }
    if (reducedMotion || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') rotation.current.y -= 0.14;
    if (event.key === 'ArrowRight') rotation.current.y += 0.14;
    if (event.key === 'ArrowUp') rotation.current.x = Math.max(-0.8, rotation.current.x - 0.1);
    if (event.key === 'ArrowDown') rotation.current.x = Math.min(0.8, rotation.current.x + 0.1);
  };

  return (
    <section className="hero" id="top">
      <div className="hero-ambient ambient-one" />
      <div className="hero-ambient ambient-two" />
      <div className="hero-copy" data-reveal>
        <div className="eyebrow"><span className="status-dot" /> PAYMENT ENGINEERING · BENGALURU</div>
        <h1>I investigate<br /><em>payment issues.</em></h1>
        <p className="hero-description">
          I’m <strong>Sarish R V</strong>, a Solution Engineer at Juspay in Bengaluru. Most of my work starts with a transaction, a set of logs, and a problem that needs a clear explanation.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#experience">
            See my experience <Icon name="arrow" size={18} />
          </a>
          <ExternalLink className="text-link" href="https://github.com/rvsarish" icon="github">
            GitHub
          </ExternalLink>
        </div>
      </div>

      <div
        ref={sceneShell}
        className={`scene-shell is-visible ${interacting ? 'is-interacting' : ''}`}
        tabIndex={0}
        role="group"
        aria-label="Interactive payment network. Use arrow keys to rotate and Enter to pulse."
        onKeyDown={sceneKeyDown}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerCancel}
        onLostPointerCapture={pointerCancel}
        data-reveal
      >
        <div className="scene-grid" aria-hidden="true" />
        <div className="scene-label scene-label-top"><span>CONCEPTUAL SYSTEM MODEL</span><span>SRV—01</span></div>
        <SceneLoadBoundary>
          <Suspense fallback={<SceneLoading label="Loading payment network" />}>
            <PaymentScene rotation={rotation} pulse={pulse} reducedMotion={reducedMotion} active={active} />
          </Suspense>
        </SceneLoadBoundary>
        <div className="scene-node-label label-request"><span /> REQUEST</div>
        <div className="scene-node-label label-outcome">OUTCOME <span /></div>
        <button
          type="button"
          className="scene-control"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setPulse((value) => value + 1)}
          aria-label={reducedMotion ? 'Shift the 3D network color' : 'Pulse the 3D payment network'}
        >
          <Icon name="cursor" size={15} /> {reducedMotion ? 'STATIC MODE · TAP FOR COLOR' : 'DRAG · TAP TO PULSE'}
        </button>
        <span className="sr-only" aria-live="polite">{pulse ? `Network response ${pulse} activated.` : ''}</span>
        <div className="scene-status"><span className="status-dot" /> INTERACTIVE · NOT LIVE DATA</div>
      </div>

      <div className="hero-bottom" data-reveal>
        <span>APPLICATION DEVELOPMENT</span><i />
        <span>PAYMENT ORCHESTRATION</span><i />
        <span>PRODUCTION TROUBLESHOOTING</span>
        <a href="#story" aria-label="Scroll to my story">SCROLL TO DISCOVER <span>↓</span></a>
      </div>
    </section>
  );
}

function FeaturedProject() {
  return (
    <section className="work section" id="work">
      <TiltCard className="work-card">
        <div data-reveal>
          <div className="work-grid-art" aria-hidden="true">
            <div className="work-orbit orbit-a" /><div className="work-orbit orbit-b" />
            <span className="work-core">S/V</span>
          </div>
          <div className="work-copy">
            <div className="section-index"><span>03</span> FEATURED PROJECT / OPEN SOURCE</div>
            <h2>The code behind<br /><em>this site.</em></h2>
            <p>I designed and built this portfolio with React and Three.js. It includes interactive 3D models, keyboard controls, reduced-motion support, and static fallbacks when WebGL is unavailable. The public repository contains the complete implementation and deployment workflow.</p>
            <ExternalLink href="https://github.com/rvsarish/sarish-portfolio" className="button button-light" icon="github">
              View source code
            </ExternalLink>
          </div>
          <div className="work-meta"><span>REACT · THREE.JS · CSS</span><span>GITHUB ACTIONS + GITHUB PAGES</span></div>
        </div>
      </TiltCard>
    </section>
  );
}

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || !('IntersectionObserver' in window)
    ) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="noise" aria-hidden="true" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />

        <section className="story section" id="story">
          <div className="section-index" data-reveal><span>01</span> BACKGROUND</div>
          <div className="story-content" data-reveal>
            <p className="story-lead">
              I built apps before I started working on the <em>systems behind payments.</em>
            </p>
            <div className="story-detail">
              <p>
                I’ve worked with React interfaces, Node.js services, databases, APIs, and cloud deployments. That hands-on background helps when an issue crosses layers: I can follow how an application is built while I examine how it behaves.
              </p>
              <p>
                At Juspay, I work on payment orchestration, production issue analysis, technical troubleshooting, and reliability. I enjoy the part where a vague symptom starts to become a concrete explanation.
              </p>
              <div className="location-line"><Icon name="map" size={17} /> BASED IN BENGALURU, INDIA</div>
            </div>
          </div>
        </section>

        <section className="experience section" id="experience">
          <div className="section-heading experience-heading" data-reveal>
            <div className="section-index"><span>02</span> WORK EXPERIENCE</div>
            <h2>Work experience</h2>
          </div>
          <div className="timeline">
            {experiences.map((item, index) => (
              <article className="timeline-item" key={item.company} data-reveal>
                <div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div>
                <div className="timeline-period">{item.period}</div>
                <div className="timeline-content">
                  <div className="timeline-title">
                    <h3>{item.company}{item.current && <span className="current-badge">CURRENT</span>}</h3>
                    <p>{item.role}</p>
                  </div>
                  <p className="timeline-description">{item.description}</p>
                </div>
              </article>
            ))}
            <details className="earlier" data-reveal>
              <summary><span><b>+</b> Earlier roles</span><small>2023 — 2024</small><Icon name="chevron" size={20} /></summary>
              <div className="earlier-content">
                <article><span>FEB — MAR 2024</span><div><h4>Shocals Enterprises</h4><p>Angular and Ionic applications, JWT authentication, and PostgreSQL.</p></div></article>
                <article><span>DEC 2023 — JAN 2024</span><div><h4>NinjaBytes</h4><p>Portfolio websites and REST APIs using React and Node.js.</p></div></article>
                <article><span>JUN — JUL 2023</span><div><h4>TechnoHacks EduTech</h4><p>Educational web applications, frontend development, and backend integrations.</p></div></article>
              </div>
            </details>
          </div>
        </section>

        <FeaturedProject />
        <MentalMap />
        <SystemExplorer />

        <section className="stack section" id="stack">
          <div className="section-index" data-reveal><span>06</span> TECHNOLOGIES & CERTIFICATIONS</div>
          <div className="stack-intro" data-reveal>
            <h2>Technologies I’ve worked with</h2>
            <p>The application, systems, and problem-solving tools I’ve used across work and projects.</p>
          </div>
          <div className="stack-grid">
            {skillGroups.map((group, index) => (
              <TiltCard className="stack-card" key={group.title}>
                <div data-reveal style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="stack-card-heading">
                    <span><Icon name={group.icon} size={23} /></span>
                    <h3>{group.title}</h3>
                    <small>0{index + 1}</small>
                  </div>
                  <div className="skill-list">
                    {group.groups.map(([label, skills]) => (
                      <div className="skill-row" key={label}>
                        <span>{label}</span><p>{skills}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
          <div className="certification-strip" data-reveal>
            <span>CERTIFICATIONS</span>
            <div><i>GH</i> GitHub Foundations</div>
            <div><i>AZ</i> Microsoft Azure Fundamentals</div>
            <div><i>IBM</i> Full Stack Software Developer</div>
          </div>
        </section>

        <section className="proof section">
          <div className="proof-grid">
            <div className="proof-number" data-reveal>
              <span className="section-index"><span>07</span> LEARNING & EDUCATION</span>
              <div><strong>650<sup>+</sup></strong><span>LEETCODE<br />PROBLEMS SOLVED</span></div>
              <p>Regular problem-solving practice outside my day-to-day work.</p>
            </div>
            <div className="education-card" data-reveal>
              <span className="mono-label">THE FOUNDATION</span>
              <div className="education-monogram">IT<span>’25</span></div>
              <h3>B.Tech, Information Technology</h3>
              <p>St. Joseph’s College of Engineering</p>
              <span className="education-period">2021 — 2025</span>
            </div>
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-kicker" data-reveal><span className="status-dot" /> LINKEDIN IS THE BEST PLACE TO REACH ME</div>
          <h2 data-reveal>Want to get in touch?</h2>
          <div className="contact-actions" data-reveal>
            <ExternalLink href="https://www.linkedin.com/in/sarishrv/" className="button button-primary">
              Connect on LinkedIn
            </ExternalLink>
            <ExternalLink href="https://github.com/rvsarish" className="text-link" icon="github">
              See my code on GitHub
            </ExternalLink>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="Sarish R V, back to top"><span className="brand-mark">S<span>/</span>V</span></a>
        <p>SARISH R V · BENGALURU</p>
        <div><a href="https://www.linkedin.com/in/sarishrv/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={19} /></a><a href="https://github.com/rvsarish" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github" size={19} /></a><a href="#top" className="back-top">BACK TO TOP ↑</a></div>
      </footer>
    </>
  );
}

export default App;
