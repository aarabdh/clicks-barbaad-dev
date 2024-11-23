"use client"

import React, { useState, useEffect } from 'react';
import Navbar from './components/NavBar';
import { ImageProps } from './components/types';
import ImageModal from './components/ImageModal';

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
          {[...images].reverse().map((image) => (
            <div
              key={image.name}
              className="relative aspect-square cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.name}
                className="object-contain select-none w-full h-full" // Forces fill behavior
                loading="eager" // Ensures high-priority loading
                draggable={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg" />
            </div>
          ))}
        </div>
      </main>
      <ImageModal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Aarabdh</p>
      </footer>
    </div>
  );
};

export default HomePage;