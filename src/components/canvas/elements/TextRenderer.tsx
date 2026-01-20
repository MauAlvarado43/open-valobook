import { memo } from 'react';
import { Group, Rect, Text as KonvaText } from 'react-konva';
import { useTranslation } from '@/hooks/useTranslation';
import type { DrawingElement } from '@/types/strategy';

import { CanvasCommonProps } from '@/types/canvas';

interface TextRendererProps {
  element: DrawingElement;
  commonProps: CanvasCommonProps;
}

export const TextRenderer = memo(function TextRenderer({
  element,
  commonProps,
}: TextRendererProps) {
  const { t } = useTranslation();
  const fallbackText = t('editor', 'text');
  const textWidth = (element.text || fallbackText).length * (element.fontSize || 16) * 0.6;
  const textHeight = (element.fontSize || 16) * 1.2;

  return (
    <Group>
      <Rect
        x={-textWidth / 2}
        y={-textHeight / 2}
        width={textWidth}
        height={textHeight}
        fill="#000000"
        opacity={0.6}
        cornerRadius={4}
        perfectDrawEnabled={false}
      />
      <KonvaText
        {...commonProps}
        text={element.text || fallbackText}
        fontSize={element.fontSize || 16}
        fill={element.color || '#FFFFFF'}
        stroke={undefined}
        strokeWidth={0}
        padding={4}
        align="center"
        verticalAlign="middle"
        offsetX={textWidth / 2}
        offsetY={textHeight / 2}
        perfectDrawEnabled={true}
      />
    </Group>
  );
});
