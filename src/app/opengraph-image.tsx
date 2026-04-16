import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Baddimaga - The EMI Syndicate';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {

  const outfitSemiBoldSrc = await fetch(
    'https://unpkg.com/@fontsource/outfit@5.0.8/files/outfit-latin-600-normal.woff'
  ).then((res) => res.arrayBuffer());

  const outfitExtraBoldSrc = await fetch(
    'https://unpkg.com/@fontsource/outfit@5.0.8/files/outfit-latin-800-normal.woff'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#101014' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            border: '2px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '40px', 
            padding: '40px 100px',
            backgroundColor: 'rgba(30, 30, 36, 0.7)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
          }}>
             <span style={{ 
               fontSize: 140, 
               fontWeight: 800, 
               fontFamily: 'Outfit',
               backgroundImage: 'linear-gradient(45deg, #facc15, #ec4899)',
               backgroundClip: 'text',
               color: 'transparent',
               letterSpacing: '-2px'
             }}>
               Baddimaga
             </span>
          </div>
          <p style={{ 
            fontSize: 45, 
            color: '#94a3b8', 
            marginTop: 40, 
            fontWeight: 600, 
            fontFamily: 'Outfit',
            letterSpacing: '1px'
          }}>
            The EMI Syndicate
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Outfit',
          data: outfitSemiBoldSrc,
          style: 'normal',
          weight: 600,
        },
        {
          name: 'Outfit',
          data: outfitExtraBoldSrc,
          style: 'normal',
          weight: 800,
        },
      ],
    }
  );
}
