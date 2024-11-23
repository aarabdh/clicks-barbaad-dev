import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { ImageProps } from './types';

interface ImageModalProps {
  selectedImage: ImageProps | null;
  setSelectedImage: (image: ImageProps | null) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ selectedImage, setSelectedImage }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageTransform, setImageTransform] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  // Reset all states when modal opens
  useEffect(() => {
    if (selectedImage) {
      setImageTransform(0);
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
      setIsInitialRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedImage(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSelectedImage]);

  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientY);
    setIsInitialRender(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStart || !isDragging) return;

    const currentTouch = e.touches[0].clientY;
    setTouchEnd(currentTouch);
    
    // Calculate the distance moved
    const distance = touchStart - currentTouch;
    setImageTransform(distance);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(false);

    if (!touchStart || !touchEnd) {
      setImageTransform(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;
    
    if (isUpSwipe || isDownSwipe) {
      setSelectedImage(null);
    } else {
      // Reset position if swipe wasn't long enough
      setImageTransform(0);
    }
  };

  if (!selectedImage) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/90"
      onClick={() => setSelectedImage(null)}
    >
      <div 
        ref={modalRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col md:flex-row md:max-w-[95vw] md:max-h-[95vh] w-full"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={() => setSelectedImage(null)}
          className="absolute right-2 top-2 p-2 rounded-full bg-black/50 hover:bg-black/70 z-10 transition-colors"
        >
          <X className="h-6 w-6 text-white"/>
        </button>

        <div 
          className="flex-1 relative h-[70vh] md:h-[95vh]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transform: `translateY(${-imageTransform}px)`,
            transition: isDragging || isInitialRender ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          <img 
            src={selectedImage.src}
            alt={selectedImage.name}
            className="object-contain select-none w-full h-full touch-none"
            loading="eager"
            sizes="100vw"
            draggable="false"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 md:w-80 md:h-[95vh] md:overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold dark:text-white">
              {selectedImage.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {selectedImage.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;