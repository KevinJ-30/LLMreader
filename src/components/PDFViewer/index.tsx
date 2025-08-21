import React, { useState, useCallback, useEffect } from 'react';
import { PDFCanvas } from './PDFCanvas';
import { TextSelectionLayer } from './TextSelectionLayer';
import { PageControls } from './PageControls';
import { usePDFLoader } from '@/hooks/usePDFLoader';
import { useTextSelection } from '@/hooks/useTextSelection';
import { Selection } from '@/types';
import './PDFViewer.css';

interface PDFViewerProps {
  url: string;
  onTextSelected?: (selection: Selection) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, onTextSelected }) => {
  const {
    state,
    pdfDocument,
    loadPDF,
    goToPreviousPage,
    goToNextPage,
  } = usePDFLoader();

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const { selection } = useTextSelection({ debounceMs: 250, minSelectionLength: 3 });

  const handlePageRender = useCallback(() => {
    const canvas = document.querySelector('.pdf-canvas') as HTMLCanvasElement;
    if (canvas) {
      setCanvasSize({
        width: canvas.width,
        height: canvas.height,
      });
    }
  }, []);

  useEffect(() => {
    if (url) {
      loadPDF(url);
    }
  }, [url, loadPDF]);

  useEffect(() => {
    if (selection && onTextSelected) {
      onTextSelected(selection);
    }
  }, [selection, onTextSelected]);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading PDF...</div>
      </div>
    );
  }

  if (!pdfDocument) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">No PDF loaded</div>
      </div>
    );
  }

  return (
    <div className="pdf-container h-full">
      <PageControls
        state={state}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />
      
      <div className="pdf-page-container" style={{ maxWidth: 'fit-content' }}>
        <PDFCanvas
          pdfDocument={pdfDocument}
          pageNumber={state.currentPage}
          scale={state.scale}
          onPageRender={handlePageRender}
        />
        
        {canvasSize.width > 0 && canvasSize.height > 0 && (
          <TextSelectionLayer
            pdfDocument={pdfDocument}
            pageNumber={state.currentPage}
            scale={state.scale}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;