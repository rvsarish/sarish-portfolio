export default function SceneLoading({ label = 'Loading interactive 3D scene' }) {
  return (
    <div className="scene-loading" role="status">
      <div className="loading-orbit" aria-hidden="true"><i /><span /></div>
      <small>{label}</small>
    </div>
  );
}
