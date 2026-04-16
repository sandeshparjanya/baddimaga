import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Baddimaga - The EMI Syndicate';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#101014' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '8px solid #facc15', borderRadius: '40px', padding: '40px 100px' }}>
             <span style={{ fontSize: 130, fontWeight: 900, color: '#facc15', fontFamily: 'sans-serif' }}>BADDIMAGA</span>
          </div>
          <p style={{ fontSize: 50, color: '#94a3b8', marginTop: 50, fontWeight: 600, fontFamily: 'sans-serif' }}>The Exclusive Financial Syndicate</p>
        </div>
      </div>
    ),
    { ...size }
  );
}
