import { lazy, Suspense, useRef, useState } from 'react';
import SceneLoadBoundary from './SceneLoadBoundary.jsx';
import SceneLoading from './SceneLoading.jsx';
import { useNearViewport, useReducedMotion, useSceneActivity } from '../hooks.js';

const SystemScene = lazy(() => import('./SystemScene.jsx'));

const stages = [
  {
    label: 'Initiate',
    kicker: '01 / REQUEST',
    title: 'Create the payment request',
    description: 'A customer action starts a payment request with the details needed to process it.',
    signals: ['Request details', 'Expected outcome'],
  },
  {
    label: 'Orchestrate',
    kicker: '02 / ROUTE',
    title: 'Choose a route',
    description: 'Configuration and routing decisions send the request through an appropriate payment path.',
    signals: ['Routing decisions', 'Service dependencies'],
  },
  {
    label: 'Process',
    kicker: '03 / PROCESSING',
    title: 'Process downstream',
    description: 'The downstream provider handles the request and returns a response. That response may represent an accepted or pending payment—not necessarily the final state.',
    signals: ['Provider response', 'Pending is possible'],
  },
  {
    label: 'Status',
    kicker: '04 / STATUS',
    title: 'Track the payment status',
    description: 'The initial result can be followed by asynchronous notifications or status checks. The integration needs to account for both immediate and later updates.',
    signals: ['Immediate result', 'Later status updates'],
  },
];

function SignalTrace() {
  return (
    <div className="signal-trace" aria-hidden="true">
      <div><span>SIGNAL TRACE</span><span>REQUEST / CONCEPTUAL</span></div>
      <svg viewBox="0 0 640 62" preserveAspectRatio="none">
        <defs>
          <linearGradient id="traceGradient" x1="0" x2="1">
            <stop offset="0" stopColor="#365788" stopOpacity="0" />
            <stop offset=".25" stopColor="#82aaff" />
            <stop offset=".75" stopColor="#82aaff" />
            <stop offset="1" stopColor="#b8f5d1" />
          </linearGradient>
          <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#82aaff" stopOpacity=".14" />
            <stop offset="1" stopColor="#82aaff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="signal-area" d="M0 50H75L89 47 100 49 117 48 128 14 139 52 158 48 186 47 199 44 214 46 231 34 244 47 276 46 287 48 305 45 318 8 332 51 350 48 377 47 395 42 410 46 439 44 455 23 469 47 488 45 509 46 528 37 540 44 565 43 580 41 600 43 620 38 640 40V62H0Z" fill="url(#fillGradient)" />
        <path className="signal-line" d="M0 50H75L89 47 100 49 117 48 128 14 139 52 158 48 186 47 199 44 214 46 231 34 244 47 276 46 287 48 305 45 318 8 332 51 350 48 377 47 395 42 410 46 439 44 455 23 469 47 488 45 509 46 528 37 540 44 565 43 580 41 600 43 620 38 640 40" fill="none" stroke="url(#traceGradient)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export default function SystemExplorer() {
  const [activeStage, setActiveStage] = useState(0);
  const sceneContainer = useRef(null);
  const reducedMotion = useReducedMotion();
  const active = useSceneActivity(sceneContainer);
  const shouldLoadScene = useNearViewport(sceneContainer);
  const stage = stages[activeStage];

  return (
    <section className="system section" id="system" aria-labelledby="system-heading">
      <div className="section-index" data-reveal><span>05</span> PAYMENT LIFECYCLE</div>
      <div className="system-intro" data-reveal>
        <h2 id="system-heading">A transaction’s path</h2>
        <p>A generic path from initiation through payment status. Select a stage to see what each part of the path means.</p>
      </div>
      <div className="system-layout">
        <div className="system-visual" ref={sceneContainer} data-reveal>
          <div className="system-hud"><span>INTERACTIVE SYSTEM MAP</span><span>MODEL / 04 NODES</span></div>
          <SceneLoadBoundary>
            <Suspense fallback={<SceneLoading label="Loading system map" />}>
              {shouldLoadScene ? (
                <SystemScene activeStage={activeStage} onSelect={setActiveStage} reducedMotion={reducedMotion} active={active} />
              ) : (
                <SceneLoading label="System map ready on approach" />
              )}
            </Suspense>
          </SceneLoadBoundary>
          <div className="system-visual-note"><i /> SELECT A NODE TO EXPLORE</div>
          <SignalTrace />
        </div>
        <div className="system-controls" data-reveal>
          <div className="system-stage-copy" key={activeStage} aria-live="polite">
            <span className="mono-label">{stage.kicker}</span>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
            <div className="stage-signals" aria-label="Key signals">{stage.signals.map((signal) => <span key={signal}>{signal}</span>)}</div>
          </div>
          <div className="system-stage-list" aria-label="Transaction stages">
            {stages.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={activeStage === index ? 'is-active' : ''}
                aria-pressed={activeStage === index}
                onClick={() => setActiveStage(index)}
              >
                <span>0{index + 1}</span>
                <b>{item.label}</b>
                <i>{activeStage === index ? '●' : '○'}</i>
              </button>
            ))}
          </div>
          <p className="system-disclaimer">Illustrative model. Routes and status handling vary by integration.</p>
        </div>
      </div>
    </section>
  );
}
