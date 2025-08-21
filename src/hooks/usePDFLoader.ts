import { useState, useCallback, useEffect } from 'react';
import { pdfjsLib } from '@/lib/pdfjs-config';
import { PDFViewerState } from '@/types';

export const usePDFLoader = () => {
  const [state, setState] = useState<PDFViewerState>({
    currentPage: 1,
    totalPages: 0,
    scale: 1.5,
    isLoading: false
  });
  const [pdfDocument, setPdfDocument] = useState<any>(null);

  const loadPDF = useCallback(async (fileUrl: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      
      setPdfDocument(pdf);
      setState({
        currentPage: 1,
        totalPages: pdf.numPages,
        scale: 1.5,
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages))
    }));
  }, []);

  const setScale = useCallback((scale: number) => {
    setState(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(scale, 3.0))
    }));
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(state.currentPage - 1);
  }, [state.currentPage, setCurrentPage]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(state.currentPage + 1);
  }, [state.currentPage, setCurrentPage]);

  const zoomIn = useCallback(() => {
    setScale(state.scale + 0.25);
  }, [state.scale, setScale]);

  const zoomOut = useCallback(() => {
    setScale(state.scale - 0.25);
  }, [state.scale, setScale]);

  return {
    state,
    pdfDocument,
    loadPDF,
    setCurrentPage,
    setScale,
    goToPreviousPage,
    goToNextPage,
    zoomIn,
    zoomOut
  };
};