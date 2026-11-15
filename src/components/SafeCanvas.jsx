import { Component, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';

let cachedWebGLSupport;

function detectWebGL() {
  if (cachedWebGLSupport !== undefined) return cachedWebGLSupport;

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    cachedWebGLSupport = Boolean(context);
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cachedWebGLSupport = false;
  }

  return cachedWebGLSupport;
}

function SceneFallback({ label, onRetry }) {
  return (
    <div className="scene-unavailable">
      <div className="fallback-orbital" aria-hidden="true">
        <i className="fallback-ring fallback-ring-a" />
        <i className="fallback-ring fallback-ring-b" />
        <i className="fallback-core" />
        <i className="fallback-node fallback-node-a" />
        <i className="fallback-node fallback-node-b" />
      </div>
      <span role="status">{label}</span>
      {onRetry && <button type="button" onClick={onRetry}>Retry 3D view</button>}
    </div>
  );
}

class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function SafeCanvas({
  active = true,
  reducedMotion = false,
  label = '3D preview unavailable on this device',
  onCreated,
  gl,
  children,
  ...canvasProps
}) {
  const host = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const [contextLost, setContextLost] = useState(false);
  const [ready, setReady] = useState(false);
  const supported = useRef(detectWebGL()).current;

  useEffect(() => {
    const element = host.current;
    if (!element) return undefined;

    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      setReady(width > 0 && height > 0);
    };
    measure();

    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleCreated = (state) => {
    onCreated?.(state);
    state.gl.domElement.addEventListener(
      'webglcontextlost',
      (event) => {
        event.preventDefault();
        setContextLost(true);
      },
      { once: true },
    );
  };

  const retry = () => {
    setContextLost(false);
    cachedWebGLSupport = undefined;
    setAttempt((value) => value + 1);
  };

  let content;
  if (!supported) {
    content = <SceneFallback label={label} />;
  } else if (contextLost) {
    content = <SceneFallback label="The 3D connection was interrupted" onRetry={retry} />;
  } else if (!ready) {
    content = <div className="canvas-initialising" role="status">Preparing 3D view</div>;
  } else {
    content = (
      <SceneBoundary key={attempt} fallback={<SceneFallback label="The 3D connection was interrupted" onRetry={retry} />}>
        <Canvas
          {...canvasProps}
          dpr={[1, 1.6]}
          frameloop={active && !reducedMotion ? 'always' : 'demand'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', ...gl }}
          resize={{ debounce: 100 }}
          onCreated={handleCreated}
        >
          {children}
        </Canvas>
      </SceneBoundary>
    );
  }

  return <div ref={host} className="safe-canvas">{content}</div>;
}
