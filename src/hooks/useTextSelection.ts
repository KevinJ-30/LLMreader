import { useState, useCallback, useEffect, useRef } from 'react';
import { Selection } from '@/types';

interface UseTextSelectionOptions {
  debounceMs?: number;
  minSelectionLength?: number;
}

export const useTextSelection = (options: UseTextSelectionOptions = {}) => {
  const { debounceMs = 500, minSelectionLength = 3 } = options;
  const [selection, setSelection] = useState<Selection | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const getSelectionContext = useCallback((element: Element, range: Range): { before: string; after: string } => {
    const textContent = element.textContent || '';
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    
    const beforeStart = Math.max(0, startOffset - 200);
    const afterEnd = Math.min(textContent.length, endOffset + 200);
    
    return {
      before: textContent.slice(beforeStart, startOffset),
      after: textContent.slice(endOffset, afterEnd)
    };
  }, []);

  const getPageNumber = useCallback((element: Element): number => {
    const pageElement = element.closest('[data-page-number]');
    return pageElement ? parseInt(pageElement.getAttribute('data-page-number') || '1', 10) : 1;
  }, []);

  const getSelectionPosition = useCallback((range: Range): { x: number; y: number; width: number; height: number } => {
    const rect = range.getBoundingClientRect();
    const containerRect = document.querySelector('.pdf-container')?.getBoundingClientRect() || { left: 0, top: 0 };
    
    return {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height
    };
  }, []);

  const handleSelection = useCallback(() => {
    const windowSelection = window.getSelection();
    
    if (!windowSelection || windowSelection.rangeCount === 0) {
      setSelection(null);
      return;
    }

    const range = windowSelection.getRangeAt(0);
    const selectedText = range.toString().trim();

    if (selectedText.length < minSelectionLength) {
      setSelection(null);
      return;
    }

    const commonAncestor = range.commonAncestorContainer;
    const element = commonAncestor.nodeType === Node.TEXT_NODE 
      ? commonAncestor.parentElement 
      : commonAncestor as Element;

    if (!element || !element.closest('.pdf-container')) {
      setSelection(null);
      return;
    }

    // Check if the selection is within the side panel (ignore if so)
    if (element.closest('.side-panel')) {
      return;
    }

    const pageNumber = getPageNumber(element);
    const position = getSelectionPosition(range);
    const context = getSelectionContext(element, range);

    setSelection({
      text: selectedText,
      pageNumber,
      position,
      context
    });
  }, [minSelectionLength, getPageNumber, getSelectionPosition, getSelectionContext]);

  const debouncedHandleSelection = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(handleSelection, debounceMs);
  }, [handleSelection, debounceMs]);

  const clearSelection = useCallback(() => {
    setSelection(null);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      // Force a reflow to ensure the selection is cleared
      document.body.focus();
    }
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      debouncedHandleSelection();
    };

    const handleSelectionChange = () => {
      debouncedHandleSelection();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Clear selection on Escape key
      if (event.key === 'Escape') {
        clearSelection();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Clear selection when clicking outside the PDF container
      const target = event.target as Element;
      if (!target.closest('.pdf-container') && !target.closest('.side-panel')) {
        clearSelection();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedHandleSelection, clearSelection]);

  return {
    selection,
    clearSelection
  };
};