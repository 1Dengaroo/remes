import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Remes - AI-Powered Outbound Sales';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://remes.so/remes-logo.png"
            alt=""
            width={64}
            height={64}
            style={{ borderRadius: 12 }}
          />
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}
          >
            Remes
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: 700,
            textAlign: 'center',
            lineHeight: 1.4
          }}
        >
          AI-powered outbound sales that finds and converts high-intent leads
        </p>

        {/* Accent bar */}
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
          }}
        />

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '8px'
          }}
        >
          {['Signal Detection', 'Contact Discovery', 'AI Outreach'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#6366f1'
                }}
              />
              <span style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.6)' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size }
  );
}
