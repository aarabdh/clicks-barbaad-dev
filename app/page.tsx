"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from "lucide-react";
import Navbar from './components/NavBar';

interface ImageProps {
  name: string;
  src: string;
  description?: string;
}

const HomePage = () => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/images.json')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading images:', error);
        setLoading(false);
      });
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading clicks...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Aarabdh&apos;s Clicks</h1>
      </header>
      <main className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.name}
              className="relative aspect-square cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.name}
                fill
                className="object-cover rounded-lg select-none"
                draggable={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg" />
            </div>
          ))}
        </div>
      </main>

      {/* Enhanced Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black z-[60] md:bg-black/90 md:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative h-full w-full flex flex-col md:flex-row md:items-center md:max-w-[95vw] md:max-h-[95vh] md:mx-auto"
            onClick={e => e.stopPropagation()}
          >

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-2 top-2 p-2 rounded-full bg-black/50 hover:bg-black/70 z-10 transition-colors"
            >
              <X className="h-6 w-6 text-white"/>
            </button>

            <div className="flex-1 relative h-[70vh] md:h-[95vh]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.name}
                fill
                className="object-contain select-none"
                sizes="100vw"
                priority
              />
            </div>

            {/* Image info */}
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
      )}

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Aarabdh</p>
      </footer>
    </div>
  );
};

export default HomePage;