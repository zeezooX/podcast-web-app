"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload } from "lucide-react";
import Header from "@/components/Header";
import EpisodeCard from "@/components/EpisodeCard";
import EpisodeList from "@/components/EpisodeList";
import PlayerPanel from "@/components/PlayerPanel";
import EpisodeDetail from "@/components/EpisodeDetail";
import Dialog from "@/components/Dialog";
import { Episode } from "@/types/episode";
import { podcastApi } from "@/lib/api";
import { podcastsToEpisodes } from "@/lib/mappers";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { token } = useAuth();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedEpisodeDetail, setSelectedEpisodeDetail] = useState<Episode | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [isShuffleMode, setIsShuffleMode] = useState(false);

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await podcastApi.getAllPodcasts();
      const episodesData = podcastsToEpisodes(response.data);
      setEpisodes(episodesData);
    } catch (err) {
      console.error('Failed to load podcasts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load podcasts');
    } finally {
      setLoading(false);
    }
  };

  const loadPodcastDetail = useCallback(async (id: string) => {
    try {
      setLoadingDetail(true);
      const response = await podcastApi.getPodcastById(id);
      const episodeDetail = podcastsToEpisodes([response.data])[0];
      setSelectedEpisodeDetail(episodeDetail);
    } catch (err) {
      console.error('Failed to load podcast detail:', err);
      // Fall back to the basic episode data
      setSelectedEpisodeDetail(selectedEpisode);
    } finally {
      setLoadingDetail(false);
    }
  }, [selectedEpisode]);

  // Fetch detailed podcast when an episode is selected
  useEffect(() => {
    if (selectedEpisode) {
      loadPodcastDetail(selectedEpisode.id);
    }
  }, [selectedEpisode, loadPodcastDetail]);

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes;

  const handlePlayEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
    setSelectedEpisodeDetail(null); // Reset detail
  };

  const handleBackToHome = () => {
    setSelectedEpisode(null);
    setSelectedEpisodeDetail(null);
  };

  const handleDeleteEpisode = async () => {
    if (!selectedEpisodeDetail || !token) return;

    try {
      await podcastApi.deletePodcast(selectedEpisodeDetail.id, token);
      // Reload podcasts after successful deletion
      await loadPodcasts();
      // Go back to home
      handleBackToHome();
    } catch (err) {
      console.error('Failed to delete podcast:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete podcast');
    }
  };

  const handleUploadPodcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError(null);
    
    if (!token) {
      setUploadError('You must be logged in to upload a podcast');
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const audio = formData.get('audio') as File;
    const image = formData.get('image') as File | null;

    if (!title || !author || !description || !audio) {
      setUploadError('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      await podcastApi.createPodcast(
        {
          title,
          author,
          description,
          category: category || undefined,
          audio,
          image: image || undefined,
        },
        token
      );
      
      setIsUploadOpen(false);
      formElement.reset();
      // Reload podcasts to show the newly uploaded one
      await loadPodcasts();
    } catch (err) {
      console.error('Failed to upload podcast:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to upload podcast');
    } finally {
      setUploading(false);
    }
  };

  const currentIndex = currentEpisode 
    ? allEpisodes.findIndex(ep => ep.id === currentEpisode.id)
    : -1;

  const handleNext = () => {
    if (isShuffleMode) {
      // Shuffle: pick a random episode that's not the current one
      const availableEpisodes = allEpisodes.filter(ep => ep.id !== currentEpisode?.id);
      if (availableEpisodes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEpisodes.length);
        handlePlayEpisode(availableEpisodes[randomIndex]);
      }
    } else if (currentIndex >= 0 && currentIndex < allEpisodes.length - 1) {
      handlePlayEpisode(allEpisodes[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (isShuffleMode) {
      // Shuffle: pick a random episode that's not the current one
      const availableEpisodes = allEpisodes.filter(ep => ep.id !== currentEpisode?.id);
      if (availableEpisodes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEpisodes.length);
        handlePlayEpisode(availableEpisodes[randomIndex]);
      }
    } else if (currentIndex > 0) {
      handlePlayEpisode(allEpisodes[currentIndex - 1]);
    }
  };

  const toggleRepeatMode = () => {
    setIsRepeatMode(!isRepeatMode);
  };

  const toggleShuffleMode = () => {
    setIsShuffleMode(!isShuffleMode);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Main Content or Episode Detail */}
      {selectedEpisode ? (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <Header onLogoClick={handleBackToHome} />
          {(() => {
            if (loadingDetail) {
              return (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-gray-500 font-inter">Loading podcast details...</div>
                </div>
              );
            }
            
            if (selectedEpisodeDetail) {
              return (
                <EpisodeDetail
                  episode={selectedEpisodeDetail}
                  onBack={handleBackToHome}
                  onPlay={() => handlePlayEpisode(selectedEpisodeDetail)}
                  onDelete={handleDeleteEpisode}
                />
              );
            }
            
            return (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-red-500 font-inter">Failed to load podcast details</div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <Header onLogoClick={handleBackToHome} />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-500 font-inter">Loading podcasts...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-20">
              <div className="text-red-500 font-inter">
                <p className="mb-4">{error}</p>
                <button
                  onClick={loadPodcasts}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Content - Only show when not loading and no error */}
          {!loading && !error && (
            <>
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
            {latestEpisodes.length > 0 ? (
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
            ) : (
              <p className="text-gray-500 font-inter">No podcasts available yet.</p>
            )}
          </section>

          {/* All Episodes */}
          <section>
            <h2 className="font-lexend font-semibold text-gray-800 text-[1.25rem] md:text-[1.5rem] mb-4 md:mb-5">
              All Episodes
            </h2>
            {allEpisodes.length > 0 ? (
            <EpisodeList
              episodes={allEpisodes}
              onPlay={handlePlayEpisode}
              onEpisodeClick={handleEpisodeClick}
            />
            ) : (
              <p className="text-gray-500 font-inter">No podcasts available yet.</p>
            )}
          </section>
            </>
          )}
        </main>
        </div>
      )}

      {/* Player Panel - Bottom on mobile, Right side on desktop */}
      <PlayerPanel
        episode={currentEpisode}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={currentIndex < allEpisodes.length - 1 || isShuffleMode ? handleNext : undefined}
        onPrevious={currentIndex > 0 || isShuffleMode ? handlePrevious : undefined}
        isRepeatMode={isRepeatMode}
        isShuffleMode={isShuffleMode}
        onToggleRepeat={toggleRepeatMode}
        onToggleShuffle={toggleShuffleMode}
      />

      {/* Upload Podcast Dialog */}
      <Dialog 
        isOpen={isUploadOpen} 
        onClose={() => {
          setIsUploadOpen(false);
          setUploadError(null);
        }}
        title="Upload New Podcast"
      >
        <form onSubmit={handleUploadPodcast} className="space-y-5">
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-inter">
              {uploadError}
            </div>
          )}
          
          <div>
            <label htmlFor="podcast-title" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Podcast Title *
            </label>
            <input
              id="podcast-title"
              name="title"
              type="text"
              required
              disabled={uploading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="My Awesome Podcast Episode"
            />
          </div>
          
          <div>
            <label htmlFor="podcast-author" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Author *
            </label>
            <input
              id="podcast-author"
              name="author"
              type="text"
              required
              disabled={uploading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="John Doe, Jane Smith"
            />
          </div>
          
          <div>
            <label htmlFor="podcast-category" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Category
            </label>
            <input
              id="podcast-category"
              name="category"
              type="text"
              disabled={uploading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Technology, Business, etc."
            />
          </div>
          
          <div>
            <label htmlFor="podcast-description" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Description *
            </label>
            <textarea
              id="podcast-description"
              name="description"
              required
              rows={4}
              disabled={uploading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Describe your podcast episode..."
            />
          </div>
          
          <div>
            <label htmlFor="podcast-thumbnail" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Thumbnail Image
            </label>
            <input
              id="podcast-thumbnail"
              name="image"
              type="file"
              accept="image/*"
              disabled={uploading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <label htmlFor="podcast-audio" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Audio File *
            </label>
            <input
              id="podcast-audio"
              name="audio"
              type="file"
              accept="audio/*"
              required
              disabled={uploading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-inter font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {uploading ? 'Uploading...' : 'Upload Podcast'}
          </button>
        </form>
      </Dialog>
    </div>
  );
}
