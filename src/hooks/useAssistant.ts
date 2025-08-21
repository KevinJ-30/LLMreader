import { useState, useCallback } from 'react';
import { AssistantRequest, AssistantResponse, ActionType, Selection } from '@/types';

export const useAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processRequest = useCallback(async (request: AssistantRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const data: AssistantResponse = await response.json();
      setResponse(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Assistant request failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const processSelection = useCallback(
    async (selection: Selection | null, actionType: ActionType, customPrompt?: string) => {
      const request: AssistantRequest = {
        selectedText: selection?.text || '',
        context: selection?.context || { before: '', after: '' },
        actionType,
        customPrompt,
        pageNumber: selection?.pageNumber || 1,
      };
      await processRequest(request);
    },
    [processRequest]
  );

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return {
    loading,
    response,
    error,
    processRequest,
    processSelection,
    clearResponse,
  };
};