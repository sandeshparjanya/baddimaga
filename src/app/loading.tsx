export default function Loading() {
  return (
    <div className="baddi-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <div style={{ height: '80px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '140px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '140px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '140px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
    </div>
  );
}
