import { memo } from 'react';
import { Group, Path, Image as KonvaImage } from 'react-konva';
import type { DrawingElement } from '@/types/strategy';
import { LUCIDE_PATHS } from '@/lib/constants/canvasIcons';
import useImage from 'use-image';

import { CanvasCommonProps } from '@/types/canvas';

interface IconRendererProps {
  element: DrawingElement;
  commonProps: CanvasCommonProps;
}

export const IconRenderer = memo(function IconRenderer({
  element,
  commonProps,
}: IconRendererProps) {
  const [spikeImg] = useImage(element.iconType === 'spike' ? '/assets/icons/spike.png' : '');

  if (element.iconType === 'spike') {
    const w = element.width || 40;
    const h = element.height || 40;
    return (
      <KonvaImage
        {...commonProps}
        stroke={undefined}
        strokeWidth={0}
        image={spikeImg}
        width={w}
        height={h}
        offsetX={w / 2}
        offsetY={h / 2}
      />
    );
  }

  const getContrastColor = (hex: string) => {
    const color = hex.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#000000' : '#FFFFFF';
  };

  const iconConfig = LUCIDE_PATHS[element.iconType as keyof typeof LUCIDE_PATHS];
  if (iconConfig) {
    const scale = (element.width || 40) / 24;
    const baseColor = element.color || '#FF4655';
    const detailColor = iconConfig.isSolid ? getContrastColor(baseColor) : baseColor;

    return (
      <Group id={commonProps.id}>
        <Path
          data={iconConfig.outline}
          fill={iconConfig.isSolid ? baseColor : 'transparent'}
          stroke={baseColor}
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          scaleX={scale}
          scaleY={scale}
          offset={{ x: 12, y: 12 }}
        />
        {iconConfig.detail && (
          <Path
            data={iconConfig.detail}
            stroke={detailColor}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
            scaleX={scale}
            scaleY={scale}
            offset={{ x: 12, y: 12 }}
          />
        )}
      </Group>
    );
  }

  return null;
});
