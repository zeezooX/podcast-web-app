"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import Header from "@/components/Header";
import EpisodeCard from "@/components/EpisodeCard";
import EpisodeList from "@/components/EpisodeList";
import PlayerPanel from "@/components/PlayerPanel";
import EpisodeDetail from "@/components/EpisodeDetail";
import Dialog from "@/components/Dialog";
import { mockEpisodes, Episode } from "@/lib/mockData";

export default function Home() {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const latestEpisodes = mockEpisodes.slice(0, 2);
  const allEpisodes = mockEpisodes;

  const handlePlayEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const handleBackToHome = () => {
    setSelectedEpisode(null);
  };

  const handleUploadPodcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Podcast upload submitted");
    setIsUploadOpen(false);
  };

  const currentIndex = currentEpisode 
    ? allEpisodes.findIndex(ep => ep.id === currentEpisode.id)
    : -1;

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < allEpisodes.length - 1) {
      handlePlayEpisode(allEpisodes[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handlePlayEpisode(allEpisodes[currentIndex - 1]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Main Content or Episode Detail */}
      {selectedEpisode ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onLogoClick={handleBackToHome} />
          <EpisodeDetail
            episode={selectedEpisode}
            onBack={handleBackToHome}
            onPlay={() => handlePlayEpisode(selectedEpisode)}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onLogoClick={handleBackToHome} />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6">
          {/* Latest Releases */}
          <section className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <h2 className="font-lexend font-semibold text-gray-800 text-[1.25rem] md:text-[1.5rem]">
                Latest Releases
              </h2>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-inter font-semibold px-4 md:px-6 py-2.5 md:py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <Upload className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[0.875rem] md:text-[1rem]">Upload Podcast</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {latestEpisodes.map((episode) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  onPlay={() => handlePlayEpisode(episode)}
                  onClick={() => handleEpisodeClick(episode)}
                />
              ))}
            </div>
          </section>

          {/* All Episodes */}
          <section>
            <h2 className="font-lexend font-semibold text-gray-800 text-[1.25rem] md:text-[1.5rem] mb-4 md:mb-5">
              All Episodes
            </h2>
            <EpisodeList
              episodes={allEpisodes}
              onPlay={handlePlayEpisode}
              onEpisodeClick={handleEpisodeClick}
            />
          </section>
        </main>
        </div>
      )}

      {/* Player Panel - Bottom on mobile, Right side on desktop */}
      <PlayerPanel
        episode={currentEpisode}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={currentIndex < allEpisodes.length - 1 ? handleNext : undefined}
        onPrevious={currentIndex > 0 ? handlePrevious : undefined}
      />

      {/* Upload Podcast Dialog */}
      <Dialog 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)}
        title="Upload New Podcast"
      >
        <form onSubmit={handleUploadPodcast} className="space-y-5">
          <div>
            <label htmlFor="podcast-title" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Podcast Title
            </label>
            <input
              id="podcast-title"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none"
              placeholder="My Awesome Podcast Episode"
            />
          </div>
          
          <div>
            <label htmlFor="podcast-members" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Members
            </label>
            <input
              id="podcast-members"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none"
              placeholder="John Doe, Jane Smith"
            />
          </div>
          
          <div>
            <label htmlFor="podcast-description" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Description
            </label>
            <textarea
              id="podcast-description"
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none resize-none"
              placeholder="Describe your podcast episode..."
            />
          </div>
          
          <div>
            <label htmlFor="podcast-thumbnail" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Thumbnail Image
            </label>
            <input
              id="podcast-thumbnail"
              type="file"
              accept="image/*"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer"
            />
          </div>
          
          <div>
            <label htmlFor="podcast-audio" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Audio File
            </label>
            <input
              id="podcast-audio"
              type="file"
              accept="audio/*"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-inter font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
          >
            Upload Podcast
          </button>
        </form>
      </Dialog>
    </div>
  );
}
