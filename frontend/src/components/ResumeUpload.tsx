import React, { useRef, useState } from 'react';
import { Upload, AlertTriangle, FileText } from 'lucide-react';

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileSelect, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const maxBytes = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setError('Please upload a PDF or Word document (.docx/.doc).');
      return false;
    }

    if (file.size > maxBytes) {
      setError('File is too large. Maximum size is 10MB.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`flex flex-col items-center justify-center border rounded-xl p-10 cursor-pointer transition-all duration-400 relative ${
          isDragActive
            ? 'border-white bg-white/[0.04]'
            : selectedFile
            ? 'border-neutral-500 bg-white/[0.02]'
            : 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc"
          onChange={handleFileChange}
        />

        {selectedFile ? (
          <div className="text-center">
            <div className="w-10 h-10 bg-white/5 text-white rounded-lg flex items-center justify-center mx-auto mb-4 border border-white/10">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white mb-1">{selectedFile.name}</p>
            <p className="text-[10px] text-neutral-500 font-medium">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-10 h-10 bg-white/5 text-white rounded-lg flex items-center justify-center mx-auto border border-white/10">
              <Upload className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Drag your resume here</p>
              <p className="text-[10px] text-neutral-500 font-medium">Supports PDF or DOCX up to 10MB</p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white uppercase tracking-wider rounded border border-white/10 transition-colors"
            >
              Select File
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
