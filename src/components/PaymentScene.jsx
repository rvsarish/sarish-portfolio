import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import SafeCanvas from './SafeCanvas.jsx';

function OrbitingNode({ position, index, reducedMotion }) {
  const mesh = useRef(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = reducedMotion ? 0 : clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(time * 0.8 + index) * 0.12;
    mesh.current.rotation.x = time * 0.35 + index;
    mesh.current.rotation.y = time * 0.5;
  });

  return (
    <group ref={mesh} position={position}>
      <mesh>
        <octahedronGeometry args={[0.095, 0]} />
        <meshStandardMaterial
          color={index % 2 ? '#b8f5d1' : '#82aaff'}
          emissive={index % 2 ? '#5eeaa0' : '#407cff'}
          emissiveIntensity={1.8}
          roughness={0.25}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.17, 12, 12]} />
        <meshBasicMaterial color={index % 2 ? '#8fffc0' : '#6496ff'} transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

function DataPacket({ curve, offset, color, reducedMotion }) {
  const packet = useRef(null);

  useFrame(({ clock }) => {
    if (!packet.current) return;
    const progress = reducedMotion ? offset : (clock.getElapsedTime() * 0.055 + offset) % 1;
    packet.current.position.copy(curve.getPointAt(progress));
    const pulse = reducedMotion ? 1 : 0.8 + Math.sin(progress * Math.PI) * 0.7;
    packet.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={packet}>
      <sphereGeometry args={[0.038, 10, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function PulseRings({ pulse, reducedMotion }) {
  const rings = useRef([]);
  const progress = useRef(2);

  useEffect(() => {
    progress.current = reducedMotion ? 2 : 0;
  }, [pulse, reducedMotion]);

  useFrame((_, delta) => {
    progress.current += delta * 0.8;
    rings.current.forEach((ring, index) => {
      if (!ring) return;
      const localProgress = (progress.current - index * 0.16) / 0.8;
      const visible = !reducedMotion && localProgress >= 0 && localProgress <= 1;
      ring.visible = visible;
      if (!visible) return;
      ring.scale.setScalar(0.8 + localProgress * 2.25);
      ring.material.opacity = (1 - localProgress) * 0.48;
    });
  });

  return (
    <group rotation={[1.12, 0.15, 0.5]}>
      {[0, 1].map((index) => (
        <mesh key={index} ref={(mesh) => { rings.current[index] = mesh; }} visible={false}>
          <torusGeometry args={[1.45, 0.018, 8, 128]} />
          <meshBasicMaterial color={index ? '#b8f5d1' : '#82aaff'} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function GlowSprite() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(98, 151, 255, 0.72)');
    gradient.addColorStop(0.24, 'rgba(55, 111, 237, 0.28)');
    gradient.addColorStop(1, 'rgba(20, 62, 166, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <sprite scale={[5.8, 5.8, 1]} position={[0, 0, -0.8]}>
      <spriteMaterial map={texture} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

function PaymentCore({ rotation, pulse, reducedMotion }) {
  const assembly = useRef(null);
  const core = useRef(null);
  const innerRing = useRef(null);
  const outerRing = useRef(null);
  const impulse = useRef(0);
  const currentScale = useRef(1);

  const orbitPath = useMemo(
    () => new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-2.55, -0.45, 0),
        new THREE.Vector3(-1.1, 1.75, 0.35),
        new THREE.Vector3(1.25, 1.4, -0.15),
        new THREE.Vector3(2.6, 0.25, 0.15),
        new THREE.Vector3(1.1, -1.65, 0.3),
        new THREE.Vector3(-1.3, -1.55, -0.2),
      ],
      true,
      'catmullrom',
      0.55,
    ),
    [],
  );

  const nodes = useMemo(
    () => Array.from({ length: 6 }, (_, index) => orbitPath.getPointAt(index / 6).toArray()),
    [orbitPath],
  );

  const starPositions = useMemo(() => {
    const points = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i += 1) {
      const angle = i * 2.399963;
      const radius = 3.4 + ((i * 37) % 20) / 12;
      points[i * 3] = Math.cos(angle) * radius;
      points[i * 3 + 1] = (((i * 53) % 100) / 100 - 0.5) * 8;
      points[i * 3 + 2] = Math.sin(angle) * radius - 2;
    }
    return points;
  }, []);

  useEffect(() => {
    impulse.current = reducedMotion ? 0 : 1;
  }, [pulse, reducedMotion]);

  useFrame(({ clock, pointer }, delta) => {
    if (!assembly.current) return;
    const time = clock.getElapsedTime();
    const motion = reducedMotion ? 0 : 1;
    const smoothing = 1 - Math.exp(-Math.min(delta, 0.1) * 5);

    assembly.current.rotation.y = THREE.MathUtils.lerp(
      assembly.current.rotation.y,
      rotation.current.y + (pointer.x * 0.12 + time * 0.045) * motion,
      smoothing,
    );
    assembly.current.rotation.x = THREE.MathUtils.lerp(
      assembly.current.rotation.x,
      reducedMotion ? 0.18 : rotation.current.x - pointer.y * 0.08,
      smoothing,
    );

    if (core.current) {
      core.current.rotation.y = time * 0.14 * motion;
      core.current.rotation.z = time * 0.06 * motion;
    }
    if (innerRing.current) innerRing.current.rotation.z = time * 0.18 * motion;
    if (outerRing.current) outerRing.current.rotation.z = -time * 0.1 * motion;

    impulse.current = Math.max(0, impulse.current - delta * 1.5);
    const bounce = reducedMotion ? 0 : Math.sin((1 - impulse.current) * Math.PI * 3) * impulse.current * 0.16;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, 1 + bounce, smoothing);
    assembly.current.scale.setScalar(currentScale.current);
  });

  return (
    <group ref={assembly} rotation={[0.18, -0.35, -0.12]}>
      <GlowSprite />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#6c8fc9" size={0.018} transparent opacity={0.65} />
      </points>

      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[1.03, 5]} />
          <meshPhysicalMaterial
            color="#245dc9"
            emissive="#092d7b"
            emissiveIntensity={reducedMotion && pulse % 2 ? 1.3 : 0.65}
            roughness={0.18}
            metalness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>
        <mesh scale={1.012}>
          <icosahedronGeometry args={[1.03, 2]} />
          <meshBasicMaterial color="#9dc1ff" wireframe transparent opacity={0.12} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.63, 32, 32]} />
          <meshBasicMaterial color="#367cf1" transparent opacity={0.32} />
        </mesh>
      </group>

      <mesh rotation={[0.4, 0.2, 0]}>
        <icosahedronGeometry args={[1.52, 1]} />
        <meshBasicMaterial color="#5c8ee8" wireframe transparent opacity={0.16} />
      </mesh>

      <group ref={innerRing} rotation={[1.12, 0.15, 0.5]}>
        <mesh>
          <torusGeometry args={[1.87, 0.012, 8, 160]} />
          <meshBasicMaterial color="#82aaff" transparent opacity={0.65} />
        </mesh>
        <mesh position={[1.87, 0, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#d8ffe8" toneMapped={false} />
        </mesh>
      </group>

      <group ref={outerRing} rotation={[0.3, 1.15, 0.2]}>
        <mesh>
          <torusGeometry args={[2.18, 0.008, 8, 160]} />
          <meshBasicMaterial color="#6384b5" transparent opacity={0.38} />
        </mesh>
      </group>
      <PulseRings pulse={pulse} reducedMotion={reducedMotion} />

      <mesh>
        <tubeGeometry args={[orbitPath, 180, 0.008, 6, true]} />
        <meshBasicMaterial color="#4d70a6" transparent opacity={0.4} />
      </mesh>
      <mesh scale={1.003}>
        <tubeGeometry args={[orbitPath, 180, 0.023, 6, true]} />
        <meshBasicMaterial color="#3668c5" transparent opacity={0.035} depthWrite={false} />
      </mesh>

      {nodes.map((position, index) => (
        <OrbitingNode key={index} position={position} index={index} reducedMotion={reducedMotion} />
      ))}
      <DataPacket curve={orbitPath} offset={0.08} color="#d4ffe4" reducedMotion={reducedMotion} />
      <DataPacket curve={orbitPath} offset={0.58} color="#88afff" reducedMotion={reducedMotion} />
      <DataPacket curve={orbitPath} offset={0.565} color="#5476ae" reducedMotion={reducedMotion} />
    </group>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const narrow = size.width / size.height < 0.9;
    camera.position.z = narrow ? 9.2 : 7.2;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

export default function PaymentScene({ rotation, pulse, reducedMotion, active }) {
  return (
    <SafeCanvas
      active={active}
      reducedMotion={reducedMotion}
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      role="img"
      aria-label="Interactive three-dimensional payment network. Drag to rotate or tap to send a pulse."
    >
      <ResponsiveCamera />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 4, 5]} intensity={3.5} color="#c6dcff" />
      <pointLight position={[-4, -2, 3]} intensity={35} color="#275edf" distance={12} />
      <pointLight position={[3, -3, 2]} intensity={18} color="#7ff0b2" distance={10} />
      <PaymentCore rotation={rotation} pulse={pulse} reducedMotion={reducedMotion} />
    </SafeCanvas>
  );
}
