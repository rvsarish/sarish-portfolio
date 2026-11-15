import { lazy, Suspense, useRef, useState } from 'react';
import SceneLoadBoundary from './SceneLoadBoundary.jsx';
import SceneLoading from './SceneLoading.jsx';
import { useNearViewport, useReducedMotion, useSceneActivity } from '../hooks.js';

const SystemScene = lazy(() => import('./SystemScene.jsx'));

const stages = [
  {
    label: 'Request',
    kicker: '01 / CAPTURE THE SIGNAL',
    title: 'Establish the starting point.',
    description: 'Understand what was initiated, which inputs shaped it, and what outcome was expected before interpreting anything downstream.',
    questions: ['What was requested?', 'What outcome was expected?'],
  },
  {
    label: 'Orchestrate',
    kicker: '02 / FIND THE ROUTE',
    title: 'Follow the decisions.',
    description: 'Trace how routing decisions and service dependencies shape the journey. The goal is to see where the request went and why.',
    questions: ['Which route and dependencies were involved?', 'Which decision changed the path?'],
  },
  {
    label: 'Process',
    kicker: '03 / READ THE RESPONSE',
    title: 'Interpret the response.',
    description: 'Read statuses, responses, transformations, and failure signals in context. A response is evidence—not always a complete explanation.',
    questions: ['What response or status came back?', 'Does the evidence explain the observed symptom?'],
  },
  {
    label: 'Resolve',
    kicker: '04 / CLOSE THE LOOP',
    title: 'Confirm the complete outcome.',
    description: 'Check that the final state is consistent with the expected experience. Then preserve the learning so the next investigation starts with better context.',
    questions: ['Is the final outcome consistent end to end?', 'What should be watched, documented, or improved?'],
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
      <div className="section-index" data-reveal><span>03</span> INSIDE THE REQUEST</div>
      <div className="system-intro" data-reveal>
        <h2 id="system-heading">Follow the <em>signal.</em></h2>
        <p><strong>Payment orchestration</strong> is the coordination of routes, services, decisions, and responses that move a transaction from initiation to outcome. Follow a conceptual request below.</p>
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
            <ul className="stage-questions">{stage.questions.map((question) => <li key={question}>{question}</li>)}</ul>
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
