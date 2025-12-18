import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onClear: () => void;
  preview?: string;
  className?: string;
}

export function ImageUpload({ onImageSelect, onClear, preview, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  };

  if (preview) {
    return (
      <div className={cn("relative rounded-xl overflow-hidden border-2 border-primary/30 bg-muted", className)}>
        <img src={preview} alt="Uploaded plant" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <FileImage className="w-4 h-4" />
            <span>Image uploaded</span>
          </div>
          <Button variant="destructive" size="sm" onClick={onClear}>
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        className
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
          isDragging ? "bg-primary/20" : "bg-muted"
        )}>
          {isDragging ? (
            <Upload className="w-8 h-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        
        <p className="text-foreground font-medium mb-1">
          {isDragging ? 'Drop image here' : 'Upload plant image'}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supports: JPG, PNG, WEBP (Max 10MB)
        </p>
      </div>
    </div>
  );
}
