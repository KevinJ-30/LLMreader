import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (validateFile(file)) onFileSelect(file);
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 w-full max-w-md text-center transition-all duration-200 cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input id="file-upload" type="file" accept=".pdf" onChange={handleFileInput} className="hidden" />
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-3 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {dragActive ? (
              <Upload className="w-8 h-8 text-blue-600" />
            ) : (
              <FileText className="w-8 h-8 text-gray-600" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {dragActive ? 'Drop your PDF here' : 'Upload a PDF'}
            </h3>
            <p className="text-sm text-gray-500">Drag and drop a PDF file, or click to browse</p>
            <p className="text-xs text-gray-400">Maximum file size: 50MB</p>
          </div>
        </div>
        {dragActive && <div className="absolute inset-0 bg-blue-50 bg-opacity-50 rounded-lg" />}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <div className="mt-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Paper Reading Assistant</h2>
        <p className="text-gray-600">
          Upload a PDF to get started. Select any text in the document to receive AI-powered explanations, definitions, and insights.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
// Duplicate legacy implementation removed