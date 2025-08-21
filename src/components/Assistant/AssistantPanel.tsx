import React, { useMemo, useState } from 'react';
import { X, Sparkles, BookOpen, Wand2 } from 'lucide-react';
import { ActionType, AssistantResponse, Selection } from '@/types';
import './Assistant.css';

interface AssistantPanelProps {
  selection: Selection | null;
  onClose: () => void;
  onAction: (actionType: ActionType, customPrompt?: string) => void;
  response: AssistantResponse | null;
  loading: boolean;
  isOpen?: boolean;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
  selection,
  onClose,
  onAction,
  response,
  loading,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const isOpen = Boolean(selection);
  const previewText = useMemo(() => selection?.text.slice(0, 200) ?? '', [selection]);

  return (
    <div className={`assistant-panel ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="assistant-header">
        <div className="assistant-title">
          Assistant
          {selection && (
            <span className="assistant-meta">Page {selection.pageNumber}</span>
          )}
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      {selection && (
        <div className="assistant-preview">
          <div className="assistant-preview-label">Selected</div>
          <div className="assistant-preview-text">{previewText}</div>
        </div>
      )}

      <div className="assistant-actions">
        <button className="action" onClick={() => onAction('explain')}
          disabled={!selection || loading}>
          <BookOpen size={16} /> Explain
        </button>
        <button className="action" onClick={() => onAction('define')}
          disabled={!selection || loading}>
          <Sparkles size={16} /> Define
        </button>
        <button className="action" onClick={() => onAction('simplify')}
          disabled={!selection || loading}>
          <Wand2 size={16} /> Simplify
        </button>
      </div>

      <div className="assistant-custom">
        <input
          className="assistant-input"
          type="text"
          placeholder="Ask a custom question about the selection"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          disabled={!selection || loading}
        />
        <button
          className="assistant-send"
          onClick={() => onAction('custom', customPrompt)}
          disabled={!selection || loading || !customPrompt.trim()}
        >
          Ask
        </button>
      </div>

      <div className="assistant-response">
        {loading && (
          <div className="assistant-loading">
            <div className="loading-spinner"></div>
            Thinking…
          </div>
        )}
        {!loading && response && (
          <div className="assistant-response-text">
            {response.response}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantPanel;