'use client';

import React, { useState, useCallback } from 'react';
import PDFViewer from '@/components/PDFViewer';
import SidePanel from '@/components/Assistant/SidePanel';
import FileUpload from '@/components/FileUpload';
import { useAssistant } from '@/hooks/useAssistant';
import { Selection, ActionType } from '@/types';

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const { processSelection, response, loading } = useAssistant();

  const handleFileSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
  }, []);

  const handleTextSelected = useCallback((sel: Selection) => {
    setSelection(sel);
  }, []);

  const handleAction = useCallback(
    async (actionType: ActionType, customPrompt?: string) => {
      await processSelection(selection, actionType, customPrompt);
    },
    [selection, processSelection]
  );

  const handleCloseAssistant = useCallback(() => {
    setSelection(null);
    // Clear the text selection to prevent immediate reopening
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }, []);

  const handleSelectionChange = useCallback((updatedSelection: Selection) => {
    setSelection(updatedSelection);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setIsPanelCollapsed(!isPanelCollapsed);
  }, [isPanelCollapsed]);

  return (
    <div className="main-container">
      {!pdfUrl ? (
        <FileUpload onFileSelect={handleFileSelect} />
      ) : (
        <>
          <div 
            className={`pdf-section ${isPanelCollapsed ? 'panel-collapsed' : ''}`}
          >
            <PDFViewer url={pdfUrl} onTextSelected={handleTextSelected} />
          </div>
          <SidePanel
            selection={selection}
            onClose={handleCloseAssistant}
            onAction={handleAction}
            onSelectionChange={handleSelectionChange}
            response={response}
            loading={loading}
            isCollapsed={isPanelCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />
        </>
      )}
    </div>
  );
}