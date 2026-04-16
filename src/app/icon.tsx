import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#101014',
          borderRadius: '110px',
          border: '16px solid #facc15',
        }}
      >
        <div style={{ display: 'flex', fontSize: 280, fontWeight: 900, color: '#facc15', fontFamily: 'sans-serif', marginTop: '10px' }}>B</div>
      </div>
    ),
    { ...size }
  );
}
