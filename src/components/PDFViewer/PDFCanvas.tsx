import React, { useEffect, useRef, useCallback } from 'react';

interface PDFCanvasProps {
  pdfDocument: any;
  pageNumber: number;
  scale: number;
  onPageRender?: () => void;
}

export const PDFCanvas: React.FC<PDFCanvasProps> = ({
  pdfDocument,
  pageNumber,
  scale,
  onPageRender,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderPage = useCallback(async () => {
    if (!pdfDocument || !canvasRef.current) return;

    try {
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      onPageRender?.();
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  }, [pdfDocument, pageNumber, scale, onPageRender]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  return (
    <canvas
      ref={canvasRef}
      className="pdf-canvas"
      data-page-number={pageNumber}
      style={{
        userSelect: 'none',
      }}
    />
  );
};