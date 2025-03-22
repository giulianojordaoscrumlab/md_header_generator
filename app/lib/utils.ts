export function getAvatarPosition(
  pos: string,
  avatarSize: number,
  width: number,
  height: number
): { x: number; y: number } {
  const margin = 20;

  const positions: Record<
    string,
    { x: number | 'center' | 'right'; y: number | 'center' | 'bottom' }
  > = {
    topLeft: { x: margin, y: margin },
    topCenter: { x: 'center', y: margin },
    topRight: { x: 'right', y: margin },
    middleLeft: { x: margin, y: 'center' },
    middleCenter: { x: 'center', y: 'center' },
    middleRight: { x: 'right', y: 'center' },
    bottomLeft: { x: margin, y: 'bottom' },
    bottomCenter: { x: 'center', y: 'bottom' },
    bottomRight: { x: 'right', y: 'bottom' },
  };

  const posConf = positions[pos] || positions.bottomLeft;

  let x = 0;
  let y = 0;

  x =
    posConf.x === 'center'
      ? (width - avatarSize) / 2
      : posConf.x === 'right'
      ? width - avatarSize - margin
      : posConf.x;

  y =
    posConf.y === 'center'
      ? (height - avatarSize) / 2
      : posConf.y === 'bottom'
      ? height - avatarSize - margin
      : posConf.y;

  return { x, y };
}

