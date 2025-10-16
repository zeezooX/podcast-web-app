"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Play, Trash2 } from "lucide-react";
import { Episode, formatDate } from "@/lib/mockData";
import Dialog from "./Dialog";

interface EpisodeDetailProps {
  episode: Episode;
  onBack: () => void;
  onPlay: () => void;
  onDelete?: () => void;
}

export default function EpisodeDetail({ 
  episode, 
  onBack,
  onPlay,
  onDelete
}: Readonly<EpisodeDetailProps>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteConfirm = () => {
    console.log("Deleting episode:", episode.id);
    if (onDelete) {
      onDelete();
    }
    setIsDeleteOpen(false);
    onBack();
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6">
          {/* Hero Banner with Navigation Buttons */}
          <div className="relative w-full h-[16rem] sm:h-[18rem] md:h-[20rem] mb-5 md:mb-6 animate-in slide-in-from-top duration-500 hover:scale-[1.02]">
            <Image
              src={episode.thumbnail}
              alt={episode.title}
              fill
              className="object-cover rounded-2xl md:rounded-3xl transition-transform duration-500"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white rounded-2xl md:rounded-3xl pointer-events-none transition-opacity duration-300" />
            
            {/* Back Button - Left */}
            <button
              onClick={onBack}
              className="absolute top-1/2 left-4 sm:left-8 md:left-12 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-purple-500 hover:bg-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl z-10 cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform duration-200" />
            </button>
            
            {/* Play Button - Right */}
            <button
              onClick={onPlay}
              className="absolute top-1/2 right-4 sm:right-8 md:right-12 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl z-10 cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Play episode"
            >
              <Play className="w-6 h-6 md:w-7 md:h-7 text-white fill-white ml-0.5 transition-transform duration-200" />
            </button>
          </div>

          {/* Episode Info */}
          <div className="mb-4 md:mb-5 animate-in slide-in-from-bottom duration-500 delay-150">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-4 md:mb-5">
              <div className="flex items-start justify-between gap-4 mb-2 md:mb-3">
                <h1 className="font-lexend font-bold text-gray-800 text-[1.5rem] md:text-[2rem] leading-[2rem] md:leading-[2.5rem] transition-colors duration-200 flex-1">
                  {episode.title}
                </h1>
                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 group"
                  aria-label="Delete episode"
                >
                  <Trash2 className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-200" />
                </button>
              </div>
              <p className="font-inter text-gray-500 text-[0.9375rem] md:text-[1rem] mb-2 md:mb-3 transition-colors duration-200 line-clamp-2">
                {episode.members}
              </p>
              <div className="flex items-center gap-2 md:gap-3 font-inter text-[0.8125rem] md:text-[0.875rem] text-gray-500 transition-colors duration-200">
                <span>{formatDate(episode.publishedAt)}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{episode.durationFormatted}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div 
                className="font-inter text-gray-600 text-[0.875rem] md:text-[0.9375rem] leading-[1.5rem] md:leading-[1.625rem] whitespace-pre-line"
              >
                {episode.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Podcast"
      >
        <div className="space-y-5">
          <p className="font-inter text-gray-600 text-[0.9375rem] leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-gray-800">&quot;{episode.title}&quot;</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-inter font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-inter font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
