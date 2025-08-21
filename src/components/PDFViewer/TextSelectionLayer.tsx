import React, { useEffect, useRef, useCallback } from 'react';

interface TextSelectionLayerProps {
  pdfDocument: any;
  pageNumber: number;
  scale: number;
  canvasWidth: number;
  canvasHeight: number;
}

export const TextSelectionLayer: React.FC<TextSelectionLayerProps> = ({
  pdfDocument,
  pageNumber,
  scale,
  canvasWidth,
  canvasHeight,
}) => {
  const textLayerRef = useRef<HTMLDivElement>(null);

  const renderTextLayer = useCallback(async () => {
    if (!pdfDocument || !textLayerRef.current) return;

    try {
      const page = await pdfDocument.getPage(pageNumber);
      // Always use scale 1 for positioning (baseline coordinates)
      const viewport = page.getViewport({ scale: 1 });
      const textContent = await page.getTextContent();

      const textLayerDiv = textLayerRef.current;
      textLayerDiv.innerHTML = '';

      // Set text layer to viewport size (scale 1)
      textLayerDiv.style.width = `${viewport.width}px`;
      textLayerDiv.style.height = `${viewport.height}px`;

      // Calculate transform to match canvas size
      const scaleX = canvasWidth / viewport.width;
      const scaleY = canvasHeight / viewport.height;
      textLayerDiv.style.transform = `scale(${scaleX}, ${scaleY})`;
      textLayerDiv.style.transformOrigin = '0 0';

      // Position text using viewport coordinates (scale 1)
      textContent.items.forEach((textItem: any) => {
        const tx = textItem.transform;
        const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
        const fontWidth = Math.sqrt((tx[0] * tx[0]) + (tx[1] * tx[1]));

        const span = document.createElement('span');
        span.textContent = textItem.str;
        span.style.position = 'absolute';
        span.style.left = `${tx[4]}px`;
        span.style.top = `${viewport.height - tx[5] - fontHeight}px`;
        span.style.fontSize = `${fontHeight}px`;
        span.style.fontFamily = textItem.fontName || 'sans-serif';
        span.style.transformOrigin = '0% 0%';
        span.style.transform = `scaleX(${fontWidth / fontHeight})`;
        span.style.color = 'transparent';
        span.style.cursor = 'text';
        span.style.userSelect = 'text';
        span.style.transition = 'background-color 0.2s ease';

        textLayerDiv.appendChild(span);
      });
    } catch (error) {
      console.error('Error rendering text layer:', error);
    }
  }, [pdfDocument, pageNumber, scale, canvasWidth, canvasHeight]);

  useEffect(() => {
    renderTextLayer();
  }, [renderTextLayer]);

  return (
    <div
      ref={textLayerRef}
      className="pdf-text-layer"
      data-page-number={pageNumber}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
        overflow: 'hidden',
      }}
    />
  );
};