import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { getAvatarPosition } from '../lib/utils';
import * as React from 'react';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const avatarUrl = searchParams.get('avatarPicture');
  const backgroundUrl = searchParams.get('background');
  const avatarPosition = searchParams.get('avatarPosition') || 'bottomLeft';
  const maxHeight = parseInt(searchParams.get('maxHeight') || '216');

  if (!avatarUrl || !backgroundUrl) {
    return new Response('Missing required parameters', { status: 400 });
  }

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
          key: 'bg',
          src: backgroundUrl,
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
            key: 'avatar-container',
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
          React.createElement('img', {
            src: avatarUrl,
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            },
          })
        ),
        React.createElement(
          'div',
          {
            key: 'watermark',
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
              display: 'flex',
              gap: '2px',
            },
          },
          [
            'MDHeaderGenerator by ',
            React.createElement('span', { style: { color: 'black' }, key: 'Scrum' }, 'Scrum'),
            React.createElement('span', { style: { color: 'orange' }, key: 'Lab' }, 'Lab'),
          ]
        ),
      ]
    ),
    {
      width: 1920,
      height: maxHeight,
    }
  );
}
