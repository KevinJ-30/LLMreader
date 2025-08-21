import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles, BookOpen, Wand2, MessageCircle, Send } from 'lucide-react';
import { ActionType, AssistantResponse, Selection } from '@/types';
import './FloatingAssistant.css';

interface FloatingAssistantProps {
  selection: Selection | null;
  onClose: () => void;
  onAction: (actionType: ActionType, customPrompt?: string) => void;
  response: AssistantResponse | null;
  loading: boolean;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  selection,
  onClose,
  onAction,
  response,
  loading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [customPrompt, setCustomPrompt] = useState('');
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Expand when text is selected
  useEffect(() => {
    if (selection) {
      setIsExpanded(true);
    } else {
      // Keep expanded for a moment after selection is cleared
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selection]);

  // Handle dragging - only for bubble, not expanded panel
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!bubbleRef.current || isExpanded) return;
    
    const rect = bubbleRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  }, [isExpanded]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    onClose();
  }, [onClose]);

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

  const isVisible = selection || isExpanded || true; // Always show the bubble

  if (!isVisible) return null;

  // Don't allow dragging when expanded and interacting with inputs
  const shouldAllowDragging = !isExpanded || (!selection && !isExpanded);

  return (
    <div
      ref={bubbleRef}
      className={`floating-assistant ${isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={(e) => {
        // Only expand if not dragging and no text is selected
        if (!isDragging && !selection) {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }
      }}
    >
      {/* Bubble State */}
      <div className="bubble-content" onMouseDown={handleMouseDown}>
        <div className="bubble-icon">
          <MessageCircle size={20} />
        </div>
        
        {selection && (
          <div className="bubble-preview">
            <span>{selection.text.slice(0, 50)}...</span>
          </div>
        )}
      </div>

      {/* Expanded Panel */}
      <div className="expanded-panel">
        <div className="panel-header">
          <div className="panel-title">
            <MessageCircle size={16} />
            <span>AI Assistant</span>
            {selection && (
              <span className="page-badge">Page {selection.pageNumber}</span>
            )}
          </div>
          <button 
            className="close-button" 
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <X size={16} />
          </button>
        </div>

        {selection && (
          <div className="selected-text-preview">
            <div className="preview-label">Selected Text</div>
            <div className="preview-content">
              {selection.text.length > 100 
                ? `${selection.text.slice(0, 100)}...` 
                : selection.text
              }
            </div>
          </div>
        )}

        <div className="quick-actions">
          <button 
            className="action-button"
            onClick={(e) => {
              e.stopPropagation();
              handleAction('explain');
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!selection || loading}
          >
            <BookOpen size={14} />
            <span>Explain</span>
          </button>
          
          <button 
            className="action-button"
            onClick={(e) => {
              e.stopPropagation();
              handleAction('define');
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!selection || loading}
          >
            <Sparkles size={14} />
            <span>Define</span>
          </button>
          
          <button 
            className="action-button"
            onClick={(e) => {
              e.stopPropagation();
              handleAction('simplify');
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!selection || loading}
          >
            <Wand2 size={14} />
            <span>Simplify</span>
          </button>
        </div>

        <div className="custom-input-section">
          <textarea
            className="custom-input"
            placeholder="Ask a custom question about the selection..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!selection || loading}
            rows={3}
          />
          <button
            className="send-button"
            onClick={(e) => {
              e.stopPropagation();
              handleCustomSubmit();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!selection || loading || !customPrompt.trim()}
          >
            <Send size={14} />
          </button>
        </div>

        {loading && (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <span>Thinking...</span>
          </div>
        )}

        {response && !loading && (
          <div className="response-section">
            <div className="response-content">
              {response.response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingAssistant;
