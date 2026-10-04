import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 rounded-xl border border-slate-200/80 ${className}`}
      >
        <ImageIcon className="w-8 h-8 mb-1 stroke-1 opacity-70" />
        <span className="text-xs font-medium text-slate-500 text-center line-clamp-1">
          {alt || 'Hình ảnh VietinBank'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      {...props}
    />
  );
};
