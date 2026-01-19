import { memo } from 'react';
import { Image as KonvaImage } from 'react-konva';
import type { DrawingElement } from '@/types/strategy';
import useImage from 'use-image';

import { CanvasCommonProps } from '@/types/canvas';

interface ImageRendererProps {
  element: DrawingElement;
  commonProps: CanvasCommonProps;
}

export const ImageRenderer = memo(function ImageRenderer({
  element,
  commonProps,
}: ImageRendererProps) {
  const [customImg] = useImage(element.imageUrl || '');
  const w = element.width || 40;
  const h = element.height || 40;

  return (
    <KonvaImage
      {...commonProps}
      width={w}
      height={h}
      offsetX={w / 2}
      offsetY={h / 2}
      image={customImg}
    />
  );
});
