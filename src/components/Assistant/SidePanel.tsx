import React, { useState, useCallback } from 'react';
import { X, Sparkles, BookOpen, Wand2, MessageCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { ActionType, AssistantResponse, Selection } from '@/types';
import './SidePanel.css';

interface SidePanelProps {
  selection: Selection | null;
  onClose: () => void;
  onAction: (actionType: ActionType, customPrompt?: string) => void;
  onSelectionChange?: (selection: Selection) => void;
  response: AssistantResponse | null;
  loading: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  selection,
  onClose,
  onAction,
  onSelectionChange,
  response,
  loading,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleAction = useCallback((actionType: ActionType) => {
    onAction(actionType);
  }, [onAction]);

  const handleCustomSubmit = useCallback(() => {
    if (customPrompt.trim()) {
      onAction('custom', customPrompt);
      setCustomPrompt('');
    }
  }, [customPrompt, onAction]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomSubmit();
    }
  }, [handleCustomSubmit]);

  return (
    <div className={`side-panel ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Collapse/Expand Toggle */}
      <button 
        className="collapse-toggle"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Panel Content */}
      <div className="panel-content">
        <div className="panel-header">
          <div className="panel-title">
            <MessageCircle size={18} />
            <span>AI Assistant</span>
          </div>
          {selection && (
            <button className="clear-selection" onClick={onClose}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Selection Display */}
        {selection && (
          <div className="selection-display">
            <div className="selection-header">
              <span className="selection-label">Selected Text</span>
              <div className="selection-controls">
                <span className="page-info">Page {selection.pageNumber}</span>
                <button 
                  className="clear-selection-btn"
                  onClick={onClose}
                  title="Clear selection"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <textarea
              className="selection-textarea"
              value={selection.text}
              onChange={(e) => {
                // Update the selection text if user edits it
                if (onSelectionChange) {
                  if (e.target.value.trim() === '') {
                    // Clear selection if text is empty
                    onClose();
                  } else {
                    onSelectionChange({
                      ...selection,
                      text: e.target.value
                    });
                  }
                }
              }}
              placeholder="Selected text will appear here..."
              rows={4}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button 
              className="action-btn"
              onClick={() => handleAction('explain')}
              disabled={loading}
            >
              <BookOpen size={16} />
              <span>Explain</span>
            </button>
            
            <button 
              className="action-btn"
              onClick={() => handleAction('define')}
              disabled={loading}
            >
              <Sparkles size={16} />
              <span>Define</span>
            </button>
            
            <button 
              className="action-btn"
              onClick={() => handleAction('simplify')}
              disabled={loading}
            >
              <Wand2 size={16} />
              <span>Simplify</span>
            </button>
          </div>
        </div>

        {/* Custom Question */}
        <div className="custom-question-section">
          <h3>Custom Question</h3>
          <div className="input-group">
            <textarea
              className="custom-textarea"
              placeholder={selection ? "Ask a custom question about the selected text..." : "Ask a general question about the document..."}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              rows={4}
            />
            <button
              className="submit-btn"
              onClick={handleCustomSubmit}
              disabled={loading || !customPrompt.trim()}
            >
              <Send size={16} />
              Ask
            </button>
          </div>
        </div>

        {/* Response Section */}
        <div className="response-section">
          <h3>Response</h3>
          {!selection && !response && !loading && (
            <div className="no-selection">
              Select text in the PDF or ask a general question about the document
            </div>
          )}
          
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Thinking...</span>
            </div>
          )}

          {response && !loading && (
            <div className="response-content">
              {response.response}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
