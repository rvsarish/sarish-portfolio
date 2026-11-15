import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import SafeCanvas from './SafeCanvas.jsx';

const nodePositions = [
  [-2.45, 0, 0.65],
  [-0.85, 0, -1.25],
  [1.05, 0, -0.75],
  [2.3, 0, 1.05],
];

function StageNode({ index, position, active, completed, onSelect, reducedMotion }) {
  const group = useRef(null);
  const symbol = useRef(null);
  const color = active ? '#b8f5d1' : completed ? '#82aaff' : '#405b83';

  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const time = reducedMotion ? 0 : clock.getElapsedTime();
    const targetScale = active ? 1.16 : 1;
    const smoothing = 1 - Math.exp(-Math.min(delta, 0.1) * 7);
    const nextScale = THREE.MathUtils.lerp(group.current.scale.x, targetScale, smoothing);
    group.current.scale.setScalar(nextScale);
    group.current.position.y = active && !reducedMotion ? Math.sin(time * 1.7) * 0.07 : 0;
    if (symbol.current) {
      symbol.current.rotation.y = time * (active ? 0.75 : 0.18) + index;
      symbol.current.rotation.x = active ? time * 0.25 : 0.25;
    }
  });

  const select = (event) => {
    event.stopPropagation();
    onSelect(index);
  };

  return (
    <group
      ref={group}
      position={position}
      onClick={select}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => { document.body.style.cursor = ''; }}
    >
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.65, 0.76, 0.16, 6]} />
        <meshStandardMaterial
          color={active ? '#173e65' : '#101c2d'}
          emissive={active ? '#174a6d' : '#07101d'}
          emissiveIntensity={active ? 1.4 : 0.35}
          roughness={0.45}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.57, 6]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.75 : 0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 1.35, 6]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.4 : 0.08} />
      </mesh>
      <group ref={symbol} position={[0, 0.75, 0]}>
        {index === 0 && (
          <mesh>
            <boxGeometry args={[0.45, 0.45, 0.45]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.1 : 0.2} wireframe={!active} />
          </mesh>
        )}
        {index === 1 && (
          <mesh>
            <octahedronGeometry args={[0.38, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.1 : 0.2} wireframe={!active} />
          </mesh>
        )}
        {index === 2 && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusKnotGeometry args={[0.24, 0.065, 64, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.1 : 0.2} wireframe={!active} />
          </mesh>
        )}
        {index === 3 && (
          <mesh>
            <icosahedronGeometry args={[0.36, 1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.1 : 0.2} wireframe={!active} />
          </mesh>
        )}
      </group>
      {active && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.84, 0.85, 64]} />
          <meshBasicMaterial color="#82aaff" transparent opacity={0.42} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

function FlowPackets({ curve, reducedMotion }) {
  const packets = useRef([]);

  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.getElapsedTime();
    packets.current.forEach((packet, index) => {
      if (!packet) return;
      const progress = reducedMotion ? 0.57 - index * 0.012 : (time * 0.09 - index * 0.012 + 1) % 1;
      packet.position.copy(curve.getPointAt(Math.max(0, progress)));
      packet.position.y += 0.19;
      packet.material.opacity = 0.95 - index * 0.23;
    });
  });

  return (
    <>
      {[0, 1, 2].map((index) => (
        <mesh key={index} ref={(mesh) => { packets.current[index] = mesh; }}>
          <sphereGeometry args={[index ? 0.035 : 0.065, 12, 12]} />
          <meshBasicMaterial color={index ? '#638eff' : '#d4ffe4'} transparent toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function RoutingBoard({ activeStage, onSelect, reducedMotion }) {
  const assembly = useRef(null);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(nodePositions.map((point) => new THREE.Vector3(...point)), false, 'catmullrom', 0.3),
    [],
  );
  const grid = useMemo(() => {
    const points = [];
    for (let index = -5; index <= 5; index += 1) {
      points.push(new THREE.Vector3(index * 0.75, -0.08, -4), new THREE.Vector3(index * 0.75, -0.08, 4));
      points.push(new THREE.Vector3(-4, -0.08, index * 0.75), new THREE.Vector3(4, -0.08, index * 0.75));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useEffect(() => () => grid.dispose(), [grid]);

  useFrame(({ pointer }, delta) => {
    if (!assembly.current) return;
    const smoothing = 1 - Math.exp(-Math.min(delta, 0.1) * 3);
    const target = reducedMotion ? 0 : pointer.x * 0.045;
    assembly.current.rotation.y = THREE.MathUtils.lerp(assembly.current.rotation.y, target, smoothing);
  });

  return (
    <group ref={assembly} rotation={[0, -0.15, 0]}>
      <mesh position={[0, -0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6.5]} />
        <meshStandardMaterial color="#09111e" transparent opacity={0.82} roughness={0.8} metalness={0.2} />
      </mesh>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color="#274164" transparent opacity={0.23} />
      </lineSegments>
      <mesh position={[0, 0.06, 0]}>
        <tubeGeometry args={[curve, 150, 0.026, 8, false]} />
        <meshStandardMaterial color="#376fca" emissive="#2456b2" emissiveIntensity={1.4} transparent opacity={0.52} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <tubeGeometry args={[curve, 150, 0.075, 8, false]} />
        <meshBasicMaterial color="#326aca" transparent opacity={0.035} depthWrite={false} />
      </mesh>
      <FlowPackets curve={curve} reducedMotion={reducedMotion} />
      {nodePositions.map((position, index) => (
        <StageNode
          key={index}
          index={index}
          position={position}
          active={activeStage === index}
          completed={index < activeStage}
          onSelect={onSelect}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

function BoardCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const narrow = size.width / size.height < 1;
    camera.position.set(0, narrow ? 7.4 : 5.5, narrow ? 10.5 : 7.2);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

export default function SystemScene({ activeStage, onSelect, reducedMotion, active }) {
  return (
    <SafeCanvas
      active={active}
      reducedMotion={reducedMotion}
      camera={{ position: [0, 5.5, 7.2], fov: 42 }}
      role="img"
      aria-label="Interactive three-dimensional transaction route with four selectable stages"
      label="The interactive system map is unavailable on this device"
    >
      <BoardCamera />
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 6, 4]} intensity={2.4} color="#c7dcff" />
      <pointLight position={[-3, 2, 1]} intensity={22} color="#316ee0" distance={10} />
      <pointLight position={[3, 2, 0]} intensity={16} color="#79edb0" distance={8} />
      <RoutingBoard activeStage={activeStage} onSelect={onSelect} reducedMotion={reducedMotion} />
    </SafeCanvas>
  );
}
