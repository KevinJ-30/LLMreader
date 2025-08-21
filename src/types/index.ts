export interface Selection {
  text: string;
  pageNumber: number;
  position: { x: number; y: number; width: number; height: number };
  context?: { before: string; after: string };
}

export type ActionType = 'explain' | 'define' | 'simplify' | 'custom';

export interface AssistantRequest {
  selectedText: string;
  context?: { before: string; after: string };
  actionType: ActionType;
  customPrompt?: string;
  pageNumber: number;
}

export interface AssistantResponse {
  response: string;
  actionType: ActionType;
}

export interface PDFViewerState {
  currentPage: number;
  totalPages: number;
  scale: number;
  isLoading: boolean;
}

// Re-exports for convenient deep imports
export type { NextRequest } from 'next/server';