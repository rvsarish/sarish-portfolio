import { lazy, Suspense, useRef, useState } from 'react';
import SceneLoadBoundary from './SceneLoadBoundary.jsx';
import SceneLoading from './SceneLoading.jsx';
import { useNearViewport, useReducedMotion, useSceneActivity } from '../hooks.js';

const SystemScene = lazy(() => import('./SystemScene.jsx'));

const stages = [
  {
    label: 'Request',
    kicker: '01 / BASELINE',
    title: 'Start with the request',
    description: 'I note the inputs and the intended outcome so there is a baseline for everything that follows.',
    signals: ['Inputs', 'Expected outcome'],
  },
  {
    label: 'Orchestrate',
    kicker: '02 / ROUTE',
    title: 'Follow the route',
    description: 'I follow the services and decision points, looking for the place where the response or behavior changed.',
    signals: ['Services', 'Decision points'],
  },
  {
    label: 'Process',
    kicker: '03 / RESPONSE',
    title: 'Read the response',
    description: 'I compare the response with the original request before deciding what it says about the issue.',
    signals: ['Status codes', 'Messages and error fields'],
  },
  {
    label: 'Resolve',
    kicker: '04 / OUTCOME',
    title: 'Confirm the outcome',
    description: 'I check the intended state end to end, then document the findings and the evidence behind them.',
    signals: ['Final state', 'Recorded findings'],
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
      <div className="section-index" data-reveal><span>04</span> TRANSACTION EXPLORER</div>
      <div className="system-intro" data-reveal>
        <h2 id="system-heading">A transaction’s path</h2>
        <p>A simplified transaction lifecycle. Select a stage to see what I pay attention to when following a request.</p>
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
          <p className="system-disclaimer">Conceptual visualization, not a depiction of production infrastructure.</p>
        </div>
      </div>
    </section>
  );
}
