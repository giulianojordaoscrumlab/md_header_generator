import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getAvatarPosition } from '../../lib/utils';
import React from 'react';

export const runtime = 'edge'; // obrigatório para Vercel Edge

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const origin = req.nextUrl.origin; // origem para montar URLs absolutas

  const originalAvatar = searchParams.get('avatarPicture');
  const originalBackground = searchParams.get('background');
  const avatarPosition = searchParams.get('avatarPosition') || 'bottomLeft';
  const maxHeight = parseInt(searchParams.get('maxHeight') || '216');

  if (!originalAvatar || !originalBackground) {
    return new Response('Missing required parameters', { status: 400 });
  }

  // Usa proxy interno para contornar proteção de hotlinking
  const avatarUrl = `${origin}/api/proxy?url=${encodeURIComponent(originalAvatar)}`;
  const backgroundUrl = `${origin}/api/proxy?url=${encodeURIComponent(originalBackground)}`;

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
        // Background
        React.createElement('img', {
          src: backgroundUrl,
          style: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
          },
        }),

        // Avatar com borda circular
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
              src: avatarUrl,
              style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            }),
          ]
        ),

        // Marca d'água
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
}
