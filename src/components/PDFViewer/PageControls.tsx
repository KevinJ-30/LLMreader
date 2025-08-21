import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PDFViewerState } from '@/types';

interface PageControlsProps {
  state: PDFViewerState;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const PageControls: React.FC<PageControlsProps> = ({
  state,
  onPreviousPage,
  onNextPage,
}) => {
  const { currentPage, totalPages } = state;

  return (
    <div className="pdf-controls">
      <div className="pdf-controls-group">
        <button
          className="pdf-control-button"
          onClick={onPreviousPage}
          disabled={currentPage <= 1}
          title="Previous Page"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        
        <span className="page-info">
          {currentPage} of {totalPages}
        </span>
        
        <button
          className="pdf-control-button"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          title="Next Page"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PageControls;