import React from 'react';
import { ActionType } from '@/types';

interface QuickActionsProps {
  onAction: (actionType: ActionType) => void;
  disabled?: boolean;
}

const actions: Array<{ type: ActionType; label: string; description: string }> = [
  { type: 'explain', label: 'Explain', description: 'Get a detailed explanation' },
  { type: 'define', label: 'Define', description: 'Define key terms' },
  { type: 'simplify', label: 'Simplify', description: 'Simplify the language' },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, disabled = false }) => {
  return (
    <div className="assistant-quick-actions">
      {actions.map((action) => (
        <button
          key={action.type}
          className="action"
          onClick={() => onAction(action.type)}
          disabled={disabled}
          title={action.description}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;