import { memo } from 'react';
import { Wedge } from 'react-konva';
import type { DrawingElement } from '@/types/strategy';

import { CanvasCommonProps } from '@/types/canvas';

interface VisionConeRendererProps {
  element: DrawingElement;
  commonProps: CanvasCommonProps;
  showHover: boolean;
  isHovered: boolean;
}

export const VisionConeRenderer = memo(function VisionConeRenderer({
  element,
  commonProps,
  showHover,
  isHovered
}: VisionConeRendererProps) {
  return (
    <Wedge
      {...commonProps}
      radius={element.radius || 150}
      angle={element.angle || 90}
      fill={element.color || '#FF4655'}
      opacity={(element.opacity ?? 1) * 0.5 * (showHover && isHovered ? 0.8 : 1)}
      rotation={-(element.angle || 90) / 2}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
    />
  );
});
