import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getAvatarPosition } from '../../lib/utils';
import React from 'react';

export const runtime = 'edge';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const origin = req.nextUrl.origin;

  const originalAvatar = searchParams.get('avatarPicture');
  const originalBackground = searchParams.get('background');
  const avatarPosition = searchParams.get('avatarPosition') || 'bottomLeft';
  const maxHeight = parseInt(searchParams.get('maxHeight') || '216');

  if (!originalAvatar || !originalBackground) {
    return new Response('Missing required parameters', { status: 400 });
  }

  const fetchBase64 = async (url: string) => {
    const res = await fetch(`${origin}/api/proxy?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error('Image proxy failed');
    return await res.text(); // retorna a string base64 data URI
  };

  try {
    const avatarData = await fetchBase64(originalAvatar);
    const backgroundData = await fetchBase64(originalBackground);

    const avatarSize = Math.floor(maxHeight * 0.35);
    const position = getAvatarPosition(avatarPosition, avatarSize, 1920, maxHeight);

    return new ImageResponse(
      React.createElement(
        'div',
        {
          style: {
            width: '1920px',
            height: `${maxHeight}px`,
            position: 'relative',
            fontFamily: 'sans-serif',
          },
        },
        [
          React.createElement('img', {
            src: backgroundData,
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            },
          }),
          React.createElement(
            'div',
            {
              style: {
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                borderRadius: '50%',
                border: '4px solid black',
                overflow: 'hidden',
              },
            },
            [
              React.createElement('img', {
                src: avatarData,
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                },
              }),
            ]
          ),
          React.createElement(
            'div',
            {
              style: {
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '2px 6px',
                borderRadius: '6px',
                fontSize: '18px',
                fontWeight: 600,
                color: '#000',
              },
            },
            [
              'MDHeaderGenerator by ',
              React.createElement('span', { style: { color: 'black' } }, 'Scrum'),
              React.createElement('span', { style: { color: 'orange' } }, 'Lab'),
            ]
          ),
        ]
      ),
      {
        width: 1920,
        height: maxHeight,
      }
    );
  } catch (err) {
    return new Response(`Failed to generate image: ${(err as Error).message}`, { status: 500 });
  }
}
